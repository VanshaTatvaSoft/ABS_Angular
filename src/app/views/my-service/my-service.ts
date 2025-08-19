import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../../core/services/my-service/my-service.service';
import { MyServiceViewModel } from '../../core/models/my-service.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AssignService } from '../provider/assign-service/assign-service';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';

@Component({
  selector: 'app-my-service',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, GenericTable, MatButtonModule],
  templateUrl: './my-service.html',
  styleUrl: './my-service.css'
})
export class MyService implements OnInit{
  data? : MyServiceViewModel;
  searchControl = new FormControl('');

  columns = [
    { key: 'serial', header: '#', sortable: false },
    { key: 'serviceName', header: 'Service Name', sortable: true },
    { key: 'serviceDesc', header: 'Service Description', sortable: false },
    { key: 'duration', header: 'Duration', sortable: true },
    { key: 'price', header: 'Price', sortable: true }
  ];

  totalCount = 0;
  page = 1;
  pageSize = 5;
  sortBy = 'id';
  sortDirection = 'asc';
  searchData = '';
  providerId?: number;

  constructor(private myServcieApi: MyServiceService, private dialog: MatDialog, private signalrService: SignalrService, private timeFormatService: TimeFormatService){ }

  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: string | null) => {
        this.onSearch(value ?? '');
      });

    this.signalrService.startConnection();

    this.signalrService.provider = (msg) => {
      this.loadData();
    }
  }

  loadData(): void{
    this.myServcieApi.getMyServices(this.page, this.pageSize, this.sortBy, this.sortDirection, this.searchData).subscribe({
      next: (res) => {
        // console.log(res);
        this.data = {
          providerId: res.providerId,
          servicePagination: res.servicePagination,
          myServices: res.myServices.map(service => ({
            ...service,
            duration: `${this.timeFormatService.transform(service.duration, 'min')} mins`
          }))
        }
        this.totalCount = res.servicePagination.totalRecord;
        this.providerId = res.providerId;
      }
    })
  }

  onPageChange(event: any){
    this.pageSize = event.pageSize;
    this.page = event.pageIndex + 1;
    this.loadData();
  }

  onSearch(searchString: string){
    this.searchData = searchString;
    this.page = 1;
    this.loadData();
  }

  onSortChange(sort: Sort){
    this.sortBy = sort.direction ? sort.active : 'id';
    this.sortDirection = sort.direction || 'asc';
    this.loadData();
  }

  openAssignServiceDialog(providerId: number): void {
    const dialogRef = this.dialog.open(AssignService, {
      width: '500px',
      maxHeight: '90vh',
      disableClose: true,     // ✅ Prevents closing via outside click
      autoFocus: false,       // Optional: prevent auto focus on first input
      data: {
        providerId: providerId,
        role: 'provider' // ✅ pass role here
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

}
