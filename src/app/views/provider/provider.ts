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
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import { EditProvider } from './edit-provider/edit-provider';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { ConfirmationService } from '../../core/services/confirmation-service/confirmation-service';
import { DeleteProviderSwalConfig, ProviderColumnHeader } from './provider-helper';
import { MyScheduleService } from '../../core/services/my-schedule-services/my-schedule-service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from '../../core/services/auth/auth.service';

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
  columns = ProviderColumnHeader;

  serviceId = -1;
  totalCount = 0;
  page = 1;
  pageSize = 5;
  sortBy = 'id';
  sortDirection = 'asc';
  searchString = '';
  selectedTabIndex = 0;

  constructor(private providerService: ProviderService, private serviceApi: ServiceApi, private dialog: MatDialog, private toastService: SweetToastService, private signalrService: SignalrService, private confirmationService: ConfirmationService, private myScheduleService: MyScheduleService, private authService: AuthService){
    this.loadInitialData();
  }

  ngOnInit(): void{
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
          ...providers,
          serviceList: services
        };
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
          this.data.providerList = res.providerList;
          this.data.providerPagination = res.providerPagination;
          this.totalCount = res.providerPagination.totalRecord;
        },
        error: () => this.toastService.showError('Error fetching provider list')
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
      if (service) this.getDataByServiceId();
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

    dialogRef.afterClosed().subscribe(result => { if(result) this.getDataByServiceId(); });
  }

  openAssignServiceDialog(providerId: number): void {
    const dialogRef = this.dialog.open(AssignService, {
      width: '500px',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      data: { providerId: providerId, role: 'admin' }
    });

    dialogRef.afterClosed().subscribe(result => { if (result) this.getDataByServiceId(); });
  }

  deleteProvider(providerId: number): void{
    this.confirmationService.confirm(DeleteProviderSwalConfig).then(confirmed => {
      if(confirmed){
        this.providerService.deleteProvider(providerId).subscribe({
          next: (res) => {
            this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Provider deleted succcesfully' : 'Error deleting provider'));
          },
          error: () => this.toastService.showError('Something went wrong')
        })
      }
    })
  }

  OpenEditProviderDailog(providerId: number): void{
    const dialogRef = this.dialog.open(EditProvider, {
      width: '500px',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      data: providerId
    });
    dialogRef.afterClosed().subscribe(result => { if (result) this.getDataByServiceId(); });
  }
  
  async exportToPdf() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Provider List', 14, 18);
    doc.setFont('helvetica', 'normal');
    const userImage = this.authService.getUserImage();
    if(userImage) {
      const userImageData = await this.getBase64ImageFromURL(userImage);
      doc.addImage(userImageData, "PNG", 170, 5, 20, 20);
    }
    doc.text(this.authService.getUserName(), 130, 14);
    doc.text(this.authService.getUserRole(), 130, 20);

    let y = 30;
    let rowIndex = 0;
    let rowHeight = 40;

    for (const provider of this.data.providerList) {
      if (rowIndex % 2 === 0) {
        doc.setFillColor(175, 201, 224);
      } else {
        doc.setFillColor(217, 235, 250);
      }
      doc.roundedRect(5, y - 5, 200, rowHeight, 5, 5, 'F');

      let imgData = '';
      if (provider.providerProfileImg) {
        imgData = await this.getBase64ImageFromURL(provider.providerProfileImg);
      }

      doc.setFillColor(252, 252, 252);
      doc.roundedRect(10, y, 30, 30, 5, 5, 'F');
      if (imgData) {
        doc.addImage(imgData, 'PNG', 10, y, 30, 30);
      } else {
        doc.setFontSize(10);
        doc.text('N/A', 25, y + 15, { align: 'center' });
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Provider Name : ', 50, y+8);
      doc.setFont('helvetica', 'normal');
      doc.text(provider.providerName, 85, y+8);
      doc.setFont('helvetica', 'bold');
      doc.text('Provider Email : ', 50, y+16);
      doc.setFont('helvetica', 'normal');
      doc.text(provider.email, 85, y+16);
      doc.setFont('helvetica', 'bold');
      doc.text('Provider Phone No : ', 50, y+24);
      doc.setFont('helvetica', 'normal');
      doc.text(provider.phoneNo.toString(), 93, y+24);

      y += 45;
      if(y > 280){
        doc.addPage();
        y = 15;
      }
      rowIndex++;
    }
    doc.save('provider-list.pdf');
  }

  async getBase64ImageFromURL(imgPathUrl: string): Promise<string>{
    try {
      const imgPath = imgPathUrl.split("/").pop();
      const imageUrl = this.myScheduleService.getProfileImageUrl(imgPath!);
      const response = await fetch(imageUrl, { mode: "cors", credentials: "include" });
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const circularImage = await new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const size = 60; // adjust size
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d")!;

          // Clip in a circle
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL("image/png"));
        };
        img.src = base64;
      });
      return circularImage;
    } catch (error) {
      console.error("Error loading image:", error);
      return "";
    }
  }

}
