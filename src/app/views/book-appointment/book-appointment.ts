import { Component } from '@angular/core';
import { BookingService } from '../../core/services/booking-service/booking-service';
import { BookAppointmentInterface } from '../../core/models/book-appointment.interface';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { AvailableSlotsViewModel } from '../../core/models/available-slot.interface';
import { MatDialog } from '@angular/material/dialog';
import { SelectSlot } from './select-slot/select-slot';
import { LoaderService } from '../../core/services/loader-service/loader-service';
import { Router } from '@angular/router';
import { bookAppointmentColumnHeader, BookingFormConfig, buildBookingForm, extractBookingFormValues } from './book-appointment.helper';
import { GenericInput } from '@vanshasomani/generic-input';
import { openDailog } from '../../core/util/dailog-helper/dailog-helper';

@Component({
  selector: 'app-book-appointment',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, NgxMaterialTimepickerModule, MatSelectModule, TimeFormatPipePipe, GenericTable, GenericInput],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css'
})
export class BookAppointment {
  data? : BookAppointmentInterface;
  bookingForm!: FormGroup;
  bookingFormConfig = BookingFormConfig;
  minDate: Date = new Date();
  availableSlots! : AvailableSlotsViewModel;
  providerId : number | null = null;
  selectedSlot: { startTime: string; endTime: string } | null = null;

  columns = bookAppointmentColumnHeader;

  constructor(private bookingService: BookingService, private fb: FormBuilder, private dialog: MatDialog, private timeFormatService: TimeFormatService, private toastService: SweetToastService, private loaderService: LoaderService, private router: Router){
    this.loadData();
  }

  loadData(){
    this.bookingService.getDataForBooking().subscribe({
      next: (res) => {
        this.data = res;
        this.bookingForm = buildBookingForm(this.fb, this.data, this.timeFormatService);

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
          this.providerId = null;
          this.selectedSlot = null;
          this.searchProvider();
        });

      }
    });
  }

  getControl(name: string): FormControl {
    return this.bookingForm.get(name) as FormControl;
  }

  searchProvider(){
    const { appointmentDate, startTime, endTime, serviceId } = extractBookingFormValues(this.bookingForm.value, this.timeFormatService);
    if(appointmentDate || startTime || endTime || serviceId){
      this.bookingService.getProviders(appointmentDate, startTime, endTime, serviceId).subscribe({
        next: (res) => {
          this.data!.providerList = res.providerList;
        }
      });
    }
  }

  bookSlotBtnClicked(providerId: number){
    const { appointmentDate, startTime, endTime, serviceId } = extractBookingFormValues(this.bookingForm.value, this.timeFormatService);
    this.providerId = providerId;
    if(appointmentDate || startTime || endTime || serviceId || providerId){
      this.bookingService.getAvailableSlots(appointmentDate, startTime, endTime, serviceId, providerId).subscribe({
        next: (res) => {
          this.availableSlots = res;
          let slotData = {availableSlot: this.availableSlots, providerId: this.providerId, appointmentDate: appointmentDate, startTime: startTime, endTime: endTime, serviceId: serviceId};
          openDailog(this.dialog, SelectSlot, '500px', slotData, '90vh').subscribe(result => result ? this.selectedSlot = result : null);
        }
      });
    }
  }

  reset(){
    this.providerId = null;
    this.selectedSlot = null;
    this.data!.providerList = [];
    this.bookingForm.reset();
    this.bookingForm = buildBookingForm(this.fb, this.data, this.timeFormatService);
  }

  submit(){
    if (this.bookingForm.invalid || !this.providerId || !this.selectedSlot) {
      this.toastService.showError('Please complete the form and select a slot.');
      return;
    }
    const formattedDate = formatDate(this.bookingForm.value.appointmentDate, 'yyyy-MM-dd', 'en-IN');
    this.bookingForm.patchValue({ appointmentDate: formattedDate });
    this.loaderService.show();
    this.bookingService.bookAppointment(this.bookingForm.value, this.providerId, this.selectedSlot).subscribe({
      next: (res) => {
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Appointment booked successfully' : 'Error booking appointment'))
        if(res.success) this.router.navigate(['/my-bookings']);
      },
      error: () => this.toastService.showError('Something went wrong'),
      complete: () => this.loaderService.hide()
    });
  }

}
