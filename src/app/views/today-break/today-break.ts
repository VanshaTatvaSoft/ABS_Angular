import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';
import { TodaysBreakService } from '../../core/services/todays-break-service/todays-break-service';
import { TodaysBreakViewModel } from '../../core/models/todays-break.interface';
import { TimeFormatPipePipe } from '../../core/pipes/time-format-pipe/time-format-pipe-pipe';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';
import Swal from 'sweetalert2';
import { BreakFormFactoryService } from '../../core/services/break-form-factory-service/break-form-factory-service';
import { buildBreakPayload } from './todays-break.helper';

@Component({
  selector: 'app-today-break',
  imports: [CommonModule, ReactiveFormsModule, NgxMaterialTimepickerModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, TimeFormatPipePipe, FormsModule],
  templateUrl: './today-break.html',
  styleUrl: './today-break.css'
})
export class TodayBreak {
  breakForm: FormGroup;
  data!: TodaysBreakViewModel;
  flippedCards: boolean[] = [];
  deletedBreaks: number[] = [];
  originalBreaks: any[] = [];

  constructor(private fb: FormBuilder, private timeFormatService: TimeFormatService, private todaysBreakService: TodaysBreakService, private toastService: SweetToastService, private breakFormFactory: BreakFormFactoryService) {
    this.breakForm = this.fb.group({
      breaks: this.fb.array([])
    });
    this.loadData();
  }

  loadData() {
    this.todaysBreakService.getTodaysBreak().subscribe({
      next: (res) => {
        this.data = res;
        this.flippedCards = new Array(res.myScheduleList.length).fill(false);
        this.breaks.clear();
        if (res.breakInfoList?.length){
          res.breakInfoList.forEach(b => {
            let breakGroup = this.breakFormFactory.createBreak(b, this.data);
            this.breaks.push(breakGroup);
          })
        }
        this.deletedBreaks = [];
        this.originalBreaks = JSON.parse(JSON.stringify(this.breakForm.getRawValue().breaks));
      }
    })
  }

  get breaks(): FormArray {
    return this.breakForm.get('breaks') as FormArray;
  }

  hasChanges(): boolean {
    const current = JSON.stringify(this.breakForm.getRawValue().breaks);
    const original = JSON.stringify(this.originalBreaks);
    return current !== original || this.deletedBreaks.length > 0;
  }

  addBreak() {
    const breakGroup = this.breakFormFactory.createBreak(null, this.data);
    this.breaks.push(breakGroup);
  }

  checkCanEdit(startTime: string): boolean | null{ return this.breakFormFactory.checkCanEdit(startTime);}

  deleteBreak(index: number, brk: any) {
    if(brk.value.providerBreakId) {
      Swal.fire({
        title: "Are you sure you want to delete this break?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletedBreaks.push(brk.value.providerBreakId);
          this.breaks.removeAt(index);
        }
      });
    }
    else{
      this.breaks.removeAt(index);
    }
  }

  submit() {
    if (this.breakForm.valid) {
      const currentBreaks = this.breakForm.getRawValue().breaks;
      const payLoad = buildBreakPayload(
        this.data.providerId,
        currentBreaks,
        this.originalBreaks,
        this.deletedBreaks,
        this.timeFormatService
      )
      this.todaysBreakService.addTodaysBreak(payLoad).subscribe({
        next: (res) => {
          if(res.success) this.toastService.showSuccess('Break updated successfully');
          else this.toastService.showError('Failed to update breaks');
          this.loadData();
        },
        error: (err) => {
          this.toastService.showError('Something went wrong while updating breaks');
        }
      });
    } else {
      this.breakForm.markAllAsTouched();
    }
  }

}
