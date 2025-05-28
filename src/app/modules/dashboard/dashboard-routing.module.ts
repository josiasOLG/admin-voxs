import { Routes } from '@angular/router';
import { UserRoles } from '../../shared/enums';
import { RoleGuard } from '../../shared/guards/role.guard';
import { DashboardCreateComponent, DashboardListPage } from './pages';
import { DashboardEditComponent } from './pages/dashboard-edit/dashboard-edit.component';
import { dashboardEditResolver } from './resolvers';

export const DashboardRoutes: Routes = [
  {
    path: 'list',
    component: DashboardListPage,
    canActivate: [RoleGuard],
    data: {
      title: 'Lista de Veículos - Dashboard',
      subtitle: 'Gerencie os veículos do seu sistema',
      roles: [UserRoles.USER, UserRoles.BARBER, UserRoles.ADMIN], // Todos podem acessar o dashboard
    },
  },
  {
    path: 'create',
    component: DashboardCreateComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Criar Veículo - Dashboard',
      subtitle: 'Adicione um novo veículo ao sistema',
      roles: [UserRoles.BARBER, UserRoles.ADMIN], // Apenas barbeiros e admins podem criar
    },
  },
  {
    path: 'edit/:id',
    component: DashboardEditComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Editar Veículo - Dashboard',
      subtitle: 'Atualize as informações do veículo',
      roles: [UserRoles.BARBER, UserRoles.ADMIN], // Apenas barbeiros e admins podem editar
    },
    resolve: {
      dashboard: dashboardEditResolver,
    },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
