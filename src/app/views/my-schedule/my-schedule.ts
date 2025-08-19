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

@Component({
  selector: 'app-my-schedule',
  imports: [CommonModule, CustomInput, ReactiveFormsModule, GenericTable, MatIconModule, MatButtonModule],
  templateUrl: './my-schedule.html',
  styleUrl: './my-schedule.css',
})
export class MySchedule implements OnInit {
  data?: MyScheduleViewModel;
  searchControl = new FormControl('');
  filterOptions = MYSCHEDULEFILTEROPTION;
  filterForm: FormGroup;

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

  constructor(private myScheduleService: MyScheduleService, private fb: FormBuilder, private timeFormatService: TimeFormatService, private toastService: SweetToastService, private loaderService: LoaderService, private signalrService: SignalrService) {
    this.filterForm = this.fb.group({
      filterOption: ['booked']
    })
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
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: string | null) => {
        this.searchData = value;
        this.loadData();
      });
  }

  loadData(){
    this.myScheduleService.getMySchedule(this.searchData, this.page, this.pageSize, this.sortBy, this.sortDirection, this.filter).subscribe({
      next: (res) => {
        res.myScheduleList = res.myScheduleList.map(schedule => ({
          ...schedule,
          appointmentDate: formatDate(schedule.appointmentDate, 'dd/MM/yyyy', 'en-IN'),
          startTime: this.timeFormatService.transform(schedule.startTime, 'short'),
          endTime: this.timeFormatService.transform(schedule.endTime, 'short')
        }));
        this.data = res;
        this.totalCount = res.mySchedulePagination.totalRecord;
        console.log(this.data);
      }
    })
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

}
