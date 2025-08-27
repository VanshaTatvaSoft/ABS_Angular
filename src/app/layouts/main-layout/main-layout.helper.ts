import { ConfirmDialogConfig } from "../../core/models/confirm-dialog.interface";

export const MarkNotificationAsReadConfirmationDailog: ConfirmDialogConfig = {
  title: "Are you sure?",
  text: "You want to mark this appointment as read?",
  icon: "warning",
  confirmButtonText: "Yes",
  cancelButtonText: "No",
  showCancelButton: true
}

export const MarkAllAsReadConfirmationDailog: ConfirmDialogConfig = {
  title: "Are you sure?",
  text: "You want to mark all notifications as read?",
  icon: "warning",
  confirmButtonText: "Yes",
  cancelButtonText: "No",
  showCancelButton: true
}
