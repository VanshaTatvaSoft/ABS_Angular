import { Component, OnInit } from '@angular/core';
import { ServiceInfo } from '../../core/models/service-model.interface';
import { ServiceApi } from '../../core/services/service/service';
import { CommonModule } from '@angular/common';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { MatButtonModule } from '@angular/material/button';
import { Sort } from '@angular/material/sort';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, min } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { AddEditService } from './add-edit-service/add-edit-service';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { ConfirmationService } from '../../core/services/confirmation-service/confirmation-service';
import { DeleteServiceSwalConfig, ServiceColumnHeader,  } from './service-helper';
import { openDailog } from '../../core/util/dailog-helper/dailog-helper';
import { MatIconModule } from '@angular/material/icon';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';

@Component({
  selector: 'app-service',
  imports: [CommonModule, GenericTable, MatButtonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './service.html',
  styleUrl: './service.css'
})
export class Service implements OnInit {
  services: ServiceInfo[] = [];
  searchControl = new FormControl('');
  columns = ServiceColumnHeader;
  totalCount = 0;
  page = 1;
  pageSize = 5;
  sort = 'default';
  sortDirection = 'asc';
  searchString = '';

  constructor(private serviceApi: ServiceApi, private dialog: MatDialog, private toastService: SweetToastService, private signalrService: SignalrService, private confirmationService: ConfirmationService, private timeFormatService: TimeFormatService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe( debounceTime(300), distinctUntilChanged() )
      .subscribe((value: string | null) => { this.onSearch(value ?? ''); });

    this.signalrService.startConnection();
    this.signalrService.service = (msg) => { this.fetchData(); }

    this.fetchData();
  }

  fetchData() {
    this.serviceApi.getServices(this.searchString, this.page, this.pageSize, this.sort, this.sortDirection).subscribe((res) => {
      this.services = res.serviceList.map(s => ({
        ...s,
        price: `₹${s.price}`,
        commission: `${s.commission}%`,
        earningByService: `₹${s.earningByService}`,
        duration: `${this.timeFormatService.transform(s.duration, 'min')} min`
      }));
      this.totalCount = res.servicePagination.totalRecord;
    });
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchData();
  }

  onSortChange(sort: Sort) {
    this.sort = sort.direction ? sort.active : 'default';
    this.sortDirection = sort.direction || 'asc';
    this.fetchData();
  }

  onSearch(value: string) {
    this.searchString = value;
    this.page = 1;
    this.fetchData();
  }

  editService = (row: ServiceInfo) => this.openAddEditServiceDialog(row);

  deleteService(row: ServiceInfo) {
    this.confirmationService.confirm(DeleteServiceSwalConfig).then(confirmed => {
      if(confirmed){
        this.serviceApi.deleteService(row.serviceId).subscribe({
          next: (res) => this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Service delted successfully' : 'Error deleting service')),
          error: () => this.toastService.showError('Something went wrong'),
        })
      }
    })
  }

  openAddEditServiceDialog(service?: ServiceInfo) {
    openDailog(this.dialog, AddEditService, '500px', service ? {...service} : {}).subscribe(result => result ? this.fetchData() : null);
  }
}
