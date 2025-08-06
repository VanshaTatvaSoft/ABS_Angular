import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ProviderService } from '../../../core/services/provider/provider.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetToastService } from '../../../core/services/toast/sweet-toast.service';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, formatDate } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EditProviderViewModel } from '../../../core/models/edit-provider.interface';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TimeFormatService } from '../../../core/services/time-format-service/time-format-service';
import { TimeFormatterPipe } from 'ngx-material-timepicker/src/app/material-timepicker/pipes/time-formatter.pipe';

@Component({
  selector: 'app-edit-provider',
  imports: [MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatDialogContent, MatDialogActions, CommonModule, FormsModule, MatButtonModule, ReactiveFormsModule, NgxMaterialTimepickerModule, MatCheckboxModule, MatSlideToggleModule ],
  templateUrl: './edit-provider.html',
  styleUrl: './edit-provider.css'
})
export class EditProvider implements OnInit{
  isSaving = false;
  editModel!: EditProviderViewModel;
  editForm!: FormGroup;
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private dialogRef: MatDialogRef<EditProvider>,
    @Inject(MAT_DIALOG_DATA) public providerId: number,
    private providerService: ProviderService,
    private fb: FormBuilder,
    private toastService: SweetToastService,
    private timeFormatService: TimeFormatService
  ) {}

  ngOnInit(): void {
    // console.log('Calling with Provider ID:', this.providerId);
    this.providerService.getEditProvider(this.providerId).subscribe(res => {
      this.editModel = res;
      // console.log("Edit Model - ",this.editModel);
      this.editForm = this.fb.group({
        providerId: [res.providerId],
        email: [{ value: res.email, disabled: true }],
        name: [res.name, [Validators.required]],
        phoneNo: [res.phoneNo, [Validators.required]],
        providerAvailabilityId: [res.providerAvailabilityId],
        isRecurring: [res.isRecurring],
        isAvailable: [res.isAvailable],
        startTime: [this.timeFormatService.transform(res.startTime, 'short'), [Validators.required]],
        endTime: [this.timeFormatService.transform(res.endTime, 'short'), [Validators.required]],
        days: [res.days ?? []]
      });
    });
  }

  formatTime(time: string): string {
    return time?.slice(0, 5); // "09:30:00" -> "09:30"
  }

  toggleDay(day: string) {
    const selected = this.editForm.value.days;
    if (selected.includes(day)) {
      this.editForm.patchValue({ days: selected.filter((d: string) => d !== day) });
    } else {
      this.editForm.patchValue({ days: [...selected, day] });
    }
  }

  convertTo24HrFormat(time: string): string {
    if (!time) return '';
    const [hourPart, modifier] = time.split(' ');
    let [hours, minutes] = hourPart.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');

    return `${h}:${m}:00`;
  }

  submit(): void{
    this.isSaving = true;
    // console.log("Form Value - ",this.editForm.value);

    const formValue = this.editForm.getRawValue(); // includes disabled fields like email
    const selectedDays = JSON.stringify(formValue.days);

    // Ensure time format is HH:mm:ss
    const formattedModel = {
      ...formValue,
      startTime: this.timeFormatService.transform(formValue.startTime, '24hr'),
      endTime: this.timeFormatService.transform(formValue.endTime, '24hr')
    };

    // console.log("formattedModel - ",formattedModel);

    this.providerService.editProvider(formattedModel, selectedDays).subscribe({
      next:(res) => {
        if(res.success){
          this.isSaving = false;
          this.toastService.showSuccess(res.message?? 'Provider edited successfully');
          this.dialogRef.close(true);
        }
        else{
          this.isSaving = false;
          this.toastService.showError(res.message?? 'Error editing provider')
        }
      },
      error: () => {
        this.isSaving = false;
        this.toastService.showError('Error updating provider');
      },
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
