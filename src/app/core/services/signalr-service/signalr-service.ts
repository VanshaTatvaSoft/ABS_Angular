import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  cookieService = inject(CookieService);

  public dashboardUpdated?: (msg: string) => void;
  public appointmentCompleted?: (msg: string) => void;
  public appointmentBooked?: (msg: string) => void;
  public notificationOccur?: (msg: string) => void;
  public myBookings?: (msg: string) => void;
  public myService?: (msg: string) => void;
  public provider?: (msg: string) => void;
  public service?: (msg: string) => void;

  public startConnection(): void{

    if(this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected){
      return;
    }

    const token = this.cookieService.get('accessToken');

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5198/hubs/notifications', {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.registerListeners();
      })
      .catch(err => console.error('SignalR connection error: ', err));
  }

  private registerListeners(): void {
    this.hubConnection.on('Dashboard', (message: string) => {
      console.log('Dashboard event received:', message);
      this.dashboardUpdated?.(message);
    });

    this.hubConnection.on('MySchedule', (message: string) => {
      console.log('Appointment completed:', message);
      this.appointmentCompleted?.(message);
    });

    this.hubConnection.on('BookAppointments', (message: string) => {
      console.log('Appointment booked:',message);
      this.appointmentBooked?.(message);
    })

    this.hubConnection.on('Notification', (message: string) => {
      console.log('Notification :',message);
      this.notificationOccur?.(message);
    })

    this.hubConnection.on('MyBookings', (message: string) => {
      console.log('MyBookings :',message);
      this.myBookings?.(message);
    })

    this.hubConnection.on('MyService', (message: string) => {
      console.log('MyService :',message);
      this.myService?.(message);
    })

    this.hubConnection.on('Provider', (message: string) => {
      console.log('Provider :',message);
      this.provider?.(message);
    })

    this.hubConnection.on('Service', (message: string) => {
      console.log('Service :',message);
      this.service?.(message);
    })
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

}
