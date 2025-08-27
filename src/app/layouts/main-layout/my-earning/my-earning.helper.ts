import { FormGroup, Validators } from "@angular/forms";
import { startEndDateValidator } from "../../../shared/validators/start-end-date.validator";
import { AuthService } from "../../../core/services/auth/auth.service";

export function startEndEnable(myEarningFormControl: FormGroup) {
  const startDateCtrl = myEarningFormControl.get('startDate');
  const endDateCtrl = myEarningFormControl.get('endDate');
  startDateCtrl?.enable();
  endDateCtrl?.enable();
  startDateCtrl?.setValidators([Validators.required]);
  endDateCtrl?.setValidators([Validators.required]);
  myEarningFormControl.addValidators([startEndDateValidator]);
}

export function startEndDisable(myEarningFormControl: FormGroup, authService: AuthService) {
  const startDateCtrl = myEarningFormControl.get('startDate');
  const endDateCtrl = myEarningFormControl.get('endDate');
  startDateCtrl?.reset();
  endDateCtrl?.reset();
  startDateCtrl?.disable();
  endDateCtrl?.disable();
  startDateCtrl?.clearValidators();
  endDateCtrl?.clearValidators();
  myEarningFormControl.removeValidators([startEndDateValidator]);
}

export function filteControlChange(value: string, myEarningFormControl: FormGroup, authService: AuthService) {
  if(value === 'custom') {
    startEndEnable(myEarningFormControl);
  } else {
    startEndDisable(myEarningFormControl, authService);
  }
  myEarningFormControl.get('startDate')?.updateValueAndValidity();
  myEarningFormControl.get('endDate')?.updateValueAndValidity();
}