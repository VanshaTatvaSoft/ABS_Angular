import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { BookAppointmentInterface } from '../../models/book-appointment.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AvailableSlotsViewModel } from '../../models/available-slot.interface';
import { ResponseInterface } from '../../models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = `${environment.apiBaseUrl}/BookAppointment`;

  constructor(private http: HttpClient) {}

  getDataForBooking(): Observable<BookAppointmentInterface>{
    return this.http.get<BookAppointmentInterface>(`${this.baseUrl}/getBookAppointment`);
  }

  getProviders(
    date: string,
    startTime: string,
    endTime: string,
    serviceId: number
  ): Observable<BookAppointmentInterface> {
    const params = new HttpParams()
      .set('date', date)
      .set('startTime', startTime)
      .set('endTime', endTime)
      .set('serviceId', serviceId.toString());

    return this.http.get<BookAppointmentInterface>(`${this.baseUrl}/providers`, { params });
  }

  getAvailableSlots(
    date: string,
    startTime: string,
    endTime: string,
    serviceId: number,
    providerId: number
  ): Observable<AvailableSlotsViewModel>{
    const params = new HttpParams()
      .set('date', date)
      .set('startTime', startTime)
      .set('endTime', endTime)
      .set('serviceId', serviceId.toString())
      .set('providerId', providerId);
    return this.http.get<AvailableSlotsViewModel>(`${this.baseUrl}/slots`, { params });
  }

  bookAppointment(
    form: any,
    providerId: number,
    selectedSlot: { startTime: string, endTime: string }
  ): Observable<ResponseInterface>{
    const formData = new FormData();
    // BookingAppointmentViewModel fields
    formData.append('clientId', form.clientId);
    formData.append('clientName', form.clientName);
    formData.append('clientPhoneNo', form.clientPhoneNo);
    formData.append('clientEmail', form.clientEmail);
    formData.append('startTime', selectedSlot.startTime); // ✅ Needed
    formData.append('endTime', selectedSlot.endTime);

    const formattedDate = new Date(form.appointmentDate).toISOString().split('T')[0];
    formData.append('AppointmentDate', formattedDate);

    // Extra form fields
    formData.append('serviceId', form.serviceId.toString());
    formData.append('providerId', providerId.toString());
    // formData.append('bookingStartTime', selectedSlot.startTime);
    // formData.append('bookingEndTime', selectedSlot.endTime);

    return this.http.post<ResponseInterface>(`${this.baseUrl}/book`, formData);
  }

}
