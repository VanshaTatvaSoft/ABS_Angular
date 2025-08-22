import { AbstractControl } from "@angular/forms";

export function handelEmailValidation(control: AbstractControl | null, exists: boolean | null){
  if(!control) return;
  if(exists === false) control.setErrors({ ...control.errors, notFound: true });
  else if (control.errors?.['notFound']) {
    const { notFound, ...rest } = control.errors;
    control.setErrors(Object.keys(rest).length ? rest : null);
  }
}