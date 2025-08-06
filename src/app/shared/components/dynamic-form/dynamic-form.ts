import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CustomInput } from '../custom-input/custom-input';
import { DynamicFormField } from '../../../core/models/dynamic-form-filed.interface';

@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule, ReactiveFormsModule, CustomInput],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css'
})
export class DynamicForm implements OnInit{
  @Input() fields: DynamicFormField[] = [];
  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const group: { [key: string]: FormControl } = {};

    this.fields.forEach(field => {
      const validators: ValidatorFn[] = [];

      field.validations?.forEach(v => {
        switch (v.name) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'minlength':
            validators.push(Validators.minLength(v.value));
            break;
          case 'maxlength':
            validators.push(Validators.maxLength(v.value));
            break;
          case 'email':
            validators.push(Validators.email);
            break;
          case 'pattern':
            validators.push(Validators.pattern(v.value));
            break;
        }
      });

      group[field.key] = new FormControl(field.customInput.value || '', validators);
    });

    this.form = this.fb.group(group);
  }

  getControl(key: string): FormControl {
    return this.form.get(key) as FormControl;
  }

  getCustomErrors(field: DynamicFormField): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    field.validations?.forEach(v => {
      errors[v.name] = v.message;
    });
    return errors;
  }

  submitForm(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
