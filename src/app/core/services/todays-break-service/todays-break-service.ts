import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodaysBreakViewModel } from '../../models/todays-break.interface';
import { ResponseInterface } from '../../models/response.interface';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class TodaysBreakService {
  private endPoint = 'TodaysBreak';

  constructor(private generic: GenericService) {}

  getTodaysBreak = (): Observable<TodaysBreakViewModel> => this.generic.getList<TodaysBreakViewModel>(`${this.endPoint}/todays-break-data`)

  addTodaysBreak = (payLoad: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.endPoint}/add-todays-break`, payLoad);
}
