import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PasswordStrengthValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value: string = control.value || '';
  const errors: ValidationErrors = {};

  if (!/[A-Z]/.test(value)) errors['noUpperCase'] = true;
  if (!/[a-z]/.test(value)) errors['noLowerCase'] = true;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors['noSpecialChar'] = true;
  if (value.length < 8) errors['tooShort'] = true;

  return Object.keys(errors).length ? errors : null;
};
