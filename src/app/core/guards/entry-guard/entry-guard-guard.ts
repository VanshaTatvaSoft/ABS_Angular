import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, of, switchMap } from 'rxjs';
import { JwtService } from '../../services/jwt-service/jwt-service';

export const entryGuardGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const jwtService = inject(JwtService);

  const rememberMe = cookieService.get('rememberMe');

  if (rememberMe == 'True') {
    return authService.rememberMe().pipe(
      switchMap(res => {
        if (res.success) {
          // console.log("Entry Res - ",res);
          authService.setUserRole(jwtService.getUserRole()?? '');
          authService.setUserName(jwtService.getUserName()?? '');
          router.navigate([`/${res.redirectTo}`]);
          return of(false);
        } else {
          return authService.logout().pipe(map(() => true));
        }
      }),
      catchError(() => {
        return authService.logout().pipe(map(() => true));
      })
    );
  } else {
    authService.logout().subscribe();
    // router.navigate(['/login']);
    return of(true);
  }
};
