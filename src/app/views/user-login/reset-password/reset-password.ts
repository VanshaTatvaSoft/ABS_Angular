import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CustomInput],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  resetPasswordForm!: FormGroup;
  userEmail: string | null = null;
  resetPasswordToken: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private toastService: SweetToastService, private router: Router) {}

  ngOnInit(): void {
    this.userEmail = this.route.snapshot.queryParamMap.get('email');
    this.resetPasswordToken = this.route.snapshot.queryParamMap.get('token');

    this.resetPasswordForm = this.fb.group(
      {
        email: [this.userEmail, Validators.required],
        resetPasswordToken: [this.resetPasswordToken, Validators.required],
        password: ['', [Validators.required, PasswordStrengthValidator]],
        confirmPassword: ['', [Validators.required, PasswordStrengthValidator]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  getControll(name: string): FormControl {
    return this.resetPasswordForm.get(name) as FormControl;
  }

  passwordsMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  onSubmit(): void {
    if(this.resetPasswordForm.invalid) return;
    this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
      next:(res) => {
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Password reset successfully. Please login with your new password.' : 'Failed to reset password. Please try again later.'));
        if(res.success) this.router.navigate(['/login']);
      },
      error: (err) => this.toastService.showError(err.status === 400 ? err.error?.message || 'Invalid reset password request.' : err.message || 'An error occurred while resetting the password.')
    });
  }
}
