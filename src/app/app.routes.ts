import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './modules/auth/guards';
import { AuthLayoutComponent } from './shared/components/layout/auth-layout/auth-layout.component';
import { LandingLayoutComponent } from './shared/components/layout/landing-layout/landing-layout.component';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';

export const appRoutes: Routes = [
  {
    path: 'home',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/landing/landing-routing.module').then(
            (m) => m.LandingRoutingModule
          ),
      },
    ],
    data: {
      title: 'Bem-vindo',
    },
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [noAuthGuard],
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
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard-routing.module').then(
            (m) => m.DashboardRoutes
          ),
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'appointment',
        loadChildren: () =>
          import('./modules/appointament/appointment-routing.module').then(
            (m) => m.AppointmentRoutes
          ),
        data: {
          title: 'Agendamentos',
        },
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/user-routing.module').then(
            (m) => m.UserRoutes
          ),
        data: {
          title: 'Usuários',
        },
      },
      {
        path: 'app-services',
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
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
