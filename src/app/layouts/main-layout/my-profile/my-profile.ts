import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { LoaderService } from '../../../core/services/loader-service/loader-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PhoneNumberValidator } from '../../../shared/validators/phone-number.validator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { catchError, EMPTY, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogActions, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogContent, MatSlideToggleModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})
export class MyProfile implements OnInit {
  myProfileForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<MyProfile>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private fb: FormBuilder,
    private toastService: SweetToastService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.myProfileGet().subscribe({
      next: (res) => {
        console.log("res - ", res);
        this.myProfileForm = this.fb.group({
          userId: [res.userId],
          name: [res.name, Validators.required],
          phoneNo: [res.phoneNo.toString(), [Validators.required, PhoneNumberValidator]],
          isProvider: [res.isProvider],
          isAvailable: [res.isAvailable]
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  submit(): void{
    if(this.myProfileForm.invalid) return;

    this.authService.myProfilePost(this.myProfileForm.value).subscribe({
      next: (res) => {
        if(res.success){
          this.toastService.showSuccess(res.message || 'Profile updated successfully');
          // this.authService.setUserName(this.myProfileForm.get('name')?.value);
          this.dialogRef.close(true);
        }
        else{
          this.toastService.showError(res.message || 'Error updating profile');
          this.dialogRef.close(false);
        }
      },
      error: (err) => {
        this.toastService.showError('Something went wrong');
        this.dialogRef.close(true);
      }
    });
  }

}
