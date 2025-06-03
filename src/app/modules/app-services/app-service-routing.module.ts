import { Routes } from '@angular/router';
import { AppRoutes } from '../../shared/constants/app.routes';
import { UserRoles } from '../../shared/enums';
import { RoleGuard } from '../../shared/guards/role.guard';

import { AppServiceCreateComponent } from './pages/app-service-create/app-service-create.component';
import { AppServiceEditComponent } from './pages/app-service-edit/app-service-edit.component';
import { AppServiceListComponent } from './pages/app-service-list/app-service-list.component';
import { appServiceEditResolver } from './resolvers/app-service-edit.resolver';

export const AppServiceRoutes: Routes = [
  {
    path: AppRoutes.LIST,
    component: AppServiceListComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Gerenciamento de App Services',
      subtitle: 'Lista de todos os serviços da aplicação',
      roles: [UserRoles.ADMIN],
    },
  },
  {
    path: AppRoutes.CREATE,
    component: AppServiceCreateComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Criar App Service',
      subtitle: 'Cadastrar novo serviço da aplicação',
      roles: [UserRoles.ADMIN], // Apenas admins podem criar app services
    },
  },
  {
    path: `${AppRoutes.EDIT}/:id`,
    component: AppServiceEditComponent,
    canActivate: [RoleGuard],
    resolve: {
      appService: appServiceEditResolver,
    },
    data: {
      title: 'Editar App Service',
      subtitle: 'Alterar informações do serviço',
      roles: [UserRoles.ADMIN], // Apenas admins podem editar app services
    },
  },
  {
    path: '',
    redirectTo: AppRoutes.LIST,
    pathMatch: 'full',
  },
];
