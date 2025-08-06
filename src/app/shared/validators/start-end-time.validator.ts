import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TimeFormatService } from '../../core/services/time-format-service/time-format-service';
import { inject } from '@angular/core';

export function TimeRangeValidator(timeFormatService: TimeFormatService, serviceList: any[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;
    const serviceId = group.get('serviceId')?.value;

    if (!startTime || !endTime) return null;

    const start = +timeFormatService.transform(timeFormatService.transform(startTime, '24hr'), 'min');
    const end = +timeFormatService.transform(timeFormatService.transform(endTime, '24hr'), 'min');

    const selectedService = serviceList?.find(s => s.serviceId === serviceId);
    const durationMin = selectedService ? +timeFormatService.transform(selectedService.duration, 'min') : 0;

    if (start === end) return { timeSame: true };
    if (start > end) return { startAfterEnd: true };
    if (end - start < durationMin) return { insufficientDuration: true };

    return null;
  };
}
