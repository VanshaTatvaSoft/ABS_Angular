import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';
import { SweetToastService } from '../../services/toast/sweet-toast.service';

export const resetPasswordGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(SweetToastService);
  const email = route.queryParamMap.get('email');
  const token = route.queryParamMap.get('token');

  if (!email || !token) {
    toastService.showError('Invalid reset password link. Please try again.');
    return of(router.createUrlTree(['/login']));
  }

  return authService.resetPasswordCheck(email, token).pipe(
    map((res) => {
      if(res.success){
        return true;
      }
      else{
        toastService.showError('Invalid reset password link. Please try again.');
        return router.createUrlTree(['/login']);
      }
    }),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};
