import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { PhoneNumberValidator } from '../../../shared/validators/phone-number.validator';
import { ProviderService } from '../../../core/services/provider/provider.service';
import { GenericInput } from '@vanshasomani/generic-input';
import { AddProviderForm } from './add-provider.helper';

@Component({
  selector: 'app-add-provider',
  imports: [MatDialogActions, MatDialogContent, MatDialogModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatProgressSpinnerModule, CommonModule, GenericInput],
  templateUrl: './add-provider.html',
  styleUrl: './add-provider.css'
})
export class AddProvider {
  addProviderForm: FormGroup;
  isSaving = false;
  addProviderFormConfig = AddProviderForm;

  constructor(private fb: FormBuilder,private dialogRef: MatDialogRef<AddProvider>, @Inject(MAT_DIALOG_DATA) public data: any, private toastService: SweetToastService, private providerService: ProviderService){
    this.addProviderForm = this.fb.group({
      providerName: ['', Validators.required],
      providerEmail: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, PhoneNumberValidator]]
    })
  }

  getControl(name: string): FormControl {
    return this.addProviderForm.get(name) as FormControl;
  }

  submit(): void{
    if(this.addProviderForm.invalid) return;
    this.isSaving = true;
    this.providerService.addProvider(this.addProviderForm.value).subscribe({
      next: (res) => {
        this.toastService[res.success ? 'showSuccess' : 'showError'](res.message || (res.success ? 'Provider added successfuly' : 'Error adding provider'));
        if(res.success) this.dialogRef.close(true);
      },
      error: (err) => this.toastService.showError('An error occurred'),
      complete: () => this.isSaving = false
    });
  }

  cancel = () => this.dialogRef.close(null);

}
