import { Component, Inject, OnInit } from '@angular/core';
import { AvailableSlotsViewModel } from '../../../core/models/available-slot.interface';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BookingService } from '../../../core/services/booking-service/booking-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimeFormatPipePipe } from '../../../core/pipes/time-format-pipe/time-format-pipe-pipe';
import { SignalrService } from '../../../core/services/signalr-service/signalr-service';

@Component({
  selector: 'app-select-slot',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatCheckboxModule, MatProgressSpinnerModule, TimeFormatPipePipe],
  templateUrl: './select-slot.html',
  styleUrl: './select-slot.css'
})
export class SelectSlot implements OnInit{
  bookingStartTime = '';
  bookingEndTime = '';
  selectedSlot: { startTime: string; endTime: string } | null = null;

  constructor(
    private dialogRef: MatDialogRef<SelectSlot>,
    @Inject(MAT_DIALOG_DATA) public data: {
      availableSlot: AvailableSlotsViewModel,
      providerId: number,
      appointmentDate: string,
      startTime: string,
      endTime: string,
      serviceId: number
    },
    private bookingService: BookingService,
    private toastService: SweetToastService,
    private signalrService: SignalrService
  ) {}

  ngOnInit(): void {
    this.signalrService.startConnection();
    this.signalrService.appointmentBooked = (msg) => { if(msg == this.data.providerId.toString()) this.loadData(); }
  }

  loadData(){
    this.bookingService.getAvailableSlots(this.data.appointmentDate, this.data.startTime, this.data.endTime, this.data.serviceId, this.data.providerId).subscribe({
      next: (res) => {
        this.data.availableSlot = res
      }
    });
  }

  close = (): void => this.dialogRef.close(false);

  slotSelected(startTime: string, endTime: string): void{
    this.bookingStartTime = startTime;
    this.bookingEndTime = endTime;
    this.selectedSlot = { startTime, endTime };
  }

  submit(): void {
    if (!this.bookingStartTime || !this.bookingEndTime) {
      this.toastService.showError('Please select a time slot.');
      return;
    }
    this.dialogRef.close({
      startTime: this.bookingStartTime,
      endTime: this.bookingEndTime
    });
  }

}
