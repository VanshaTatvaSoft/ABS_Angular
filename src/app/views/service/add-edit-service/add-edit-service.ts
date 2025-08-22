import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ServiceApi } from '../../../core/services/service/service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { GenericInput } from '@vanshasomani/generic-input';

@Component({
  selector: 'app-add-edit-service',
  imports: [ MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDialogActions, MatDialogContent, MatButtonModule, MatProgressSpinnerModule, CommonModule, GenericInput ],
  templateUrl: './add-edit-service.html',
  styleUrl: './add-edit-service.css',
})
export class AddEditService {
  serviceForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditService>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ServiceApi,
    private toastService: SweetToastService
  ) {
    this.serviceForm = this.fb.group({
      serviceId: [data?.serviceId ?? null],
      serviceName: [data?.serviceName ?? '', Validators.required],
      serviceDesc: [data?.serviceDesc ?? '', Validators.required],
      price: [data?.price ?? '', [Validators.required, Validators.min(1)]],
      duration: [data?.duration ?? '', [Validators.required]],
    });
  }

  get serviceNameControll(): FormControl {
    return this.serviceForm.get('serviceName') as FormControl;
  }

  get serviceDescControll(): FormControl {
    return this.serviceForm.get('serviceDesc') as FormControl;
  }

  get priceControll(): FormControl {
    return this.serviceForm.get('price') as FormControl;
  }

  get durationControll(): FormControl {
    return this.serviceForm.get('duration') as FormControl;
  }

  save() {
    if (this.serviceForm.invalid) return;
    const formValue = this.serviceForm.value;
    this.isSaving = true;
    const payload = {
      ...formValue,
      duration: formValue.duration.length === 5 ? formValue.duration + ':00' : formValue.duration,
    };

    const action$ = formValue.serviceId ? this.serviceApi.editService(payload) : this.serviceApi.addService(payload);

    action$.subscribe({
      next: (res) => {
        debugger
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Service saved successfully' : 'Something went wrong'));
        if(res.success) this.dialogRef.close(true);
      },
      error: () => this.toastService.showError('An error occurred'),
      complete: () => this.isSaving = false
    });

  }

  cancel = (): void => this.dialogRef.close(null);
}
