import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";
import { TimeFormatService } from "../../core/services/time-format-service/time-format-service";

export function DuplicateBreakValidator(timeFormatService: TimeFormatService): ValidatorFn | null{
  return (group: AbstractControl): ValidationErrors | null => {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;
    if (!startTime || !endTime) return null;

    const parent = group.parent as FormArray;
    if (!parent) return null;

    const start = timeFormatService.transform(timeFormatService.transform(startTime, '24hr'), 'min');
    const end = timeFormatService.transform(timeFormatService.transform(endTime, '24hr'), 'min');

    const count = parent.controls.filter(ctrl =>
      ctrl.get('startTime')?.value &&
      timeFormatService.transform(ctrl.get('startTime')?.value, '24hr') === timeFormatService.transform(startTime, '24hr')
    ).length;

    if (count > 1) return { duplicateStartTime: true };

    for(const ctrl of parent.controls){
      if (ctrl === group) continue;
      const otherStartRaw = ctrl.get('startTime')?.value;
      const otherEndRaw = ctrl.get('endTime')?.value;
      if (!otherStartRaw || !otherEndRaw) continue;

      const otherStart = timeFormatService.transform(timeFormatService.transform(otherStartRaw, '24hr'), 'min');
      const otherEnd = timeFormatService.transform(timeFormatService.transform(otherEndRaw, '24hr'), 'min');

      if (start && end && start < otherEnd && end > otherStart) return { conflict: true };
    }

    return null;
  }
}