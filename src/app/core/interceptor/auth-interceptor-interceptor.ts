import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // if ( req.url.endsWith('/login') || req.url.endsWith('/register') || req.url.endsWith('/check-email-exist')  || req.url.endsWith('/first-change-password')
  //     || req.url.endsWith('/forgot-password') || req.url.endsWith('/reset-password-check') || req.url.endsWith('/reset-password')
  //     || req.url.endsWith('/remember-me') || req.url.endsWith('/logout') || req.url.endsWith('/validate-access-token')) {
  //   return next(req);
  // }

  const modifiedReq = req.clone({
    withCredentials: true
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401){
        return authService.rememberMe().pipe(
          switchMap((res) => {
            if(res?.success){
              return next(modifiedReq);
            }else {
              authService.logout().subscribe();
              router.navigate(['/login']);
              return throwError(() => new Error('Unauthorized'));
            }
          }),

          catchError(() => {
            authService.logout().subscribe();
            router.navigate(['/login']);
            return throwError(() => new Error('Session expired'));
          })
        )
      }

      if (error.status === 403) {
        router.navigate(['/forbidden']);
        return throwError(() => new Error('Forbidden'));
      }

      return throwError(() => error);
    })
  )
};
