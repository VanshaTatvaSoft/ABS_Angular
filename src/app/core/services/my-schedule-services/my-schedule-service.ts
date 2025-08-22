import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyScheduleViewModel } from '../../models/my-schedule.interface';
import { ResponseInterface } from '../../models/response.interface';
import { Notification } from '../../models/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class MyScheduleService {
  private baseUrl = `${environment.apiBaseUrl}/MySchedule`;

  constructor(private http: HttpClient) {}

  getMySchedule(
    searchData: string | null = '',
    page: number = 1,
    pageSize: number = 5,
    sortBy: string = 'appointmentDate',
    sortDirection: string = 'asc',
    filter: string = 'booked'
  ): Observable<MyScheduleViewModel>{
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize',pageSize)
      .set('sortBy',sortBy)
      .set('sortDirection',sortDirection)
      .set('filter', filter);

      if(searchData) params = params.set('searchData', searchData);

      return this.http.get<MyScheduleViewModel>(`${this.baseUrl}/list`, {params});
  }

  completeAppointment(appointmentId: number): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(`${this.baseUrl}/complete/?appointmentId=${appointmentId}`, {});
  }

  notification(): Observable<Notification[]>{
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications`);
  }

  markAsRead(notificationId: number): Observable<boolean>{
    return this.http.post<boolean>(`${this.baseUrl}/notifications/mark-read`, notificationId);
  }

  markAllAsRead(notificationIds: number[]): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/notifications/mark-all-read`, notificationIds);
  }

  getProfileImageUrl(imageName: string): string {
    return `${this.baseUrl}/${imageName}`;
  }
}
