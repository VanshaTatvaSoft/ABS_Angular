import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { MyBookingService } from '../../../core/services/my-booking-service/my-booking-service';
import { CommonModule, formatDate } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RescheduleAppointmentViewModel } from '../../../core/models/reschedule-appointment.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TimeFormatPipePipe } from '../../../core/pipes/time-format-pipe/time-format-pipe-pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { SlotData } from '../../../core/models/available-slot.interface';
import { LoaderService } from '../../../core/services/loader-service/loader-service';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-reschedule-appointment',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, TimeFormatPipePipe, MatNativeDateModule, MatInputModule],
  templateUrl: './reschedule-appointment.html',
  styleUrl: './reschedule-appointment.css',
  providers: [provideNativeDateAdapter()],
})
export class RescheduleAppointment implements OnInit {
  appointmentId: number | null = null;
  appontmentDate = '';
  rescheduleData!: RescheduleAppointmentViewModel;
  rescheduleForm!: FormGroup;
  minDate: string = '';

  constructor(
    private dialogRef: MatDialogRef<RescheduleAppointment>,
    @Inject(MAT_DIALOG_DATA) public data: {appointmentId: number, appointmentDate: string},
    private fb: FormBuilder,
    private toastService: SweetToastService,
    private myBookingService: MyBookingService,
    private loaderService: LoaderService
  ) {
    this.appointmentId = data.appointmentId;
    this.appontmentDate = data.appointmentDate;
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.rescheduleForm = this.fb.group({
      providerId: [''],
      serviceId: [''],
      appointmentId: [''],
      appointmentDate: [new Date(this.data.appointmentDate), Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      slotTime: ['', Validators.required]
    });

    this.getSchedule();

  }

  getSchedule(){
    this.myBookingService.getSlotsForReschedule(this.appointmentId?? 0, this.appontmentDate).subscribe({
      next: (res) => {
        this.rescheduleData = res.data;
        console.log("rescheduleData - ",this.rescheduleData);

        this.rescheduleData = res.data;

        this.rescheduleForm.patchValue({
          providerId: this.rescheduleData.providerId,
          serviceId: this.rescheduleData.serviceId,
          appointmentId: this.rescheduleData.appointmentId,
          appointmentDate: formatDate(this.rescheduleData.appointmentDate, 'yyyy-MM-dd', 'en-IN')
          // appontmentDate: new Date(this.data.appointmentDate)
        });

        this.rescheduleForm.get('slotTime')?.valueChanges.subscribe((slot: SlotData) => {
          if (slot) {
            this.rescheduleForm.patchValue({
              startTime: slot.startTime,
              endTime: slot.endTime
            });
          }
        });

        this.rescheduleForm.get('appointmentDate')?.valueChanges.subscribe(() => {
          this.appontmentDate = this.rescheduleForm.get('appointmentDate')?.value;
          this.getSlots();
        });

      }
    });
  }

  getSlots(){
    this.myBookingService.getSlotsForReschedule(this.appointmentId??0, this.appontmentDate).subscribe({
      next: (res) => {
        this.rescheduleData.slotsAvailable = res.data.slotsAvailable;
      }
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }

  submit(): void{
    console.log("form data - ", this.rescheduleForm.value);
    this.loaderService.show();
    this.myBookingService.rescheduleAppointment(this.rescheduleForm).subscribe({
      next: (res) => {
        if(res.success){
          this.toastService.showSuccess(res.message || '');
        }
        else{
          this.toastService.showError(res.message || '');
        }
        this.loaderService.hide();
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loaderService.hide();
        this.toastService.showError('Something went wrong');
      }
    });
  }

}
