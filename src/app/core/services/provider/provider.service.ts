import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProviderModel } from '../../models/provider-model.interface';
import { ServiceInfo } from '../../models/service-model.interface';
import { ResponseInterface } from '../../models/response.interface';
import { AssignServiceViewModel } from '../../models/assign-service.interface';
import { EditProviderViewModel } from '../../models/edit-provider.interface';
import { ProviderServiceViewModel } from '../../models/provider-revenue.interface';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private baseUrl = `${environment.apiBaseUrl}/providers`;
  private endpoint = 'providers';

  constructor(private http: HttpClient, private generic: GenericService) {}

  getProducts = ( serviceId: number = -1, searchString: string = '', page: number = 1, pageSize: number = 5, sortBy: string = 'id', sortDirection: string = 'asc' )
    : Observable<ProviderModel> => this.generic.getList<ProviderModel>(`${this.endpoint}/list`, { serviceId, searchString, page, pageSize, sortBy, sortDirection });

  getAllService = (): Observable<ServiceInfo[]> => this.generic.getList<ServiceInfo[]>(`${this.endpoint}/allServices`);

  addProvider = (providerData: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.endpoint}/add`, providerData);


  getAssignService = (providerId: any): Observable<AssignServiceViewModel> => this.generic.getList<AssignServiceViewModel>(`${this.endpoint}/assign`, { providerId });

  assignServices(providerId: number, selected: number[], removed: number[]): Observable<ResponseInterface> {
    const selectedStr = JSON.stringify(selected);
    const removedStr = JSON.stringify(removed);

    return this.http.post<ResponseInterface>(
      `${this.baseUrl}/assign?selectedServiceIds=${encodeURIComponent(selectedStr)}&deletedServiceIds=${encodeURIComponent(removedStr)}`,
      providerId,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  deleteProvider = (providerId: number): Observable<ResponseInterface> => this.generic.delete<ResponseInterface>(`${this.endpoint}/delete`, providerId);


  getEditProvider = (providerId: number): Observable<EditProviderViewModel> => this.generic.getById<EditProviderViewModel>(`${this.endpoint}/edit`, providerId);


  editProvider = (model: EditProviderViewModel): Observable<ResponseInterface> => this.generic.update<ResponseInterface>(`${this.endpoint}/edit`, model);

  getProviderRevenue = (providerId: number): Observable<ProviderServiceViewModel> =>
    this.generic.getList<ProviderServiceViewModel>(`${this.endpoint}/get-provider-revenue`, { providerId });

}
