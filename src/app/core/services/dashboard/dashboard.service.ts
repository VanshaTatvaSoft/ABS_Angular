import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private endPoint = 'Dashboard'

  constructor(private generic: GenericService) {}

  getDashboardData = (timeDropDown: string): Observable<any> => this.generic.getList<any>(`${this.endPoint}/overview`, {timeDropDown})

}
