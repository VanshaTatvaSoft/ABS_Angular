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
        this.registerListeners();
      })
      .catch(err => console.error('SignalR connection error: ', err));
  }

  private registerListeners(): void {
    this.hubConnection.on('Dashboard', (message: string) => {
      this.dashboardUpdated?.(message);
    });

    this.hubConnection.on('MySchedule', (message: string) => {
      this.appointmentCompleted?.(message);
    });

    this.hubConnection.on('BookAppointments', (message: string) => {
      this.appointmentBooked?.(message);
    })

    this.hubConnection.on('Notification', (message: string) => {
      this.notificationOccur?.(message);
    })

    this.hubConnection.on('MyBookings', (message: string) => {
      this.myBookings?.(message);
    })

    this.hubConnection.on('MyService', (message: string) => {
      this.myService?.(message);
    })

    this.hubConnection.on('Provider', (message: string) => {
      this.provider?.(message);
    })

    this.hubConnection.on('Service', (message: string) => {
      this.service?.(message);
    })
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

}
