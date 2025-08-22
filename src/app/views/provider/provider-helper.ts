import { ConfirmDialogConfig } from "../../core/models/confirm-dialog.interface";

export const DeleteProviderSwalConfig: ConfirmDialogConfig = {
  title: "Delete Service",
  text: "Are you sure you want to delete this service?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}

export const ProviderColumnHeader = [
  { key: 'serial', header: '#', sortable: false },
  { key: 'providerName', header: 'Provider Name', sortable: true },
  { key: 'email', header: 'Provider Email', sortable: true },
  { key: 'phoneNo', header: 'Provider Phone No.', sortable: false },
];
