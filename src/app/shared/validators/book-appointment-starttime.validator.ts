import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';

export function BookAppointmentStartTimeValidator(timeFormatService: TimeFormatService): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const appointmentDate = group.get('appointmentDate')?.value;
    let startTime = group.get('startTime')?.value;

    if (!appointmentDate || !startTime) return null;

    startTime = timeFormatService.transform(startTime, '24hr');

    const today = new Date();
    const selectedDate = new Date(appointmentDate);

    const isToday =
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    if (isToday) {
      let [hours, minutes] = startTime.split(':').map((x: string) => parseInt(x, 10));
      const selectedStart = new Date();
      selectedStart.setHours(hours, minutes, 0, 0);

      if (selectedStart < today)  return { pastTime: true };
    }

    return null;
  };
}
