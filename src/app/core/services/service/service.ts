import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceModel } from '../../models/service-model.interface';
import { ResponseInterface } from '../../models/response.interface';
import { EncryptionUtil } from '../../util/encryption/encryption.util';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private baseUrl = `${environment.apiBaseUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(
    search: string = '',
    page: number = 1,
    pageSize: number = 5,
    sort: string = 'default',
    sortDirection: string = 'asc'
  ): Observable<ServiceModel> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortBy', sort)
      .set('sortDirection', sortDirection);
    if (search) params = params.set('searchString', search);

    return this.http.get<ServiceModel>(`${this.baseUrl}/list`, { params });
  }

  addService(serviceData: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.baseUrl}/add`,
      serviceData
    );
  }

  editService(serviceData: any): Observable<ResponseInterface> {
    let encryptedPayload = EncryptionUtil.encrypt(serviceData);
    return this.http.put<ResponseInterface>(
      `${this.baseUrl}/edit`,JSON.stringify(encryptedPayload), {
        headers: {'Content-Type': 'application/json'}
      }
    );
  }

  deleteService(serviceId: number): Observable<ResponseInterface> {
    return this.http.delete<ResponseInterface>(
      `${this.baseUrl}/delete/${serviceId}`
    );
  }
}
