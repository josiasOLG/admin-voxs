import { Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { NoAuthGuard } from './modules/auth/guards/no-auth.guard';
import { AuthLayoutComponent } from './shared/components/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/components/layout/main-layout/main-layout.component';

export const appRoutes: Routes = [
  // Rotas de autenticação com layout próprio
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
        path: '',
        redirectTo: '/dashboard',
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
