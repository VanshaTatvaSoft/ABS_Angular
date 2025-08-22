import { Component, OnInit } from '@angular/core';
import { MyBookingViewModel } from '../../core/models/my-booking.interface';
import { MyBookingService } from '../../core/services/my-booking-service/my-booking-service';
import { CommonModule, formatDate } from '@angular/common';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { RescheduleAppointment } from './reschedule-appointment/reschedule-appointment';
import { MatDialog } from '@angular/material/dialog';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { cancelAppointmentSwalConfig, checkCancelAppointment, myBookingColumnHeader } from './my-booking.helper';
import { ConfirmationService } from '../../core/services/confirmation-service/confirmation-service';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule, GenericTable, MatButtonModule, MatIconModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  data!: MyBookingViewModel;
  columns = myBookingColumnHeader;
  constructor(private myBookingService: MyBookingService, private timeFormatService: TimeFormatService, private toastService: SweetToastService, private dialog: MatDialog, private signalrService: SignalrService, private confirmDailogService: ConfirmationService) {
    this.loadData();
  }

  ngOnInit(): void {
    this.signalrService.startConnection();
    this.signalrService.appointmentCompleted = (msg) => { this.loadData(); }
  }

  loadData(){
    this.myBookingService.getMyBookings().subscribe({
      next: (res) => {
        this.data = {
          clientId: res.clientId,
          myBookingList: res.myBookingList.map(booking => ({
            ...booking,
            appointmentDate: formatDate(booking.appointmentDate, 'dd/MM/yyyy', 'en-IN'),
            startTime: this.timeFormatService.transform(booking.startTime, '12hr'),
            endTime: this.timeFormatService.transform(booking.endTime, '12hr')
          }))
        }
      }
    });
  }

  cancelAppointment(appointmentId: number, appointmentStartTime: string, appointmentDate: string){
    if(!checkCancelAppointment(appointmentDate, this.timeFormatService.transform(appointmentStartTime , '24hr'))){
      this.toastService.showError('You can not cancel appointment one hour before the appointment starts.');
      return;
    }

    this.confirmDailogService.confirm(cancelAppointmentSwalConfig).then(confirmed => {
      if(confirmed){
        this.myBookingService.cancelAppointment(appointmentId).subscribe({
          next: (res) => {
            if(res.success) this.toastService.showSuccess(res.message || 'Appointment cancel successfully');
            else this.toastService.showError(res.message || 'Error placing appointment');
            this.loadData();
          },
          error: () =>  this.toastService.showError('Something went wrong')
        });
      }
    })
  }

  rescheduleAppointment(appointmentId: number, appointmentStartTime: string, appointmentDate: string){
    if(!checkCancelAppointment(appointmentDate, this.timeFormatService.transform(appointmentStartTime , '24hr'))){
      this.toastService.showError('You can not reschedule appointment now.');
      return;
    }
    const parts = appointmentDate.split('/'); // ['dd', 'MM', 'yyyy']
    const parsedDate = new Date(+parts[2], +parts[1] - 1, +parts[0]); // Create valid Date object
    appointmentDate = formatDate(parsedDate, 'yyyy-MM-dd', 'en-IN'); // Convert to 'yyyy-MM-dd' format using formatDate
    appointmentStartTime = this.timeFormatService.transform(appointmentStartTime , '24hr');

    const dialogRef = this.dialog.open(RescheduleAppointment, {
      width: '500px',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      data: { appointmentId, appointmentDate}
    });

    dialogRef.afterClosed().subscribe(result => { if (result) this.loadData(); });
  }

}
