import { ConfirmDialogConfig } from "../../core/models/confirm-dialog.interface";
import { TimeFormatService } from "../../core/services/time-format-service/time-format-service";

export function buildBreakPayload(
  providerId: number,
  currentBreaks: any[],
  originalBreaks: any[],
  deletedBreaks: number[],
  timeFormatService: TimeFormatService
) {
  const newBreaks = currentBreaks.filter((brk: any) =>
    !brk.providerBreakId || brk.providerBreakId === 0
  );

  const editedBreaks = currentBreaks.filter((brk: any) => {
    if (!brk.providerBreakId) return false;
    const original = originalBreaks.find(o => o.providerBreakId === brk.providerBreakId);
    if (!original) return false;
    const startChanged = timeFormatService.transform(brk.startTime, '24hr') !==
                         timeFormatService.transform(original.startTime, '24hr');
    const endChanged = timeFormatService.transform(brk.endTime, '24hr') !==
                       timeFormatService.transform(original.endTime, '24hr');
    return startChanged || endChanged;
  });

  return {
    providerId: providerId,
    addBreakList: [...newBreaks, ...editedBreaks]
    .map((brk: any) => ({
      providerBreakId: brk.providerBreakId || 0,
      startTime: timeFormatService.transform(brk.startTime, '24hr'),
      endTime: timeFormatService.transform(brk.endTime, '24hr'),
      canEdit: brk.canEdit
    })),
    deleteBreakIds: deletedBreaks
  }
}

export const DeleteBreakConfirmationDailog: ConfirmDialogConfig = {
  title: "Are you sure you want to delete this break?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "No"
}
