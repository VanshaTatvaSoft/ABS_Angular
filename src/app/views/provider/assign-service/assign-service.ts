import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignServiceViewModel } from '../../../core/models/assign-service.interface';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ProviderService } from '../../../core/services/provider/provider.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignalrService } from '../../../core/services/signalr-service/signalr-service';
import { GenericInput } from '@vanshasomani/generic-input';

@Component({
  selector: 'app-assign-service',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatSelectModule, CommonModule, MatProgressSpinnerModule, MatDialogContent, MatDialogActions, GenericInput],
  templateUrl: './assign-service.html',
  styleUrl: './assign-service.css'
})
export class AssignService {
  assignModel!: AssignServiceViewModel;
  selectedServiceIds: number[] = [];
  isSaving = false;

  constructor(
    private dialogRef: MatDialogRef<AssignService>,
    @Inject(MAT_DIALOG_DATA) public data: { providerId: number, role: string },
    private providerService: ProviderService,
    private fb: FormBuilder,
    private toastService: SweetToastService,
    private signalrService: SignalrService
  ) {}

  ngOnInit(): void {
    this.getAssignService();
    this.signalrService.startConnection();
    this.signalrService.myService = (msg) => { this.getAssignService(); }
    this.signalrService.service = (msg) => { this.getAssignService(); }
  }

  getAssignService() {
    this.providerService.getAssignService(this.data.providerId).subscribe(res => {
      this.assignModel = res;
      this.selectedServiceIds = [...res.existingServiceId];
    });
  }

  isChecked(serviceId: number): boolean {
    return this.selectedServiceIds.includes(serviceId);
  }

  onCheckboxChange(serviceId: number, event: MatCheckboxChange): void {
    if (event.checked) this.selectedServiceIds.push(serviceId);
    else this.selectedServiceIds = this.selectedServiceIds.filter(id => id !== serviceId);
  }


  submit(): void {
    const newlySelected = this.selectedServiceIds.filter(id => !this.assignModel.existingServiceId.includes(id));
    const removed = this.assignModel.existingServiceId.filter(id => !this.selectedServiceIds.includes(id));
    this.isSaving = true;
    this.providerService.assignServices(this.assignModel.providerId, newlySelected, removed)
    .subscribe({
      next: (res) => {
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || res.success ? 'Service assigned successfuly' : 'Error assigning service');
        if(res.success) this.dialogRef.close(true);
      },
      error: (err) => this.toastService.showError('An error occurred while assigning services'),
      complete: () => this.isSaving = false
    });
  }

  close = (): void =>  this.dialogRef.close(false);
}
