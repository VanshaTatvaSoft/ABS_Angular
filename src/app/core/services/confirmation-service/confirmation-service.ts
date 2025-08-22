import { Injectable } from '@angular/core';
import { ConfirmDialogConfig } from '../../models/confirm-dialog.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  confirm(config: ConfirmDialogConfig): Promise<boolean>{
    const defaultConfig: ConfirmDialogConfig = {
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      ...config
    };

    return Swal.fire({
      title: defaultConfig.title,
      text: defaultConfig.text,
      icon: defaultConfig.icon,
      showCancelButton: defaultConfig.showCancelButton,
      confirmButtonText: defaultConfig.confirmButtonText,
      cancelButtonText: defaultConfig.cancelButtonText
    }).then(result => result.isConfirmed);
  }
}
