import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../core/services/booking-service/booking-service';
import { BookAppointmentInterface } from '../../core/models/book-appointment.interface';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PhoneNumberValidator } from '../../shared/validators/phone-number.validator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';
import { MatSelectModule } from '@angular/material/select';
import { TimeFormatPipePipe } from '../../core/pipes/time-format-pipe/time-format-pipe-pipe';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { TimeRangeValidator } from '../../shared/validators/start-end-time.validator';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { combineLatest, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AvailableSlotsViewModel } from '../../core/models/available-slot.interface';
import { MatDialog } from '@angular/material/dialog';
import { SelectSlot } from './select-slot/select-slot';
import { LoaderService } from '../../core/services/loader-service/loader-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-appointment',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, NgxMaterialTimepickerModule, MatSelectModule, TimeFormatPipePipe, GenericTable],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css'
})
export class BookAppointment {
  data? : BookAppointmentInterface;
  bookingForm!: FormGroup;
  minDate: Date = new Date();
  availableSlots! : AvailableSlotsViewModel;
  providerId : number | null = null;
  selectedSlot: { startTime: string; endTime: string } | null = null;

  columns = [
    { key: 'serial', header: '#', sortable: false },
    { key: 'providerName', header: 'Provider Name', sortable: false },
    { key: 'providerEmail', header: 'Provider Email', sortable: false },
    { key: 'providerPhoneNo', header: 'Provider Phone No.', sortable: false },
  ];

  constructor(private bookingService: BookingService, private fb: FormBuilder, private dialog: MatDialog, private timeFormatService: TimeFormatService, private toastService: SweetToastService, private loaderService: LoaderService, private router: Router){
    this.loadData();
  }

  loadData(){
    this.bookingService.getDataForBooking().subscribe({
      next: (res) => {
        this.data = res;

        this.bookingForm = this.fb.group({
          clientId: [this.data?.clientId??null],
          clientName: [this.data?.clientName??'', Validators.required],
          clientPhoneNo: [this.data?.clientPhoneNo.toString()??null, [Validators.required, PhoneNumberValidator]],
          clientEmail: [this.data?.clientEmail??null],
          appointmentDate: ['',Validators.required],
          endTime: ['',Validators.required],
          startTime: ['',Validators.required],
          serviceId: ['',Validators.required]
        },
        {
          validators: [TimeRangeValidator(this.timeFormatService, this.data.serviceList)]
        });

        combineLatest([
          this.bookingForm.get('appointmentDate')!.valueChanges,
          this.bookingForm.get('startTime')!.valueChanges,
          this.bookingForm.get('endTime')!.valueChanges,
          this.bookingForm.get('serviceId')!.valueChanges
        ])
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.searchProvider();
        });
      }
    });
  }

  searchProvider(){
    const appointmentDate = formatDate(this.bookingForm.value.appointmentDate, 'yyyy-MM-dd', 'en-IN');
    const startTime = this.timeFormatService.transform(this.bookingForm.value.startTime, '24hr');
    const endTime = this.timeFormatService.transform(this.bookingForm.value.endTime, '24hr');
    const serviceId = this.bookingForm.value.serviceId;
    if(appointmentDate || startTime || endTime || serviceId){
      this.bookingService.getProviders(appointmentDate, startTime, endTime, serviceId).subscribe({
        next: (res) => {
          this.data!.providerList = res.providerList;
        }
      });
    }
  }

  bookSlotBtnClicked(providerId: number){
    const appointmentDate = formatDate(this.bookingForm.value.appointmentDate, 'yyyy-MM-dd', 'en-IN');
    const startTime = this.timeFormatService.transform(this.bookingForm.value.startTime, '24hr');
    const endTime = this.timeFormatService.transform(this.bookingForm.value.endTime, '24hr');
    const serviceId = this.bookingForm.value.serviceId;
    this.providerId = providerId;
    if(appointmentDate || startTime || endTime || serviceId || providerId){
      this.bookingService.getAvailableSlots(appointmentDate, startTime, endTime, serviceId, providerId).subscribe({
        next: (res) => {
          this.availableSlots = res;
          const dialogRef = this.dialog.open(SelectSlot, {
            width: '500px',
            maxHeight: '90vh',
            disableClose: true,
            autoFocus: false,
            panelClass: 'custom-dialog-class',
            data: {availableSlot: this.availableSlots, providerId: this.providerId, appointmentDate: appointmentDate, startTime: startTime, endTime: endTime, serviceId: serviceId}
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              console.log('result - ', result);
              console.log('Form Value - ',this.bookingForm.value)
              this.selectedSlot = result;
            }
          });
        }
      });
    }
  }

  reset(){
    this.providerId = null;
    this.selectedSlot = null;
    this.data!.providerList = [];

    this.bookingForm.patchValue({
      appointmentDate: '',
      startTime: '',
      endTime: '',
      serviceId: ''
    });

    this.bookingForm.get('appointmentDate')?.markAsPristine();
    this.bookingForm.get('appointmentDate')?.markAsUntouched();
    this.bookingForm.get('startTime')?.markAsPristine();
    this.bookingForm.get('startTime')?.markAsUntouched();
    this.bookingForm.get('endTime')?.markAsPristine();
    this.bookingForm.get('endTime')?.markAsUntouched();
    this.bookingForm.get('serviceId')?.markAsPristine();
    this.bookingForm.get('serviceId')?.markAsUntouched();

    this.bookingForm.updateValueAndValidity();
  }

  submit(){
    if (this.bookingForm.invalid || !this.providerId || !this.selectedSlot) {
      this.toastService.showError('Please complete the form and select a slot.');
      return;
    }
    const formattedDate = formatDate(this.bookingForm.value.appointmentDate, 'yyyy-MM-dd', 'en-IN');
    this.bookingForm.patchValue({
      appointmentDate: formattedDate
    });

    this.loaderService.show();
    this.bookingService.bookAppointment(this.bookingForm.value, this.providerId, this.selectedSlot).subscribe({
      next: (res) => {
        if(res.success){
          this.toastService.showSuccess(res.message || 'Appointment booked successfully');
          this.router.navigate(['/my-bookings']);
        }
        else{
          this.toastService.showError(res.message || 'Error booking appointment');
        }
        this.loaderService.hide();
      },
      error: (err) => {
        this.toastService.showError('Something went wrong');
        this.loaderService.hide();
      }
    });

  }
}
