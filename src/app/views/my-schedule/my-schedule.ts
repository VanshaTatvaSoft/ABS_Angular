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
import { LoaderService } from '../../core/services/loader-service/loader-service';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { ConfirmationService } from '../../core/services/confirmation-service/confirmation-service';
import { checkCancelAppointment, CompleteAppointmentConfirmationDailog, exportToExcelHelper, exportToPdf, MyScheduleColumns } from './my-schedule.helper';

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

  columns = MyScheduleColumns;

  constructor(private myScheduleService: MyScheduleService, private fb: FormBuilder, private timeFormatService: TimeFormatService, private toastService: SweetToastService, private loaderService: LoaderService, private signalrService: SignalrService, private authService: AuthService, private confirmDailogService: ConfirmationService) {
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
    if (!checkCancelAppointment(appointmentDate, startTime, this.timeFormatService)) {
      this.toastService.showError('You can only complete appointment that has started.');
      return;
    }
    this.confirmDailogService.confirm(CompleteAppointmentConfirmationDailog).then(confirmed => {
      if(confirmed){
        this.loaderService.show();
        this.myScheduleService.completeAppointment(appointmentId).subscribe({
          next: (res) => {
            this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? "Appointment completed successfully." : "Error completing appointment."));
            this.loadData();
            this.loaderService.hide();
          },
          error: () => {
            this.toastService.showError("Something went wrong");
            this.loaderService.hide();
          }
        });
      }
    });
  }

  async exportToExcel() {
    await this.getEntireData();
    if (!this.data?.myScheduleList || this.data?.myScheduleList.length === 0) {
      this.toastService.showError('No schedule data available to export.');
      return;
    }

    exportToExcelHelper(
      this.entireData!,
      this.columns,
      this.authService.getUserName(),
      this.filter,
      this.searchData,
      this.sortBy,
      this.sortDirection
    )
  }

  async exportToPdf() {
    await this.getEntireData();
    if (!this.data?.myScheduleList || this.data?.myScheduleList.length === 0) {
      this.toastService.showError('No schedule data available to export.');
      return;
    }

    exportToPdf(
      this.entireData!,
      this.columns,
      this.authService.getUserName(),
      this.filter,
      this.searchData,
      this.sortBy,
      this.sortDirection,
      this.authService.getUserImage(),
      this.myScheduleService.getProfileImageUrl.bind(this.myScheduleService)
    )
  }

}
