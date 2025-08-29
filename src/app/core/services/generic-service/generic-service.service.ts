import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  constructor(private http: HttpClient) {}

  private getBaseUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}/${endpoint}`;
  }

  getList<T>(endpoint: string, queryParams: {[key: string]: any} = {}): Observable<T>{
    let params = new HttpParams();
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        params = params.set(key, queryParams[key]);
      }
    });
    return this.http.get<T>(this.getBaseUrl(endpoint), { params });
  }

  getById<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.getBaseUrl(endpoint)}/${id}`);
  }

  create<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(this.getBaseUrl(endpoint), data);
  }

  update<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.getBaseUrl(endpoint)}`, data);
  }

  delete<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.delete<T>(`${this.getBaseUrl(endpoint)}/${id}`);
  }
}
