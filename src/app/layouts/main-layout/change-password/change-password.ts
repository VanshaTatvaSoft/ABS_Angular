import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { JwtService } from '../../../core/services/jwt-service/jwt-service';
import { PasswordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { MatInputModule } from '@angular/material/input';
import { GenericInput } from '@vanshasomani/generic-input';
import { ChangePasswordFormConfig } from './change-password.helper';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogContent, MatFormFieldModule, MatDialogActions, MatButtonModule, MatInputModule, GenericInput],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
  changePasswordForm!: FormGroup;
  changePasswordFormConfig = ChangePasswordFormConfig;

  constructor(
    private dialogRef: MatDialogRef<ChangePassword>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private fb: FormBuilder,
    private toastService: SweetToastService,
    private authService: AuthService,
    private jwtService: JwtService
  ) {
    this.changePasswordForm = this.fb.group({
      userId: [this.jwtService.getUserId(), Validators.required],
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, PasswordStrengthValidator]],
      confirmPassword: ['', [Validators.required, PasswordStrengthValidator]]
    },
    { validators: this.passwordsMatchValidator }
    )
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  getControl = (name: string): FormControl => this.changePasswordForm.get(name) as FormControl;

  close = (): void => this.dialogRef.close(false);

  submit(): void{
    if(this.changePasswordForm.invalid) return;

    this.authService.changePasswordPost(this.changePasswordForm.value).subscribe({
      next: (res) => {
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Password changed successfully' : 'Error changing password'));
        if(res.success) this.dialogRef.close(true);
      },
      error: () => {
        this.toastService.showError('Something went wrong');
        this.dialogRef.close(true);
      }
    });
  }

}
