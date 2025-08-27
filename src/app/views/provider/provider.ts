import { Component, OnInit } from '@angular/core';
import { ProviderModel } from '../../core/models/provider-model.interface';
import { ProviderService } from '../../core/services/provider/provider.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddProvider } from './add-provider/add-provider';
import { AssignService } from './assign-service/assign-service';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { EditProvider } from './edit-provider/edit-provider';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { ConfirmationService } from '../../core/services/confirmation-service/confirmation-service';
import { DeleteProviderSwalConfig, exportToPdf, ProviderColumnHeader } from './provider-helper';
import { MyScheduleService } from '../../core/services/my-schedule-services/my-schedule-service';
import { AuthService } from '../../core/services/auth/auth.service';
import { openDailog } from '../../core/util/dailog-helper/dailog-helper';
import { ProviderRevenue } from './provider-revenue/provider-revenue';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-provider',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatTabsModule, GenericTable, MatIcon, MatBadgeModule],
  templateUrl: './provider.html',
  styleUrl: './provider.css'
})
export class Provider implements OnInit{
  data!: ProviderModel ;
  searchControl = new FormControl('');
  columns = ProviderColumnHeader;

  serviceId = -1;
  totalCount = 0;
  allCount = 0;
  page = 1;
  pageSize = 5;
  sortBy = 'id';
  sortDirection = 'asc';
  searchString = '';
  selectedTabIndex = 0;

  constructor(private providerService: ProviderService, private dialog: MatDialog, private toastService: SweetToastService, private signalrService: SignalrService, private confirmationService: ConfirmationService, private myScheduleService: MyScheduleService, private authService: AuthService){}

  ngOnInit(): void{
    this.loadInitialData();
    this.searchControl.valueChanges
      .pipe( debounceTime(300), distinctUntilChanged() )
      .subscribe((value: string | null) => { this.onSearch(value ?? ''); });
    this.signalrService.startConnection();
    this.signalrService.myService = (msg) => { this.getDataByServiceId(); }
  }

  loadInitialData(): void {
    forkJoin({
      providers: this.providerService.getProducts(this.serviceId, this.searchControl.value || '', this.page, this.pageSize, this.sortBy),
      services: this.providerService.getAllService()
    }).subscribe({
      next: ({ providers, services }) => {
        this.data = {
          providerList: providers.providerList.map(p => ({
            ...p,
            revenueGenerated: `₹${p.revenueGenerated}`
          })),
          providerPagination: providers.providerPagination,
          serviceList: services
        };
        this.allCount = this.serviceId == -1 ? providers.providerPagination.totalRecord : this.allCount;
        this.totalCount = providers.providerPagination.totalRecord;
      },
      error: () => this.toastService.showError('Error loading data')
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
          this.data.providerList = res.providerList.map(p => ({
            ...p,
            revenueGenerated: `₹${p.revenueGenerated}`
          }));
          this.data.providerPagination = res.providerPagination;
          this.totalCount = res.providerPagination.totalRecord;
        },
        error: () => this.toastService.showError('Error fetching provider list')
      });
  }

  onTabChange(tabIndex: number): void {
    this.selectedTabIndex = tabIndex;
    this.page = 1;
    this.sortBy = 'id';
    this.sortDirection = 'asc';
    this.searchString = '';
    this.searchControl.setValue('');
    this.serviceId = tabIndex === 0 ? -1 : this.data.serviceList[tabIndex - 1]?.serviceId ?? -1;
    this.getDataByServiceId();
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

  onSearch(value: string): void {
    this.searchString = value;
    this.page = 1;
    this.getDataByServiceId();
  }

  onRowClickes = (data: any) => this.openProviderRevenueModel(data.providerId);

  openAddProviderDailog(): void {
    openDailog(this.dialog, AddProvider, '400px').subscribe(result => result ? this.getDataByServiceId() : null)
  }

  openAssignServiceDialog(providerId: number): void {
    openDailog(this.dialog, AssignService, '500px', { providerId: providerId, role: 'admin' }).subscribe(result => result ? this.loadInitialData() : null);
  }

  deleteProvider(providerId: number): void {
    this.confirmationService.confirm(DeleteProviderSwalConfig).then(confirmed => {
      if(confirmed) {
        this.providerService.deleteProvider(providerId).subscribe({
          next: (res) => this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Provider deleted succcesfully' : 'Error deleting provider')),
          error: () => this.toastService.showError('Something went wrong')
        })
      }
    })
  }

  OpenEditProviderDailog(providerId: number): void {
    openDailog(this.dialog, EditProvider, '500px', providerId, '90vh').subscribe(result => result ? this.getDataByServiceId() : null);
  }

  async exportToPdf() {
    exportToPdf(this.authService.getUserImage(), this.authService.getUserName(), this.authService.getUserRole(), this.myScheduleService, this.data.providerList);
  }

  openProviderRevenueModel(providerId: number): void {
    this.providerService.getProviderRevenue(providerId).subscribe((res) => openDailog(this.dialog, ProviderRevenue, '500px', res.revenueList, '90vh').subscribe());
  }
}
