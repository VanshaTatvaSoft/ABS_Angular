import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { GenericInput } from '@vanshasomani/generic-input';
import { JwtService } from '../../../core/services/jwt-service/jwt-service';
import { handelEmailValidation } from '../../../shared/validators/email-check.validator';
@Component({
  selector: 'app-login',
  imports: [ FormsModule, CommonModule, ReactiveFormsModule, MatCheckboxModule, RouterLink, GenericInput ],
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
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email => !email || this.emailControl.invalid ? of(null) : this.authService.checkEmailExist(email).pipe( catchError(() => of(false))))
      )
      .subscribe((exists) => {
        handelEmailValidation(this.emailControl, exists);
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
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.message || 'Login successful');
        this.authService.setUserRole(res.role ?? '');
        this.authService.setUserImage(res.profileImg);
        this.authService.setUserName(this.jwtService.getUserName() ?? '');
        this.router.navigate(res.isFirst ? ['/first-login'] : [`/${res.redirectTo}`], { state: res.isFirst ? { userId: res.userId } : undefined });
      },
      error: (err) => this.toastService.showError(err.status === 400 ? err.error?.message || 'Invalid email or password' : err.message || 'An error occurred during login')
    });
  }
}
