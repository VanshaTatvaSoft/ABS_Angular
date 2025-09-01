import { AbstractControl, FormArray, ValidationErrors } from "@angular/forms";

export function userUniqueEmail(control: AbstractControl): ValidationErrors | null {
  if(!control.value || !control.parent) return null;

  const FormArray = control.parent.parent as FormArray;

  if(!FormArray || !FormArray.controls) return null;

  const emails = FormArray.controls.map(group => group.get('email')?.value);
  const duplicate = emails.filter(emails => emails === control.value);

  return duplicate.length > 1 ? {duplicateEmail: true} : null;
}