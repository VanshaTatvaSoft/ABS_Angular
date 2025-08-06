import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ServiceApi } from '../../../core/services/service/service';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-service',
  imports: [MatDialogContent, MatDialogActions, MatButton, MatButtonModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './delete-service.html',
  styleUrl: './delete-service.css'
})
export class DeleteService {
  deleteServiceForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeleteService>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceApi: ServiceApi,
    private toastService: SweetToastService
  ){
    this.deleteServiceForm = this.fb.group({
      serviceId: [data?.serviceId ?? null]
    })
  }

  save(){
    let serviceId = this.deleteServiceForm.get('serviceId')?.value;
    if(!serviceId){
      this.toastService.showError('Service ID is missing.');
      return;
    }
    this.isSaving = true;

    this.serviceApi.deleteService(serviceId).subscribe({
      next: (res) => {
        if(res.success){
          this.toastService.showSuccess(res.message || 'Service deleted succesfully');
          this.dialogRef.close(true);
          this.isSaving = false;
        }
        else{
          this.toastService.showError(res.message || 'Error deleting service');
          this.isSaving = false;
        }
      },
      error: (err) => {
        this.toastService.showError('Something went wrong');
        this.isSaving = false;
      }
    })
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
