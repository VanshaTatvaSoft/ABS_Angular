import { Component, OnInit } from '@angular/core';
import { ProviderModel } from '../../core/models/provider-model.interface';
import { ServiceApi } from '../../core/services/service/service';
import { ProviderService } from '../../core/services/provider/provider.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddProvider } from './add-provider/add-provider';
import { AssignService } from './assign-service/assign-service';
import Swal from 'sweetalert2';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { EditProvider } from './edit-provider/edit-provider';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';

@Component({
  selector: 'app-provider',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatTabsModule, GenericTable, MatIcon],
  templateUrl: './provider.html',
  styleUrl: './provider.css'
})
export class Provider implements OnInit{
  data: ProviderModel = {
    providerList: [],
    providerPagination: {
      totalRecord: 0,
      pageSize: 5,
      currentPage: 1,
      totalPage: 0,
      minRow: 0,
      maxRow: 0
    },
    serviceList: []
  };
  searchControl = new FormControl('');
  columns = [
    { key: 'serial', header: '#', sortable: false },
    { key: 'providerName', header: 'Provider Name', sortable: true },
    { key: 'email', header: 'Provider Email', sortable: true },
    { key: 'phoneNo', header: 'Provider Phone No.', sortable: false },
  ];

  serviceId = -1;
  totalCount = 0;
  page = 1;
  pageSize = 5;
  sortBy = 'id';
  sortDirection = 'asc';
  searchString = '';
  selectedTabIndex = 0;

  constructor(private providerService: ProviderService, private serviceApi: ServiceApi, private dialog: MatDialog, private toastService: SweetToastService, private signalrService: SignalrService){
    this.loadInitialData();
  }

  ngOnInit(): void{
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: string | null) => {
        this.onSearch(value ?? '');
      });

    this.signalrService.startConnection();

    this.signalrService.myService = (msg) => {
      this.getDataByServiceId();
    }

  }

  loadInitialData(): void {
    forkJoin({
      providers: this.providerService.getProducts(this.serviceId, this.searchControl.value || '', this.page, this.pageSize, this.sortBy),
      services: this.providerService.getAllService()
    }).subscribe({
      next: ({ providers, services }) => {
        this.data = {
          ...providers,
          serviceList: services
        };
        this.totalCount = providers.providerPagination.totalRecord;
      },
      error: (err) => console.error('Error loading data', err)
    });
  }

  getDataByServiceId(serviceId: number = this.serviceId, page: number = this.page, pageSize:number = this.pageSize, searchString: string = this.searchString, sortBy: string = this.sortBy, sortDirection: string = this.sortDirection): void {
    this.serviceId = serviceId;
    this.page = page;
    this.searchString = searchString;
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;

    this.providerService.getProducts(serviceId, searchString, this.page, this.pageSize, this.sortBy, this.sortDirection)
      .subscribe({
        next: (res) => {
          this.data.providerList = res.providerList;
          this.data.providerPagination = res.providerPagination;
          this.totalCount = res.providerPagination.totalRecord;
        },
        error: (err) => console.error('Error fetching provider list', err)
      });
  }

  onTabChange(tabIndex: number): void{
    this.selectedTabIndex = tabIndex;
    this.page = 1;
    this.sortBy = 'id';
    this.sortDirection = 'asc';
    this.searchString = '';
    this.searchControl.setValue('');

    if(this.selectedTabIndex === 0){
      this.serviceId = -1;
      this.getDataByServiceId();
    }
    else {
      const service = this.data.serviceList[tabIndex - 1];
      this.serviceId = service.serviceId;
      if (service) {
        this.getDataByServiceId();
      }
    }
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getDataByServiceId();
  }

  onSortChange(sort: Sort): void {
    this.sortBy = sort.direction ? sort.active : 'id';
    this.sortDirection = sort.direction || 'asc';
    this.getDataByServiceId();
  }

  onSearch(value: string) {
    this.searchString = value;
    this.page = 1;
    this.getDataByServiceId();
  }

  openAddProviderDailog(): void{
    const dialogRef = this.dialog.open(AddProvider, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getDataByServiceId();
      }
    });
  }

  openAssignServiceDialog(providerId: number): void {
    const dialogRef = this.dialog.open(AssignService, {
      width: '500px',
      maxHeight: '90vh',
      disableClose: true,     // ✅ Prevents closing via outside click
      autoFocus: false,       // Optional: prevent auto focus on first input
      data: {
        providerId: providerId,
        role: 'admin' // ✅ pass role here
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDataByServiceId();
      }
    });
  }

  deleteProvider(providerId: number): void{
    // console.log("Delete Provider Id - ", providerId);

    Swal.fire({
      title: "Delete Service",
      text: "Are you sure you want to delete this service?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if(result.isConfirmed){
        this.providerService.deleteProvider(providerId).subscribe({
          next: (res) => {
            if(res.success){
              this.toastService.showSuccess(res.message || "Provider deleted succcesfully");
            }
            else{
              this.toastService.showError(res.message || 'Error deleting provider');
            }
          },
          error: (err) => {
            this.toastService.showError('Something went wrong');
          }
        })
      }
    })
  }

  OpenEditProviderDailog(providerId: number): void{
    const dialogRef = this.dialog.open(EditProvider, {
      width: '500px',
      maxHeight: '90vh',
      disableClose: true,     // ✅ Prevents closing via outside click
      autoFocus: false,       // Optional: prevent auto focus on first input
      data: providerId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDataByServiceId();
      }
    });
  }

}
