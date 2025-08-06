import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyServiceViewModel } from '../../models/my-service.interface';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private baseUrl = `${environment.apiBaseUrl}/MyServices`;

  constructor(private http: HttpClient) {}

  getMyServices(
    page: number = 1,
    pageSize: number = 5,
    sortBy: string = 'id',
    sortDirection: string = 'asc',
    searchData: string = ''
  ): Observable<MyServiceViewModel>{
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if(searchData) params = params.set('searchData', searchData);

    return this.http.get<MyServiceViewModel>(`${this.baseUrl}/list`, {params});
  }
}
