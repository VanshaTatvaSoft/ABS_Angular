import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeFormatService } from '../time-format-service/time-format-service';
import { BreakData, TodaysBreakViewModel } from '../../models/todays-break.interface';
import { startTimeNotPastValidator } from '../../../shared/validators/start-time-now.validator';
import { BreakTimeValidator } from '../../../shared/validators/break-time.validator';
import { TimeRangeValidator } from '../../../shared/validators/start-end-time.validator';
import { DuplicateBreakValidator } from '../../../shared/validators/duplicate-break.validator';

@Injectable({
  providedIn: 'root'
})
export class BreakFormFactoryService {
  constructor(private fb: FormBuilder, private timeFormatService: TimeFormatService) {}

  createBreak(b: BreakData | null, data: TodaysBreakViewModel): FormGroup {
    const canEdit = b?.startTime ? this.checkCanEdit(b.startTime) : true;

    return this.fb.group({
      providerBreakId: [b?.providerBreakId || ''],
      startTime: [
        {
          value: b?.startTime ? this.timeFormatService.transform(b.startTime, '12hr') : '',
          disabled: !canEdit
        },
        [Validators.required, startTimeNotPastValidator(this.timeFormatService)]
      ],
      endTime: [
        {
          value: b?.endTime ? this.timeFormatService.transform(b.endTime, '12hr') : '',
          disabled: !canEdit
        },
        Validators.required
      ],
      canEdit: [canEdit]
    }, {
      validators: [
        TimeRangeValidator(this.timeFormatService, []),
        BreakTimeValidator(this.timeFormatService, data),
        DuplicateBreakValidator(this.timeFormatService)
      ]
    });
  }

  checkCanEdit(startTime: string): boolean {
    const start = this.timeFormatService.parseToDate(startTime);
    const now = new Date();
    return !!start && start > now;
  }
}
