import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Sort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MyServiceViewModel } from '../../core/models/my-service.interface';
import { MyServiceService } from '../../core/services/my-service/my-service.service';
import { SignalrService } from '../../core/services/signalr-service/signalr-service';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';
import { GenericTable } from '../../shared/components/generic-table/generic-table';
import { AssignService } from '../provider/assign-service/assign-service';
import { MyServiceColumnHeader } from './my-service.helper';

@Component({
  selector: 'app-my-service',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, GenericTable, MatButtonModule],
  templateUrl: './my-service.html',
  styleUrl: './my-service.css'
})
export class MyService implements OnInit{
  data? : MyServiceViewModel;
  searchControl = new FormControl('');
  columns = MyServiceColumnHeader;
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
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string | null) => {this.onSearch(value ?? '');});

    this.signalrService.startConnection();
    this.signalrService.provider = (msg) => { this.loadData(); }
  }

  loadData(): void{
    this.myServcieApi.getMyServices(this.page, this.pageSize, this.sortBy, this.sortDirection, this.searchData).subscribe({
      next: (res) => {
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
      if (result) { this.loadData(); }
    });
  }

}
