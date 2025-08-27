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
import { timeNotZeroValidator } from '../../../shared/validators/duration-not-zero.validator';
import { ServiceFormConfig } from './add-edit-service.helper';
import { TimeFormatService } from '../../../core/services/time-format-service/time-format-service';

@Component({
  selector: 'app-add-edit-service',
  imports: [ MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDialogActions, MatDialogContent, MatButtonModule, MatProgressSpinnerModule, CommonModule, GenericInput ],
  templateUrl: './add-edit-service.html',
  styleUrl: './add-edit-service.css',
})
export class AddEditService {
  serviceForm: FormGroup;
  isSaving = false;
  serviceFormConfig = ServiceFormConfig;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditService>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ServiceApi,
    private toastService: SweetToastService,
    private timeFormatService: TimeFormatService
  ) {
    data = {
      ...data,
      price: data?.price ? Number(String(data.price).replace(/[₹,]/g, '')) : null,
      commission: data?.commission ? Number(String(data.commission).replace('%', '')) : null,
      duration: data?.duration ? this.timeFormatService.transform(String(data.duration).replace(' min', ''), 'hour') : null
    }
    this.serviceForm = this.fb.group({
      serviceId: [data?.serviceId ?? null],
      serviceName: [data?.serviceName ?? '', Validators.required],
      serviceDesc: [data?.serviceDesc ?? '', Validators.required],
      price: [data?.price ?? '', [Validators.required, Validators.min(1)]],
      commission: [data?.commission ?? '', [Validators.required, Validators.min(1), Validators.max(100)]],
      duration: [data?.duration ?? '', [Validators.required, timeNotZeroValidator()]],
    });
  }

  getControl(name: string): FormControl {
    return this.serviceForm.get(name) as FormControl;
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
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Service saved successfully' : 'Something went wrong'));
        if(res.success) this.dialogRef.close(true);
      },
      error: () => this.toastService.showError('An error occurred'),
      complete: () => this.isSaving = false
    });

  }

  cancel = (): void => this.dialogRef.close(null);
}
