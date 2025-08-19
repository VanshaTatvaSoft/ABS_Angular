import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TodaysBreakViewModel } from '../../models/todays-break.interface';
import { ResponseInterface } from '../../models/response.interface';

@Injectable({
  providedIn: 'root'
})
export class TodaysBreakService {
  private baseUrl = `${environment.apiBaseUrl}/TodaysBreak`;

  constructor(private http: HttpClient) {}

  getTodaysBreak(): Observable<TodaysBreakViewModel>{
    return this.http.get<TodaysBreakViewModel>(`${this.baseUrl}/todays-break-data`)
  }

  addTodaysBreak(payLoad: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${this.baseUrl}/add-todays-break`, payLoad);
  }
}
