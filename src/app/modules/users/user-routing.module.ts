import { Routes } from '@angular/router';
import { UserRoles } from '../../shared/enums';
import { RoleGuard } from '../../shared/guards/role.guard';
import {
  UserCreateComponent,
  UserEditComponent,
  UserListComponent,
} from './pages';
import { userEditResolver } from './resolvers/user-edit.resolver';

export const UserRoutes: Routes = [
  {
    path: 'list',
    component: UserListComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Gerenciamento de Usuários',
      subtitle: 'Lista de todos os usuários do sistema',
      roles: [UserRoles.ADMIN], // Apenas admins podem gerenciar usuários
    },
  },
  {
    path: 'create',
    component: UserCreateComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Criar Usuário',
      subtitle: 'Cadastrar novo usuário no sistema',
      roles: [UserRoles.ADMIN], // Apenas admins podem criar usuários
    },
  },
  {
    path: 'edit/:id',
    component: UserEditComponent,
    canActivate: [RoleGuard],
    resolve: {
      user: userEditResolver,
    },
    data: {
      title: 'Editar Usuário',
      subtitle: 'Alterar informações do usuário',
      roles: [UserRoles.ADMIN], // Apenas admins podem editar usuários
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
