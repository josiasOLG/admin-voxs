import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { NoAuthGuard } from './modules/auth/guards/no-auth.guard';
import { AuthLayoutComponent } from './shared/components/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';
import { AppRoutes } from './shared/constants/app.routes';

export const appRoutes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [NoAuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/auth/auth-routing.module').then(
            (m) => m.AuthRoutingModule
          ),
      },
    ],
    data: {
      title: 'Autenticação',
    },
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: AppRoutes.DASHBOARD.slice(1), // Remove a barra inicial
        loadChildren: () =>
          import('./modules/dashboard/dashboard-routing.module').then(
            (m) => m.DashboardRoutes
          ),
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: AppRoutes.APPOINTMENTS.slice(1), // Remove a barra inicial
        loadChildren: () =>
          import('./modules/appointament/appointment-routing.module').then(
            (m) => m.AppointmentRoutes
          ),
        data: {
          title: 'Agendamentos',
        },
      },
      {
        path: AppRoutes.USERS.slice(1), // Remove a barra inicial
        loadChildren: () =>
          import('./modules/users/user-routing.module').then(
            (m) => m.UserRoutes
          ),
        data: {
          title: 'Usuários',
        },
      },
      {
        path: AppRoutes.APP_SERVICES.slice(1), // Remove a barra inicial
        loadChildren: () =>
          import('./modules/app-services/app-service-routing.module').then(
            (m) => m.AppServiceRoutes
          ),
        data: {
          title: 'App Services',
        },
      },
      {
        path: '',
        redirectTo: AppRoutes.DASHBOARD,
        pathMatch: 'full',
      },
    ],
  },

  {
    path: 'login',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
