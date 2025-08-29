import { AbstractControl, ValidationErrors } from "@angular/forms";
import { TimeFormatService } from "../../core/services/time-format-service/time-format-service";

export function startTimeNotPastValidator(timeFormatService: TimeFormatService): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    if (!value) return null;
    const start = timeFormatService.parseToDate(value);
    const now = new Date();

    if(start && start < now) return { startTimeInPast: true };

    return null;
  }
}