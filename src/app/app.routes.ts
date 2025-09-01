import { Routes } from '@angular/router';
import { LoginLayout } from './layouts/login-layout/login-layout';
import { Login } from './views/user-login/login/login';
import { ForgotPassword } from './views/user-login/forgot-password/forgot-password';
import { Register } from './views/user-login/register/register';
import { FirstLogin } from './views/user-login/first-login/first-login';
import { ResetPassword } from './views/user-login/reset-password/reset-password';
import { resetPasswordGuard } from './core/guards/reset-password-gaurd/reset-password-guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Dashboard } from './views/dashboard/dashboard/dashboard';
import { entryGuardGuard } from './core/guards/entry-guard/entry-guard-guard';
import { authGuard } from './core/guards/auth-guard/auth-guard';
import { Forbidden } from './views/error-pages/forbidden/forbidden';
import { Service } from './views/service/service';
import { Provider } from './views/provider/provider';
import { Error } from './views/error-pages/error/error';
import { MyService } from './views/my-service/my-service';
import { MySchedule } from './views/my-schedule/my-schedule';
import { MyBookings } from './views/my-bookings/my-bookings';
import { BookAppointment } from './views/book-appointment/book-appointment';
import { ServiceRatting } from './views/my-bookings/service-ratting/service-ratting';
import { TodayBreak } from './views/today-break/today-break';
import { ProviderRevenuePage } from './views/provider/provider-revenue-page/provider-revenue-page';
import { providerRevenueResolver } from './core/guards/provider-revenue-guard/provider-revenue-resolver';
import { UserFormArray } from './views/user-form-array/user-form-array';
import { userFormCanDeactivateGuard } from './core/guards/user-form-can-deactivate-guard/user-form-can-deactivate-guard';
import { SanitizationExample } from './views/sanitization-example/sanitization-example';
import { OnpushExample } from './views/onpush-example/onpush-example';
import { SignalToObservable } from './views/signal-to-observable/signal-to-observable';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: LoginLayout,
    canActivate: [entryGuardGuard],
    children: [
      {
        path: 'login',
        component: Login,
      },
      {
        path: 'forgot-password',
        component: ForgotPassword,
      },
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'first-login',
        component: FirstLogin,
      },
      {
        path: 'reset-password',
        component: ResetPassword,
        canActivate: [resetPasswordGuard],
      },
    ],
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
      },
      {
        path: 'services',
        component: Service,
        canActivate: [authGuard],
      },
      {
        path: 'providers',
        component: Provider,
        canActivate: [authGuard],
      },
      {
        path: 'providers/provider-revenue',
        component: ProviderRevenuePage,
        canActivate: [authGuard],
        resolve: { revenueData: providerRevenueResolver}
      },
      {
        path: 'my-services',
        component: MyService,
        canActivate: [authGuard],
      },
      {
        path: 'my-schedule',
        component: MySchedule,
        canActivate: [authGuard],
      },
      {
        path: 'my-bookings',
        component: MyBookings,
        canActivate: [authGuard],
      },
      {
        path: 'book-appointment',
        component: BookAppointment,
        canActivate: [authGuard],
      },
      {
        path: 'service-ratting',
        component: ServiceRatting,
        canActivate: [authGuard],
      },
      {
        path: 'toadys-break',
        component: TodayBreak,
        canActivate: [authGuard],
      },
      {
        path: 'user-form-array',
        component: UserFormArray,
        canActivate: [authGuard],
        canDeactivate: [userFormCanDeactivateGuard]
      },
      {
        path: 'sanitization-example',
        component: SanitizationExample,
        canActivate: [authGuard],
        canDeactivate: [userFormCanDeactivateGuard]
      },
      {
        path: 'on-push-example',
        component: OnpushExample,
        canActivate: [authGuard],
        canDeactivate: [userFormCanDeactivateGuard]
      },
      {
        path: 'signal-observable-example',
        component: SignalToObservable,
        canActivate: [authGuard],
        canDeactivate: [userFormCanDeactivateGuard]
      }
    ],
  },
  { path: 'forbidden', component: Forbidden },
  { path: 'error', component: Error },
];
