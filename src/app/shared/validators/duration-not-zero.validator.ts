import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function timeNotZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if(value && value === "00:00") {
      return { timeZero: true };
    }
    return null;
  }
}