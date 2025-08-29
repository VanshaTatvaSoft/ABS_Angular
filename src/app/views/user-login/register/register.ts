import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { Router } from '@angular/router';
import { PhoneNumberValidator } from '../../../shared/validators/phone-number.validator';
import { GenericInput } from '@vanshasomani/generic-input';
import { RegisterFormConfig } from './registeration.helper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { handelEmailValidation } from '../../../shared/validators/email-check.validator';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, GenericInput, MatFormFieldModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  registerFormConfig = RegisterFormConfig;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: SweetToastService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, PasswordStrengthValidator]],
        confirmPassword: ['', [Validators.required, PasswordStrengthValidator]],
        phoneNo: ['', [Validators.required, PhoneNumberValidator]],
        role: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );

    this.registerForm.get("email")?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email => !email || this.registerForm.get("email")?.invalid ? of(null) : this.authService.checkEmailExist(email).pipe( catchError(() => of(false))))
      )
      .subscribe(exists =>  handelEmailValidation(this.registerForm.get("email"), !exists));
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  onSubmit() {
    if(this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Registration successful. Please login to continue.' : 'Registration failed. Please try again.'));
        if(res.success) this.router.navigate(['/login']);
      },
      error: (err) => this.toastService.showError(err.status === 400 ? err.error?.message || 'Invalid registration data. Please check your inputs.' : 'Registration failed. Please try again later.')
    })
  }

  onReset = (): void => this.registerForm.reset();

  getControl = (name: string): FormControl => this.registerForm.get(name) as FormControl;

}
