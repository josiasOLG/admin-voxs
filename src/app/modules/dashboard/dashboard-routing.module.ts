import { Routes } from '@angular/router';
import { DashboardCreateComponent, DashboardListPage } from './pages';
import { DashboardEditComponent } from './pages/dashboard-edit/dashboard-edit.component';
import { dashboardEditResolver } from './resolvers';

export const DashboardRoutes: Routes = [
  {
    path: 'list',
    component: DashboardListPage,
    data: {
      title: 'Lista de Veículos - Dashboard',
      subtitle: 'Gerencie os veículos do seu sistema',
    },
  },
  {
    path: 'create',
    component: DashboardCreateComponent,
    data: {
      title: 'Criar Veículo - Dashboard',
      subtitle: 'Adicione um novo veículo ao sistema',
    },
  },
  {
    path: 'edit/:id',
    component: DashboardEditComponent,
    data: {
      title: 'Editar Veículo - Dashboard',
      subtitle: 'Atualize as informações do veículo',
    },
    resolve: {
      dashboard: dashboardEditResolver,
    },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
