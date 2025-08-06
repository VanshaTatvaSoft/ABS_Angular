import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
} from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import {
  GenericInput,
  GenericInputInterface,
} from '@vanshasomani/generic-input';
import { JwtService } from '../../../core/services/jwt-service/jwt-service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterLink,
    GenericInput,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: SweetToastService,
    private router: Router,
    private jwtService: JwtService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    this.emailControl.valueChanges
      .pipe(
        debounceTime(500), // Wait for user to stop typing
        distinctUntilChanged(), // Only when value is changed
        switchMap((email) => {
          if (!email || this.emailControl.invalid) {
            return of(null); // Skip API call if empty or invalid email
          }
          return this.authService.checkEmailExist(email).pipe(
            catchError(() => of(false)) // Handle error as email not found
          );
        })
      )
      .subscribe((exists) => {
        if (exists === false) {
          this.emailControl.setErrors({ notFound: true });
        } else {
          const errors = this.emailControl.errors;
          if (errors) {
            delete errors['notFound'];
            if (Object.keys(errors).length === 0) {
              this.emailControl.setErrors(null);
            } else {
              this.emailControl.setErrors(errors);
            }
          }
        }
      });
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    // console.log('Login Form Submitted:', this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message || 'Login successful');
        this.authService.setUserRole(res.role ?? '');
        this.authService.setUserName(this.jwtService.getUserName() ?? '');
        if (res.isFirst) {
          this.router.navigate(['/first-login'], {
            state: { userId: res.userId },
          });
        } else {
          this.router.navigate([`/${res.redirectTo}`]);
        }
      },
      error: (err) => {
        if (err.status === 400) {
          // console.log("err - ",err);
          this.toastService.showError(
            err.error?.message || 'Invalid email or password'
          );
          return;
        } else {
          this.toastService.showError(
            err.message || 'An error occurred during login'
          );
        }
      },
    });
  }
}
