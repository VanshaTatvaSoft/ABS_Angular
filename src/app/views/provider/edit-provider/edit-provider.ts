import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ProviderService } from '../../../core/services/provider/provider.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EditProviderViewModel } from '../../../core/models/edit-provider.interface';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TimeFormatService } from '../../../core/services/time-format-service/time-format-service';
import { TimeRangeValidator } from '../../../shared/validators/start-end-time.validator';
import { EditProviderForm } from './edit-provider.helper';
import { GenericInput } from '@vanshasomani/generic-input';
import { PhoneNumberValidator } from '../../../shared/validators/phone-number.validator';

@Component({
  selector: 'app-edit-provider',
  imports: [MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatDialogContent, MatDialogActions, CommonModule, FormsModule, MatButtonModule, ReactiveFormsModule, NgxMaterialTimepickerModule, MatCheckboxModule, MatSlideToggleModule, GenericInput],
  templateUrl: './edit-provider.html',
  styleUrl: './edit-provider.css'
})

export class EditProvider implements OnInit{
  isSaving = false;
  editModel!: EditProviderViewModel;
  editForm!: FormGroup;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  editProviderFormConfig = EditProviderForm;

  constructor(
    private dialogRef: MatDialogRef<EditProvider>,
    @Inject(MAT_DIALOG_DATA) public providerId: number,
    private providerService: ProviderService,
    private fb: FormBuilder,
    private toastService: SweetToastService,
    private timeFormatService: TimeFormatService
  ) {}

  ngOnInit(): void {
    this.providerService.getEditProvider(this.providerId).subscribe(res => {
      this.editModel = res;
      this.editForm = this.fb.group({
        providerId: [res.providerId],
        email: [{ value: res.email, disabled: true }],
        name: [res.name, [Validators.required]],
        phoneNo: [res.phoneNo.toString(), [Validators.required, PhoneNumberValidator]],
        providerAvailabilityId: [res.providerAvailabilityId],
        isRecurring: [res.isRecurring],
        isAvailable: [res.isAvailable],
        startTime: [this.timeFormatService.transform(res.startTime, 'short'), [Validators.required]],
        endTime: [this.timeFormatService.transform(res.endTime, 'short'), [Validators.required]],
        days: [res.days ?? []]
      },
      {
        validators: [TimeRangeValidator(this.timeFormatService, [])]
      });
    });
  }

  getControl = (name: string): FormControl => this.editForm.get(name) as FormControl;

  toggleDay(day: string) {
    const selected = this.editForm.value.days;
    if (selected.includes(day)) this.editForm.patchValue({ days: selected.filter((d: string) => d !== day) });
    else this.editForm.patchValue({ days: [...selected, day] });
  }

  submit(): void{
    this.isSaving = true;
    const formValue = this.editForm.getRawValue();

    const formattedModel = {
      ...formValue,
      startTime: this.timeFormatService.transform(formValue.startTime, '24hr'),
      endTime: this.timeFormatService.transform(formValue.endTime, '24hr')
    };

    this.providerService.editProvider(formattedModel).subscribe({
      next:(res) => {
        this.toastService[res.success ? 'showSuccess' : "showError"](res.message || (res.success ? 'Provider edited successfully' : 'Error editing provider'))
        if(res.success) this.dialogRef.close(true);
      },
      error: () => this.toastService.showError('Error updating provider'),
      complete: () => this.isSaving = false
    })
  }

  close = (): void => this.dialogRef.close(false);
}
