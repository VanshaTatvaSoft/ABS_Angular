import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const startEndDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;

  if(!startDate || !endDate){
    return null;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.getTime() === end.getTime()) {
    return { sameDate: true };
  }

  if (start > end) {
    return { startAfterEnd: true };
  }

  return null;
}