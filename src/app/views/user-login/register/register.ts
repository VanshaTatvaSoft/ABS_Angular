import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { RoleOptions } from '../../../shared/constants/role-options.constant';
import { PasswordStrengthValidator } from '../../../shared/validators/password-strength.validator';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { Router } from '@angular/router';
import { PhoneNumberValidator } from '../../../shared/validators/phone-number.validator';
import { GenericInput } from '@vanshasomani/generic-input';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, CustomInput, GenericInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  roles = RoleOptions;

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
        if(res.success){
          this.toastService.showSuccess(res.message || 'Registration successful. Please login to continue.');
          this.router.navigate(['/login']);
        }
        else{
          this.toastService.showError(res.message || 'Registration failed. Please try again.');
        }
      },
      error: (err) => {
        if(err.status === 400) {
          const errorMessage = err.error?.message || 'Invalid registration data. Please check your inputs.';
          this.toastService.showError(errorMessage);
        }
        else{
          this.toastService.showError('Registration failed. Please try again later.');
        }
      }
    })
  }

  onReset() {
    this.registerForm.reset();
  }

  get nameControl(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }
  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get confirmPasswordControl(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }
  get phoneNoControl(): FormControl {
    return this.registerForm.get('phoneNo') as FormControl;
  }
  get roleControl(): FormControl {
    return this.registerForm.get('role') as FormControl;
  }

}
