import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PhoneNumberValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value: string = control.value || '';

  if (!value) return null; // Let required validator handle empty values

  const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit format

  if (value.length !== 10) {
    return { invalidLength: true };
  }

  return phoneRegex.test(value) ? null : { invalidPhone: true };
};
