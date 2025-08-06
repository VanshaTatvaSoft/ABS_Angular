import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardData(timeDropDown: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/overview`, {
      params: { timeDropDown },
      withCredentials: true,
    })
  }

}
