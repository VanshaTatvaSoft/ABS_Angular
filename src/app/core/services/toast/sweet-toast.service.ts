import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetToastService {
  private fireToast(message: string, icon: 'success' | 'error' | 'warning' | 'info') {
    Swal.fire({
      toast: true,
      position: 'top-end', // or 'bottom-end'
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }

  showSuccess(message: string, title: string = 'Success') {
    this.fireToast(message, 'success');
  }

  showError(message: string, title: string = 'Error') {
    this.fireToast(message, 'error');
  }

  showWarning(message: string, title: string = 'Warning') {
    this.fireToast(message, 'warning');
  }

  showInfo(message: string, title: string = 'Info') {
    this.fireToast(message, 'info');
  }
}
