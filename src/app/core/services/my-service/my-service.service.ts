import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyServiceViewModel } from '../../models/my-service.interface';
import { GenericService } from '../generic-service/generic-service.service';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private endPoint = 'MyServices';

  constructor(private generic: GenericService) {}

  getMyServices = (page: number = 1,pageSize: number = 5,sortBy: string = 'id',sortDirection: string = 'asc',searchData: string = '') : Observable<MyServiceViewModel> =>
    this.generic.getList<MyServiceViewModel>(`${this.endPoint}/list`, { page, pageSize, sortBy, sortDirection, searchData });
}
