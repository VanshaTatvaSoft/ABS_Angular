import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PhoneNumberValidator } from '../../../shared/validators/phone-number.validator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TimeFormatService } from '../../../core/services/time-format-service/time-format-service';
import { TimeRangeValidator } from '../../../shared/validators/start-end-time.validator';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogActions, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogContent, MatSlideToggleModule, MatIcon, NgxMaterialTimepickerModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})
export class MyProfile implements OnInit {
  myProfileForm!: FormGroup;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  canNotEdit: boolean = false;
  fileError: string = '';

  constructor(
    private dialogRef: MatDialogRef<MyProfile>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private fb: FormBuilder,
    private toastService: SweetToastService,
    private authService: AuthService,
    private timeFormatService: TimeFormatService
  ) {}

  ngOnInit(): void {
    this.authService.myProfileGet().subscribe({
      next: (res) => {
        this.canNotEdit = res.canNotEditTime;
        this.myProfileForm = this.fb.group({
          userId: [res.userId],
          name: [res.name, Validators.required],
          phoneNo: [res.phoneNo.toString(), [Validators.required, PhoneNumberValidator]],
          isProvider: [res.isProvider]
        });

        if(res.isProvider){
          this.myProfileForm.addControl('isAvailable',new FormControl(res.isAvailable));
          this.myProfileForm.addControl('startTime', new FormControl(this.timeFormatService.transform(res.startTime, 'short'), [Validators.required]));
          this.myProfileForm.addControl('endTime', new FormControl(this.timeFormatService.transform(res.endTime, 'short'), [Validators.required]));
          this.myProfileForm.setValidators(TimeRangeValidator(this.timeFormatService, []));
        }
        if (res.profileImageUrl) {
          this.previewImage = res.profileImageUrl;
        }
        if (this.canNotEdit) {
          this.myProfileForm.get('startTime')?.disable();
          this.myProfileForm.get('endTime')?.disable();
        } else {
          this.myProfileForm.get('startTime')?.enable();
          this.myProfileForm.get('endTime')?.enable();
        }
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileError = '';
    if (this.selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.fileError = 'Please upload a valid image file (jpg, png, gif, webp)';
        this.selectedFile = null;
        event.target.value = ''; // reset file input
        return;
      }

      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  close = (): void => this.dialogRef.close(false);

  submit(): void{
    if(this.myProfileForm.invalid) return;
    const formValue = this.myProfileForm.getRawValue();
    const formattedModel = {
      ...formValue,
      startTime: this.timeFormatService.transform(formValue.startTime, '24hr'),
      endTime: this.timeFormatService.transform(formValue.endTime, '24hr')
    };

    const formData = new FormData();
    Object.keys(this.myProfileForm.value).forEach(key => {
      formData.append(key, this.myProfileForm.value[key]);
    });
    if (this.selectedFile) {
      formData.append('ProfileImage', this.selectedFile);
    }

    this.authService.myProfilePost(formData).subscribe({
      next: (res) => {
        if(res.success){
          this.toastService.showSuccess(res.message || 'Profile updated successfully');
          this.authService.setUserName(this.myProfileForm.get('name')?.value);
          this.authService.getUserProfileImg().subscribe({
            next: (res) => {
              this.authService.setUserImage(res.profileImg);
            }
          });
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
