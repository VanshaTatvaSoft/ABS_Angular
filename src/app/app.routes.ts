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
    ],
  },
  { path: 'forbidden', component: Forbidden },
  { path: 'error', component: Error },
];
