import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { Router } from '@angular/router';
import { PasswordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { CommonModule } from '@angular/common';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';

@Component({
  selector: 'app-first-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, CustomInput],
  templateUrl: './first-login.html',
  styleUrl: './first-login.css'
})
export class FirstLogin implements OnInit {
  firstLoginForm: FormGroup;
  userId: number | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: SweetToastService, private router: Router) {
    this.firstLoginForm = this.fb.group(
      {
        userId: [this.userId, Validators.required],
        password: ['', [Validators.required, PasswordStrengthValidator]],
        confirmPassword: ['', [Validators.required, PasswordStrengthValidator]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit(): void{
    const userIdString = history.state?.['userId'] || null;
    this.userId = userIdString ? Number(userIdString) : null;
    this.firstLoginForm.patchValue({ userId: this.userId });
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  get passwordControl(): FormControl {
    return this.firstLoginForm.get('password') as FormControl;
  }
  get confirmPasswordControl(): FormControl {
    return this.firstLoginForm.get('confirmPassword') as FormControl;
  }

  onSubmit(): void{
    if(this.firstLoginForm.invalid) return;

    this.authService.firstLogin(this.firstLoginForm.value).subscribe({
      next: (res) => {
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Password changed successfully. Please login with your new password.' : 'Failed to change password. Please try again later.'));
        if(res.success) this.router.navigate(['/login']);
      },
      error: (err) => this.toastService.showError(err.message || 'An error occurred while changing the password.')
    })
  }

}
