import { Routes } from '@angular/router';
import { UserRoles } from '../../shared/enums';
import { RoleGuard } from '../../shared/guards/role.guard';
import { DashboardListPage } from './pages';

export const DashboardRoutes: Routes = [
  {
    path: 'list',
    component: DashboardListPage,
    canActivate: [RoleGuard],
    data: {
      title: 'Dashboard - VOX',
      subtitle: 'Visão geral do sistema de agendamentos',
      roles: [UserRoles.USER, UserRoles.BARBER, UserRoles.ADMIN],
    },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
