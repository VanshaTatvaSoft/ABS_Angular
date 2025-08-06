import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { MyBookingService } from '../../../core/services/my-booking-service/my-booking-service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-service-ratting',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './service-ratting.html',
  styleUrl: './service-ratting.css'
})
export class ServiceRatting implements OnInit{
  appointmentId: number | null = null;
  rattingForm!: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private toastService: SweetToastService, private router: Router, private myBookingService: MyBookingService) {
    const idParam = this.route.snapshot.queryParamMap.get('appointmentId');
    this.appointmentId = idParam ? Number(idParam) : null;
    this.rattingForm = this.fb.group({
      appointmentId: [this.appointmentId],
      rattingCount: ['',Validators.required],
      rattingDesc: ['',[Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.myBookingService.checkRatting(this.appointmentId??0).subscribe({
      next: (res) => {
        if(!res){
          this.router.navigate(['/error']);
        }
      }
    });
  }

  setRating(value: number): void {
    this.rattingForm.get('rattingCount')?.setValue(value);
  }

  get ratingValue(): number {
    return this.rattingForm.get('rattingCount')?.value || 0;
  }

  submit(): void {
    if (this.rattingForm.invalid) {
      this.toastService.showError('Please provide a valid rating');
      return;
    }
    this.myBookingService.ratting(this.rattingForm.value).subscribe({
      next: (res) => {
        if(res.success){
          this.toastService.showSuccess('Ratting saved successfully');
          this.router.navigate(['/my-bookings']);
          return;
        }
        this.toastService.showError('Error saving ratting');
      }
    });
  }
}

