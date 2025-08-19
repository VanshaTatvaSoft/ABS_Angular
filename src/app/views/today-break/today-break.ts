import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimeRangeValidator } from '../../shared/validators/start-end-time.validator';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';
import { TodaysBreakService } from '../../core/services/todays-break-service/todays-break-service';
import { TodaysBreakViewModel } from '../../core/models/todays-break.interface';
import { TimeFormatPipePipe } from '../../core/pipes/time-format-pipe/time-format-pipe-pipe';
import { BreakTimeValidator } from '../../shared/validators/break-time.validator';
import { startTimeNotPastValidator } from '../../shared/validators/start-time-now.validator';
import { DuplicateBreakValidator } from '../../shared/validators/duplicate-break.validator';
import { SweetToastService } from '../../core/services/toast/sweet-toast.service';

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

  constructor(private fb: FormBuilder, private timeFormatService: TimeFormatService, private todaysBreakService: TodaysBreakService, private toastService: SweetToastService) {
    this.breakForm = this.fb.group({
      breaks: this.fb.array([])
    });
    this.loadData();
  }

  loadData() {
    this.todaysBreakService.getTodaysBreak().subscribe({
      next: (res) => {
        this.data = res;
        console.log('Break Data:', this.data);
        this.flippedCards = new Array(res.myScheduleList.length).fill(false);
        this.breaks.clear();
        if (res.breakInfoList?.length){
          res.breakInfoList.forEach(b => {
            const breakGroup = this.fb.group({
              providerBreakId: [b.providerBreakId],
              startTime: [{value: this.timeFormatService.transform(b.startTime, '12hr'), disabled: !this.checkCanEdit(b.startTime)}, [Validators.required, startTimeNotPastValidator(this.timeFormatService)]],
              endTime: [{value: this.timeFormatService.transform(b.endTime, '12hr'), disabled: !this.checkCanEdit(b.startTime)}, [Validators.required]],
              canEdit: [this.checkCanEdit(b.startTime)]
            }, {
              validators: [
                TimeRangeValidator(this.timeFormatService, []),
                BreakTimeValidator(this.timeFormatService, this.data),
                DuplicateBreakValidator(this.timeFormatService)
              ]
            });
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
    const breakGroup = this.fb.group({
      providerBreakId: [''],
      startTime: ['', [Validators.required, startTimeNotPastValidator(this.timeFormatService)]],
      endTime: ['', Validators.required],
      canEdit: [true]
    }, { validators:[
        TimeRangeValidator(this.timeFormatService, []),
        BreakTimeValidator(this.timeFormatService, this.data),
        DuplicateBreakValidator(this.timeFormatService)
      ]
    });

    this.breaks.push(breakGroup);
  }

  checkCanEdit(startTime: string): boolean | null{
    let start = this.timeFormatService.parseToDate(startTime);
    let now = new Date();
    return start && start > now;
  }

  deleteBreak(index: number, brk: any) {
    if(brk.value.providerBreakId) {
      this.deletedBreaks.push(brk.value.providerBreakId);
      // console.log('Delete Break Data - ',brk.value);
    }
    this.breaks.removeAt(index);
  }

  toggleCard(index: number) {
    this.flippedCards[index] = !this.flippedCards[index];
  }

  submit() {
    if (this.breakForm.valid) {
      const currentBreaks = this.breakForm.getRawValue().breaks;

      const newBreaks = currentBreaks.filter((brk: any) =>
        !brk.providerBreakId || brk.providerBreakId === 0
      );

      const editedBreaks = currentBreaks.filter((brk: any) => {
        if (!brk.providerBreakId) return false; // skip new
        const original = this.originalBreaks.find(o => o.providerBreakId === brk.providerBreakId);
        if (!original) return false;

        const startChanged = this.timeFormatService.transform(brk.startTime, '24hr') !==
                             this.timeFormatService.transform(original.startTime, '24hr');
        const endChanged = this.timeFormatService.transform(brk.endTime, '24hr') !==
                           this.timeFormatService.transform(original.endTime, '24hr');

        return startChanged || endChanged;
      });

      const payLoad = {
        providerId: this.data.providerId,
        addBreakList: [...newBreaks, ...editedBreaks]
        .map((brk: any) => ({
          providerBreakId: brk.providerBreakId || 0,
          startTime: this.timeFormatService.transform(brk.startTime, '24hr'),
          endTime: this.timeFormatService.transform(brk.endTime, '24hr'),
          canEdit: brk.canEdit
        })),
        deleteBreakIds: this.deletedBreaks
      }

      // console.log('Payload - ',payLoad);

      this.todaysBreakService.addTodaysBreak(payLoad).subscribe({
        next: (res) => {
          if(res.success){
            this.toastService.showSuccess('Break updated successfully');
          }
          else {
            this.toastService.showError('Failed to update breaks');
          }
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
