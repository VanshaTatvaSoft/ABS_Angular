import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { TodaysBreakViewModel } from "../../core/models/todays-break.interface";
import { TimeFormatService } from "../../core/services/time-format-service/time-format-service";
import { ScheduleData } from "../../core/models/my-schedule.interface";

export function BreakTimeValidator(timeFormatService: TimeFormatService, data: TodaysBreakViewModel): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null => {
    if(!control.get('startTime') || !control.get('endTime')) return null;

    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (!startTime || !endTime) return null;

    const start = timeFormatService.parseToDate(startTime);
    const end = timeFormatService.parseToDate(endTime);

    if (!start || !end) return null;

    const dayStart = timeFormatService.parseToDate(data.dailyStartTime);
    const dayEnd = timeFormatService.parseToDate(data.dailyEndTime);

    if (dayStart && dayEnd && (start < dayStart || end > dayEnd)) {
      return { outsideWorkingHours: true };
    }

    const conflicts = data.myScheduleList.some(app => {
      const appStart = timeFormatService.parseToDate(app.startTime);
      const appEnd = timeFormatService.parseToDate(app.endTime);
      return appEnd !== null && appStart !== null && start < appEnd && end > appStart;
    });

    const conflictApp: ScheduleData | undefined = data.myScheduleList.find(app => {
      const appStart = timeFormatService.parseToDate(app.startTime);
      const appEnd = timeFormatService.parseToDate(app.endTime);
      return appEnd !== null && appStart !== null && start < appEnd && end > appStart;
    });

    if (conflicts) {
      return {
        appointmentConflict: {
          clientName: conflictApp?.clientName,
          service: conflictApp?.service,
          startTime: conflictApp?.startTime,
          endTime: conflictApp?.endTime
        }
      };
    }

    return null;

  }
}