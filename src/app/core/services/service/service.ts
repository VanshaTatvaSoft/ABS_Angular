import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceModel } from '../../models/service-model.interface';
import { ResponseInterface } from '../../models/response.interface';
import { EncryptionUtil } from '../../util/encryption/encryption.util';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private baseUrl = `${environment.apiBaseUrl}/services`;
  private endpoint = 'services';

  constructor(private http: HttpClient, private generic: GenericService) {}

  getServices = (search: string = '',page: number = 1,pageSize: number = 5,sort: string = 'default',sortDirection: string = 'asc') : Observable<ServiceModel> =>
        this.generic.getList<ServiceModel>(`${this.endpoint}/list`, { searchString: search, page, pageSize, sortBy: sort, sortDirection, });

  addService = (serviceData: any): Observable<ResponseInterface> => this.generic.create<ResponseInterface>(`${this.endpoint}/add`, serviceData);

  editService(serviceData: any): Observable<ResponseInterface> {
    let encryptedPayload = EncryptionUtil.encrypt(serviceData);
    return this.http.put<ResponseInterface>(
      `${this.baseUrl}/edit`,JSON.stringify(encryptedPayload), {
        headers: {'Content-Type': 'application/json'}
      }
    );
  }

  deleteService = (serviceId: number): Observable<ResponseInterface> => this.generic.delete<ResponseInterface>(`${this.endpoint}/delete`, serviceId);
}
