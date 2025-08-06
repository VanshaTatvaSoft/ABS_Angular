import { Component, OnInit } from '@angular/core';
import { ServiceInfo } from '../../core/models/service-model.interface';
import { ServiceApi } from '../../core/services/service/service';
import { CommonModule } from '@angular/common';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { MatButtonModule } from '@angular/material/button';
import { Sort } from '@angular/material/sort';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { AddEditService } from './add-edit-service/add-edit-service';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { DeleteService } from './delete-service/delete-service';
import Swal from 'sweetalert2';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';

@Component({
  selector: 'app-service',
  imports: [CommonModule, GenericTable, MatButtonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './service.html',
  styleUrl: './service.css'
})
export class Service implements OnInit {
  services: ServiceInfo[] = [];
  searchControl = new FormControl('');

  columns = [
    { key: 'serial', header: '#', sortable: false },
    { key: 'serviceName', header: 'Name', sortable: true },
    { key: 'serviceDesc', header: 'Description', sortable: false },
    { key: 'duration', header: 'Duration', sortable: true },
    { key: 'price', header: 'Price', sortable: true },
    { key: 'count', header: 'Provided Count', sortable: true },
  ];

  totalCount = 0;
  page = 1;
  pageSize = 5;
  sort = 'default';
  sortDirection = 'asc';
  searchString = '';

  constructor(private serviceApi: ServiceApi, private dialog: MatDialog, private toastService: SweetToastService, private signalrService: SignalrService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: string | null) => {
        this.onSearch(value ?? '');
      });

    this.signalrService.startConnection();

    this.signalrService.service = (msg) => {
      this.fetchData();
    }

    this.fetchData();
  }

  fetchData() {
    this.serviceApi.getServices(this.searchString, this.page, this.pageSize, this.sort, this.sortDirection).subscribe((res) => {
      this.services = res.serviceList;
      this.totalCount = res.servicePagination.totalRecord;
      // console.log("ServiceInfo - ", this.services);
      // console.log("TotalCount - ", this.totalCount);
    });
  }

  onPageChange(event: any) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchData();
  }

  onSortChange(sort: Sort) {
    // console.log("Sort changed", sort);
    this.sort = sort.direction ? sort.active : 'default';
    this.sortDirection = sort.direction || 'asc';
    this.fetchData();
  }

  onSearch(value: string) {
    this.searchString = value;
    this.page = 1;
    this.fetchData();
  }

  editService(row: ServiceInfo) {
    // console.log("Edit clicked", row);
    this.openAddEditServiceDialog(row);

  }

  deleteService(row: ServiceInfo) {
    // console.log("Delete clicked", row);

    Swal.fire({
      title: "Delete Service",
      text: "Are you sure you want to delete this service?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if(result.isConfirmed){
        this.serviceApi.deleteService(row.serviceId).subscribe({
          next: (res) => {
            if(res.success){
              this.toastService.showSuccess(res.message || 'Service delted successfully');
            }
            else{
              this.toastService.showError(res.message || 'Error deleting service');
            }
          },
          error: (err) => {
            this.toastService.showError('Something went wrong');
          }
        })
      }
    })

    // this.openDeleteServiceDailog(row);
  }

  openAddEditServiceDialog(service?: ServiceInfo) {
    const dialogRef = this.dialog.open(AddEditService, {
      width: '400px',
      data: service ? { ...service } : {} // Optional: pass any data here
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.fetchData();
      }
    });
  }

  openDeleteServiceDailog(service: ServiceInfo) {
    const deletedialogRef = this.dialog.open(DeleteService, {
      width: '500px',
      data: {... service}
    });

    deletedialogRef.afterClosed().subscribe(result => {
      if(result){
        this.fetchData();
      }
    })
  }

}
