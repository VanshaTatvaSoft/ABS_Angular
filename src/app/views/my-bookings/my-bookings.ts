import { Component, OnInit } from '@angular/core';
import { MyBookingViewModel } from '../../core/models/my-booking.interface';
import { MyBookingService } from '../../core/services/my-booking-service/my-booking-service';
import { CommonModule, formatDate } from '@angular/common';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import Swal from 'sweetalert2';
import { RescheduleAppointment } from './reschedule-appointment/reschedule-appointment';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../core/services/loader-service/loader-service';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule, GenericTable, MatButtonModule, MatIconModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookings implements OnInit {
  data!: MyBookingViewModel;

  columns = [
    { key: 'serial', header: '#', sortable: false },
    { key: 'providerName', header: 'Provider Name', sortable: false },
    { key: 'service', header: 'Service', sortable: false },
    { key: 'servicePrice', header: 'Service Price', sortable: false },
    { key: 'appointmentId', header: 'Appointment Id', hidden: true },
    { key: 'appointmentDate', header: 'Appointment Date', sortable: false },
    { key: 'startTime', header: 'Start Time', sortable: false },
    { key: 'endTime', header: 'End Time', sortable: false },
  ];

  constructor(private myBookingService: MyBookingService, private timeFormatService: TimeFormatService, private toastService: SweetToastService, private dialog: MatDialog, private signalrService: SignalrService) {
    this.loadData();
  }

  ngOnInit(): void {
    this.signalrService.startConnection();
    this.signalrService.appointmentCompleted = (msg) => {
      this.loadData();
    }
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
    if(!this.checkCancelAppointment(appointmentDate, this.timeFormatService.transform(appointmentStartTime , '24hr'))){
      this.toastService.showError('You can not cancel appointment one hour before the appointment starts.');
      return;
    }

    Swal.fire({
      title: "Cancel Appointment",
      text: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if(result.isConfirmed){
        this.myBookingService.cancelAppointment(appointmentId).subscribe({
          next: (res) => {
            if(res.success){
              this.toastService.showSuccess(res.message || 'Appointment cancel successfully');
            } else {
              this.toastService.showError(res.message || 'Error placing appointment');
            }
            this.loadData();
          },
          error: (err) => {
            this.toastService.showError('Something went wrong');
          }
        });
      }
    })
  }

  rescheduleAppointment(appointmentId: number, appointmentStartTime: string, appointmentDate: string){
    if(!this.checkCancelAppointment(appointmentDate, this.timeFormatService.transform(appointmentStartTime , '24hr'))){
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
      disableClose: true,     // ✅ Prevents closing via outside click
      autoFocus: false,       // Optional: prevent auto focus on first input
      data: { appointmentId, appointmentDate}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  checkCancelAppointment(appDate: string, appStartTime: string): boolean {
    try {
      if (!appDate || !appStartTime) return false;

      const [day, month, year] = appDate.split('/').map(Number);
      const [hours, minutes] = appStartTime.split(':').map(Number);

      if ( isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes) ) return false;

      const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
      const oneHourBefore = new Date(appointmentDateTime.getTime() - 60 * 60 * 1000);
      const now = new Date();

      if ((now >= oneHourBefore && appointmentDateTime.toDateString() <= now.toDateString())) return false;

      return true;
    } catch (err) {
      return false;
    }
  }

}
