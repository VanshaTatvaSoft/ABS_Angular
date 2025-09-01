import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ProviderService } from '../../services/provider/provider.service';

export const providerRevenueResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
  const providerId = +route.queryParamMap.get('providerId')!;
  const providerService = inject(ProviderService);
  const router = inject(Router);
  if(!providerId){
    router.navigate(['/providers']);
    return of(null);
  }
  return providerService.getProviderRevenue(providerId).pipe(
    catchError(err => {
      router.navigate(['/error']);
      return of(null);
    })
  );
};
