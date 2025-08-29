import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookAppointmentInterface } from '../../models/book-appointment.interface';
import { AvailableSlotsViewModel } from '../../models/available-slot.interface';
import { ResponseInterface } from '../../models/response.interface';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private endPoint = 'BookAppointment';

  constructor(private generic: GenericService) {}

  getDataForBooking = (): Observable<BookAppointmentInterface> => this.generic.getList<BookAppointmentInterface>(`${this.endPoint}/getBookAppointment`);

  getProviders = (date: string, startTime: string, endTime: string, serviceId: number) :Observable<BookAppointmentInterface> =>
    this.generic.getList<BookAppointmentInterface>(`${this.endPoint}/providers`, {date, startTime, endTime, serviceId: serviceId.toString()});

  getAvailableSlots = ( date: string, startTime: string, endTime: string, serviceId: number, providerId: number ) : Observable<AvailableSlotsViewModel> =>
    this.generic.getList<AvailableSlotsViewModel>(`${this.endPoint}/slots`, {date, startTime, endTime, serviceId: serviceId.toString(), providerId});

  bookAppointment(
    form: any,
    providerId: number,
    selectedSlot: { startTime: string, endTime: string }
  ): Observable<ResponseInterface>{
    const formData = new FormData();
    formData.append('clientId', form.clientId);
    formData.append('clientName', form.clientName);
    formData.append('clientPhoneNo', form.clientPhoneNo);
    formData.append('clientEmail', form.clientEmail);
    formData.append('startTime', selectedSlot.startTime);
    formData.append('endTime', selectedSlot.endTime);

    const formattedDate = new Date(form.appointmentDate).toISOString().split('T')[0];
    formData.append('AppointmentDate', formattedDate);

    formData.append('serviceId', form.serviceId.toString());
    formData.append('providerId', providerId.toString());

    return this.generic.create<ResponseInterface>(`${this.endPoint}/book`, formData);
  }

}
