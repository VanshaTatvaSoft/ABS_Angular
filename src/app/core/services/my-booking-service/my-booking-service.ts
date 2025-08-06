import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MyBookingViewModel } from '../../models/my-booking.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseInterface } from '../../models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class MyBookingService {
  private baseUrl = `${environment.apiBaseUrl}/MyBookings`;

  constructor(private http: HttpClient) {}

  getMyBookings(): Observable<MyBookingViewModel>{
    return this.http.get<MyBookingViewModel>(`${this.baseUrl}/list`);
  }

  cancelAppointment(appointmentId: number): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(`${this.baseUrl}/cancel/?appointmentId=${appointmentId}`, {});
  }

  getSlotsForReschedule(appointmentId: number, appointmentDate: string): Observable<ResponseInterface>{
    const params = new HttpParams()
                    .set('appointmentId', appointmentId)
                    .set('selectedDate', appointmentDate);

    return this.http.get<ResponseInterface>(`${this.baseUrl}/reschedule-json`, {params});
  }

  rescheduleAppointment(form: any): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(`${this.baseUrl}/reschedule`, form.value);
  }

  checkRatting(appointmentId: number): Observable<boolean>{
    return this.http.get<boolean>(`${this.baseUrl}/rating/${appointmentId}`)
  }

  ratting(rattingValue: any): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(`${this.baseUrl}/rating`, rattingValue);
  }

}
