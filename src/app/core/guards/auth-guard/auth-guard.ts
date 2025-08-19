import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { JwtService } from '../../services/jwt-service/jwt-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const jwtService = inject(JwtService);

  return authService.validateAccessToken().pipe(
    switchMap((response) => {
      let role = jwtService.getUserRole();
      let name = jwtService.getUserName();
      // authService.setUserRole(jwtService.getUserRole()?? '');
      // authService.setUserName(response.userName?? '');

      authService.setUserRole(jwtService.getUserRole()?? '');
      authService.setUserName(jwtService.getUserName()?? '');
      authService.getUserProfileImg().subscribe({
        next: (res) => {
          authService.setUserImage(res.profileImg);
        }
      });

      // If access token is valid
      if (response.success) {
        return of(true);
      }

      // If access token is expired or invalid, try to refresh using rememberMe
      if(response.message === 'Access token has expired.'){
        return authService.rememberMe().pipe(
          map((res) => {
            if (res.success) {
              authService.setUserRole(jwtService.getUserRole()?? '');
              authService.setUserName(jwtService.getUserName()?? '');
              authService.setUserImage(res.profileImg);
              return true; // Tokens refreshed successfully
            } else {
              router.navigate(['/login']);
              return false;
            }
          }),
          catchError(() => {
            router.navigate(['/login']);
            return of(false);
          })
        );
      }

      authService.logout().subscribe();
      router.navigate(['/login']);
      return of(false);
    }),
    catchError((err) => {

      if(err.status === 401){
        authService.logout().subscribe();
        router.navigate(['/login']);
        return of(false);
      }

      router.navigate(['/error']);
      return of(false); // Default to false if any error occurs
    })
  );
};
