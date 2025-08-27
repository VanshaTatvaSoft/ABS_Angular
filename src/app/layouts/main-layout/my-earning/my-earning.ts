import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth/auth.service'; 
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { options } from '../../../shared/constants/my-earning-options.constant';
import { filteControlChange } from './my-earning.helper';

@Component({
  selector: 'app-my-earning',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogActions, MatDialogContent, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './my-earning.html',
  styleUrl: './my-earning.css'
})
export class MyEarning implements OnInit {
  myEarningForm!: FormGroup;
  options = options;
  amountEarned!: number;
  constructor(
    private dialogRef: MatDialogRef<MyEarning>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.myEarningForm = this.fb.group({
      filter: ['today'],
      startDate: [{ value: '', disabled: true }],
      endDate: [{ value: '', disabled: true }]
    })

    this.loadMyEarning();

    this.myEarningForm.get('filter')?.valueChanges.subscribe(value => filteControlChange(value, this.myEarningForm, this.authService));

    this.myEarningForm.valueChanges.subscribe(value => {
      if(value.filter != 'custom') this.loadMyEarning();
      else if (value.filter === 'custom' && value.startDate != '' && value.endDate != '') {
        this.loadMyEarning();
      }
    })
  }

  loadMyEarning(){
    if(this.myEarningForm.valid){
      this.authService.getMyRevenue(this.myEarningForm.getRawValue()).subscribe({
        next: (res) => this.amountEarned = res
      })
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
