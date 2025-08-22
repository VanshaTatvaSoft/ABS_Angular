import { Component, OnInit } from '@angular/core';
import { MyScheduleViewModel } from '../../core/models/my-schedule.interface';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyScheduleService } from '../../core/services/my-schedule-services/my-schedule-service';
import { CommonModule, formatDate } from '@angular/common';
import { CustomInput } from '../../shared/components/custom-input/custom-input';
import { MYSCHEDULEFILTEROPTION } from '../../shared/constants/my-schedule-filter-options.constant';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';
import { Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../../core/services/loader-service/loader-service';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { Workbook } from 'exceljs';
import fs from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-my-schedule',
  imports: [CommonModule, CustomInput, ReactiveFormsModule, GenericTable, MatIconModule, MatButtonModule],
  templateUrl: './my-schedule.html',
  styleUrl: './my-schedule.css',
})
export class MySchedule implements OnInit {
  data?: MyScheduleViewModel;
  entireData?: MyScheduleViewModel;
  searchControl = new FormControl('');
  filterOptions = MYSCHEDULEFILTEROPTION;
  filterForm: FormGroup;
  userName = '';
  userImg: string | null = null;

  totalCount = 0;
  page = 1;
  pageSize = 5;
  sortBy = 'appointmentDate';
  sortDirection = 'asc';
  searchData: string | null = '';
  filter = 'booked';

  columns = [
    { key: 'serial', header: '#', sortable: false },
    { key: 'clientName', header: 'Client Name', sortable: true },
    { key: 'service', header: 'Service', sortable: false },
    { key: 'servicePrice', header: 'Service Price', sortable: true },
    { key: 'appointmentDate', header: 'Appointment Date', sortable: true },
    { key: 'startTime', header: 'Start Time', sortable: false },
    { key: 'endTime', header: 'End Time', sortable: false }
  ];

  constructor(private myScheduleService: MyScheduleService, private fb: FormBuilder, private timeFormatService: TimeFormatService, private toastService: SweetToastService, private loaderService: LoaderService, private signalrService: SignalrService, private authService: AuthService) {
    this.filterForm = this.fb.group({
      filterOption: ['booked']
    })
    this.userName = authService.getUserName();
    this.authService.userImage$.subscribe(url => {
      this.userImg = url;
    });
  }

  get filterOptionControl(): FormControl {
    return this.filterForm.get('filterOption') as FormControl;
  }

  ngOnInit(): void {
    this.signalrService.startConnection();
    this.signalrService.appointmentBooked = (msg) => {
      this.loadData();
    }
    this.loadData();

    this.searchControl.valueChanges
      .pipe( debounceTime(300), distinctUntilChanged())
      .subscribe((value: string | null) => { this.searchData = value; this.loadData(); });
  }

  loadData(){
    this.myScheduleService.getMySchedule(this.searchData, this.page, this.pageSize, this.sortBy, this.sortDirection, this.filter).subscribe({
      next: (res) => {
        res.myScheduleList = res.myScheduleList.map(schedule => ({
          ...schedule,
          appointmentDate: formatDate(schedule.appointmentDate, 'dd/MM/yyyy', 'en-IN'),
          startTime: this.timeFormatService.transform(schedule.startTime, '12hr'),
          endTime: this.timeFormatService.transform(schedule.endTime, '12hr')
        }));
        this.data = res;
        this.totalCount = res.mySchedulePagination.totalRecord;
      }
    })
  }

  getEntireData(): Promise<MyScheduleViewModel> {
    return new Promise((resolve, reject) => {
      this.myScheduleService.getMySchedule(this.searchData, -1, -1, this.sortBy, this.sortDirection, this.filter).subscribe({
        next: (res) => {
          res.myScheduleList = res.myScheduleList.map(schedule => ({
            ...schedule,
            appointmentDate: formatDate(schedule.appointmentDate, 'dd/MM/yyyy', 'en-IN'),
            startTime: this.timeFormatService.transform(schedule.startTime, '12hr'),
            endTime: this.timeFormatService.transform(schedule.endTime, '12hr')
          }));
          this.entireData = res;
          resolve(res);
        },
        error: (err) => reject(err)
      });
    });
  }

  onFilterChange(newOption: string){
    this.filter = newOption;
    this.loadData();
  }

  onPageChange(event: any){
    this.pageSize = event.pageSize;
    this.page = event.pageIndex + 1;
    this.loadData();
  }

  onSortChange(sort: Sort){
    this.sortBy = sort.direction ? sort.active : 'appointmentDate';
    this.sortDirection = sort.direction || 'asc';
    this.loadData();
  }

  completeAppointment(appointmentId: number, appointmentDate: string, startTime:string){
    if (!this.checkCancelAppointment(appointmentDate, startTime)) {
      this.toastService.showError('You can only complete appointment that has started.');
      return;
    }
    Swal.fire({
      title: "Complete Appointment",
      text: "Are you sure you want to complete this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes, complete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if(result.isConfirmed){
        this.loaderService.show();
        this.myScheduleService.completeAppointment(appointmentId).subscribe({
          next: (res) => {
            if(res.success){
              this.toastService.showSuccess(res.message || "Appointment completed successfully.")
            }
            else{
              this.toastService.showError(res.message || "Error completing appointment.")
            }
            this.loadData();
            this.loaderService.hide();
          },
          error: () => {
            this.toastService.showError("Something went wrong");
            this.loaderService.hide();
          }
        });
      }
    })
  }

  checkCancelAppointment(appDate: string, appStartTime: string): boolean {
    try {
      if (!appDate || !appStartTime) return false;

      const [day, month, year] = appDate.split('/').map(Number);
      appStartTime = this.timeFormatService.transform(appStartTime, '24hr');
      const [hours, minutes] = appStartTime.split(':').map(Number);

      if (
        isNaN(day) || isNaN(month) || isNaN(year) ||
        isNaN(hours) || isNaN(minutes)
      ) {
        return false;
      }

      const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);

      const now = new Date();
      const appointmentDay = formatDate(appointmentDateTime, 'yyyy-MM-dd', 'en-IN');
      const today = formatDate(now, 'yyyy-MM-dd', 'en-IN');

      if (appointmentDay < today) return true;

      if (appointmentDay === today) {
        return appointmentDateTime <= now;
      }

      return false;
    } catch (err) {
      console.error('Error parsing date/time:', err);
      return false;
    }
  }

  async exportToExcel() {
    await this.getEntireData();
    if (!this.data?.myScheduleList || this.data?.myScheduleList.length === 0) {
      this.toastService.showError('No schedule data available to export.');
      return;
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('My Schedule');
    let userRow = worksheet.addRow([]);
    userRow.getCell(1).value = {
      richText: [
        { text: 'User: ', font: { bold: true } },
        { text: this.userName || '' }
      ]
    };
    let filterRow = worksheet.addRow([]);
    filterRow.getCell(1).value = {
      richText: [
        { text: 'Filter: ', font: { bold: true } },
        { text: this.filter.toUpperCase() || '' }
      ]
    };
    let searchRow = worksheet.addRow([]);
    searchRow.getCell(1).value = {
      richText: [
        { text: 'Search: ', font: { bold: true } },
        { text: this.searchData || '' }
      ]
    };
    let sortByRow = worksheet.addRow([]);
    sortByRow.getCell(1).value = {
      richText: [
        { text: 'Sort By: ', font: { bold: true } },
        { text: this.sortBy.toUpperCase() || '' }
      ]
    };
    let sortDirectionRow = worksheet.addRow([]);
    sortDirectionRow.getCell(1).value = {
      richText: [
        { text: 'Sort Direction: ', font: { bold: true } },
        { text: this.sortDirection.toUpperCase() || '' }
      ]
    };

    worksheet.addRow([]);

    // if (this.userImg){
    //   try{
    //     const response = await fetch(this.userImg, { credentials: 'include' });
    //     const blob = await response.blob();
    //     const buffer = await blob.arrayBuffer();

    //     const imageId = workbook.addImage({
    //       buffer: buffer,
    //       extension: 'png'
    //     });

    //     worksheet.addImage(imageId, {
    //       tl: { col: 0, row: 0 },
    //       ext: { width: 80, height: 80 }
    //     });

    //     worksheet.getRow(1).height = 60;
    //   } catch (err) {
    //     console.error('Error fetching profile image:', err);
    //   }
    // }

    const headers = this.columns.map(c => c.header);
    worksheet.addRow(headers);

    this.entireData?.myScheduleList.forEach((item, index) => {
      const row = worksheet.addRow([
        index + 1,
        item.clientName,
        item.service,
        item.servicePrice,
        item.appointmentDate,
        item.startTime,
        item.endTime
      ]);
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    worksheet.getRow(worksheet.lastRow!.number - this.entireData!.myScheduleList.length).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCCC' }
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    fs.saveAs(blob, `MySchedule_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  async exportToPdf() {
    await this.getEntireData();
    if (!this.data?.myScheduleList || this.data?.myScheduleList.length === 0) {
      this.toastService.showError('No schedule data available to export.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Provider: ${this.userName}`, 14, 20);
    if (this.userImg) {
      try {
        const imgPath = this.userImg.split("/").pop();
        const imageUrl = this.myScheduleService.getProfileImageUrl(imgPath!);
        const response = await fetch(imageUrl, { mode: "cors", credentials: "include" });
        const blob = await response.blob();

        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // Draw circular cropped image using canvas
        const circularImage = await new Promise<string>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const size = 60; // adjust size
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d")!;

            // Clip in a circle
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(img, 0, 0, size, size);
            resolve(canvas.toDataURL("image/png"));
          };
          img.src = base64;
        });

        doc.addImage(circularImage, "PNG", 160, 10, 30, 30); // x,y,w,h
      } catch (err) {
        console.error("Error loading profile image:", err);
      }
    }


    doc.setFontSize(12);
    doc.text(`Filter: ${this.filter.toUpperCase()}`, 14, 35);
    doc.text(`Search: ${this.searchData || ''}`, 14, 42);
    doc.text(`Sort By: ${this.sortBy.toUpperCase()}`, 14, 49);
    doc.text(`Sort Direction: ${this.sortDirection.toUpperCase()}`, 14, 56);

    const headers = this.columns.map(c => c.header);
    const entireData = this.entireData?.myScheduleList.map((item, index) => [
      index + 1,
      item.clientName,
      item.service,
      item.servicePrice,
      item.appointmentDate,
      item.startTime,
      item.endTime
    ]);
    autoTable(doc, {
      startY: 65,
      head: [headers],
      body: entireData,
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220], textColor: 20, halign: 'center' },
      bodyStyles: { halign: 'center', valign: 'middle' },
      styles: { fontSize: 10 },
    });

    doc.save(`MySchedule_${new Date().toISOString().split('T')[0]}.pdf`);
  }

}
