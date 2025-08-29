import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../../shared/components/custom-input/custom-input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, CustomInput, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  forgotPassowrdForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: SweetToastService, private router: Router) {
    this.forgotPassowrdForm = this.fb.group({
      email: ['',[Validators.email, Validators.required]],
    });
  }

  getControl = (name: string): FormControl => this.forgotPassowrdForm.get(name) as FormControl;

  onSubmit(): void{
    if(this.forgotPassowrdForm.invalid) return;

    this.authService.forgotPassword(this.forgotPassowrdForm.value).subscribe({
      next: (res) => {
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Password reset link sent to your email.' : 'Failed to send password reset link. Please try again later.'));
        if (res.success) this.router.navigate(['/login']);
      },
      error: (err) => this.toastService.showError(err.status === 400 ?
        err.error?.message || 'Invalid email address. Please check your input.' :
        'An unexpected error occurred. Please try again later.')
    })
  }
}
