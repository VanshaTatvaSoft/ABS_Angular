import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Injector, Input, Output, TemplateRef, Type, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
  ],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css'
})

export class GenericTable implements AfterViewChecked {
  @Input() data?: any[] = [];
  @Input() columns: { key: string; header: string; sortable?: boolean; hidden?: boolean}[] = [];
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 5;
  @Input() pageNumber: number = 1;
  @Input() isPaginated: boolean = true;
  @Input() columnTemplates: { [field: string]: TemplateRef<any> } = {};
  @Input() actionColumnName?: string = 'Action';
  @Output() pageChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<Sort>();

  constructor( private injector: Injector, private toast: ToastrService ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  get displayedColumns(): string[] {
    const baseCols = this.columns
                        .filter(c => !c.hidden)
                        .map((c) => c.key);
                        
    return this.columnTemplates['actions']
    ? [...baseCols, 'actions']
    : baseCols;
    // return [...this.columns.map((c) => c.key), 'actions'];
  }

  private sortInitialized = false;

  ngAfterViewChecked(): void {
    if (this.matSort && !this.sortInitialized) {
      this.sortInitialized = true;

      this.matSort.sortChange.subscribe((sort) => {
        const column = this.columns.find((c) => c.key === sort.active);
        if (column?.sortable) {
          this.sortChange.emit(sort);
        }
      });
    }
  }

}
