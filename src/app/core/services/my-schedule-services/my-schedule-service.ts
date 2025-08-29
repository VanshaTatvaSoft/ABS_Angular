import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MyScheduleViewModel } from '../../models/my-schedule.interface';
import { ResponseInterface } from '../../models/response.interface';
import { Notification } from '../../models/notification.interface';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root',
})
export class MyScheduleService {
  private endPoint = 'MySchedule';
  private baseUrl = `${environment.apiBaseUrl}/MySchedule`;

  constructor(private generic: GenericService) {}

  getMySchedule = (
    searchData: string | null = '',
    page: number = 1,
    pageSize: number = 5,
    sortBy: string = 'appointmentDate',
    sortDirection: string = 'asc',
    filter: string = 'booked'
  ): Observable<MyScheduleViewModel> =>
    this.generic.getList<MyScheduleViewModel>(`${this.endPoint}/list`, { searchData, page, pageSize, sortBy, sortDirection, filter});

  completeAppointment = (appointmentId: number): Observable<ResponseInterface> =>
    this.generic.create<ResponseInterface>(`${this.endPoint}/complete/?appointmentId=${appointmentId}`, {});

  notification = (): Observable<Notification[]> => this.generic.getList<Notification[]>(`${this.endPoint}/notifications`);

  markAsRead = (notificationId: number): Observable<boolean> => this.generic.create<boolean>(`${this.endPoint}/notifications/mark-read`, notificationId);

  markAllAsRead = (notificationIds: number[]): Observable<boolean> => this.generic.create<boolean>(`${this.endPoint}/notifications/mark-all-read`, notificationIds);

  getProfileImageUrl = (imageName: string): string => `${this.baseUrl}/${imageName}`;

}
