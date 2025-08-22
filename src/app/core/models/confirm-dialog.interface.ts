import { SweetAlertIcon } from "sweetalert2";

export interface ConfirmDialogConfig {
  title: string;
  text: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}