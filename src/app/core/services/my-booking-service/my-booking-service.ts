import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyBookingViewModel } from '../../models/my-booking.interface';
import { ResponseInterface } from '../../models/response.interface';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class MyBookingService {
  private entryPoint = 'MyBookings';

  constructor(private generic: GenericService) {}

  getMyBookings = (): Observable<MyBookingViewModel> => this.generic.getList<MyBookingViewModel>(`${this.entryPoint}/list`);

  cancelAppointment = (appointmentId: number): Observable<ResponseInterface> =>
    this.generic.create<ResponseInterface>(`${this.entryPoint}/cancel/?appointmentId=${appointmentId}`, {});


  getSlotsForReschedule = (appointmentId: number, appointmentDate: string): Observable<ResponseInterface> =>
    this.generic.getList<ResponseInterface>(`${this.entryPoint}/reschedule-json`,{ appointmentId, selectedDate: appointmentDate });

  rescheduleAppointment = (form: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.entryPoint}/reschedule`, form.value);

  checkRatting = (appointmentId: number): Observable<boolean> => this.generic.getById<boolean>(`${this.entryPoint}/rating`, appointmentId);

  ratting = (rattingValue: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.entryPoint}/rating`, rattingValue);
}
