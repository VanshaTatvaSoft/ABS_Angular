import { ConfirmDialogConfig } from "../../core/models/confirm-dialog.interface";

export const DeleteServiceSwalConfig : ConfirmDialogConfig = {
  title: 'Delete Service',
  text: 'Are you sure you want to delete this service?',
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}

export const ServiceColumnHeader = [
  { key: 'serial', header: '#', sortable: false },
  { key: 'serviceName', header: 'Name', sortable: true },
  { key: 'serviceDesc', header: 'Description', sortable: false },
  { key: 'duration', header: 'Duration', sortable: true },
  { key: 'price', header: 'Price', sortable: true },
  { key: 'count', header: 'Provided Count', sortable: true },
]
