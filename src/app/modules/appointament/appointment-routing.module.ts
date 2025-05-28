import { Routes } from '@angular/router';
import { UserRoles } from '../../shared/enums';
import { RoleGuard } from '../../shared/guards/role.guard';
import {
  AppointmentCreateComponent,
  AppointmentEditComponent,
  AppointmentListComponent,
} from './pages';
import { appointmentEditResolver } from './resolvers';

export const AppointmentRoutes: Routes = [
  {
    path: 'list',
    component: AppointmentListComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Lista de Agendamentos',
      subtitle: 'Gerenciamento de agendamentos dos profissionais cadastrados',
      roles: [UserRoles.BARBER, UserRoles.ADMIN], // Apenas barbeiros e admins podem ver agendamentos
    },
  },
  {
    path: 'create',
    component: AppointmentCreateComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Criar Agendamento',
      subtitle: 'Agendar novo serviço',
      roles: [UserRoles.BARBER, UserRoles.ADMIN], // Apenas barbeiros e admins podem criar agendamentos
    },
  },
  {
    path: 'edit/:id',
    component: AppointmentEditComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Editar Agendamento',
      subtitle: 'Alterar informações do agendamento',
      roles: [UserRoles.BARBER, UserRoles.ADMIN], // Apenas barbeiros e admins podem editar agendamentos
    },
    resolve: {
      appointments: appointmentEditResolver,
    },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
