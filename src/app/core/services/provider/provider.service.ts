import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderModel } from '../../models/provider-model.interface';
import { ServiceInfo } from '../../models/service-model.interface';
import { ResponseInterface } from '../../models/response.interface';
import { AssignServiceViewModel } from '../../models/assign-service.interface';
import { EditProviderViewModel } from '../../models/edit-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private baseUrl = `${environment.apiBaseUrl}/providers`;

  constructor(private http: HttpClient) {}

  getProducts(
    serviceId: number = -1,
    searchString: string = '',
    page: number = 1,
    pageSize: number = 5,
    sortBy: string = 'id',
    sortDirection: string = 'asc'
  ) : Observable<ProviderModel>{
    let params = new HttpParams()
      .set('serviceId', serviceId)
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    if (searchString) params = params.set('searchString', searchString);

    return this.http.get<ProviderModel>(`${this.baseUrl}/list`, { params });
  }

  getAllService(): Observable<ServiceInfo[]>{
    return this.http.get<ServiceInfo[]>(`${this.baseUrl}/allServices`);
  }

  addProvider(providerData: any): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(`${this.baseUrl}/add`, providerData);
  }

  getAssignService(providerId: any): Observable<AssignServiceViewModel>{
    return this.http.get<AssignServiceViewModel>(`${this.baseUrl}/assign`,  {
      params: { providerId }
    });
  }

  assignServices(providerId: number, selected: number[], removed: number[]): Observable<ResponseInterface> {
    const selectedStr = JSON.stringify(selected);
    const removedStr = JSON.stringify(removed);

    return this.http.post<ResponseInterface>(
      `${this.baseUrl}/assign?selectedServiceIds=${encodeURIComponent(selectedStr)}&deletedServiceIds=${encodeURIComponent(removedStr)}`,
      providerId, // sent as raw number in body
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  deleteProvider(providerId: number): Observable<ResponseInterface>{
    return this.http.delete<ResponseInterface>(`${this.baseUrl}/delete/${providerId}`);
  }

  getEditProvider(providerId: number): Observable<EditProviderViewModel>{
    return this.http.get<EditProviderViewModel>(`${this.baseUrl}/edit/${providerId}`);
  }

  editProvider(model: EditProviderViewModel, selectedDays: string): Observable<ResponseInterface>{
    return this.http.put<ResponseInterface>(`${this.baseUrl}/edit`, model);
  }

}
