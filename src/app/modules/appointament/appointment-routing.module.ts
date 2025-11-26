import { Routes } from '@angular/router';
import { UserRoles } from '../../shared/enums';
import { RoleGuard } from '../../shared/guards/role.guard';
import {
  AppointmentListComponent,
  AppointmentCalendarComponent,
  AppointmentCreateComponent,
  AppointmentEditComponent,
} from './pages';
import {
  AppointmentClientFormComponent,
  AppointmentDetailsFormComponent,
  AppointmentServicesFormComponent,
} from './components';
import { appointmentEditResolver } from './resolvers';

export const AppointmentRoutes: Routes = [
  {
    path: 'list',
    component: AppointmentListComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Lista de Agendamentos',
      subtitle: 'Gerenciamento de agendamentos dos profissionais cadastrados',
      roles: [UserRoles.BARBER, UserRoles.ADMIN],
    },
  },
  {
    path: 'calendar',
    component: AppointmentCalendarComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Calendário de Agendamentos',
      subtitle: 'Visualização em calendário dos agendamentos',
      roles: [UserRoles.BARBER, UserRoles.ADMIN],
    },
  },
  {
    path: 'create',
    component: AppointmentCreateComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Criar Agendamento',
      subtitle: 'Agendar novo serviço',
      roles: [UserRoles.BARBER, UserRoles.ADMIN],
    },
    children: [
      {
        path: 'client',
        component: AppointmentClientFormComponent,
      },
      {
        path: 'appointment',
        component: AppointmentDetailsFormComponent,
      },
      {
        path: 'services',
        component: AppointmentServicesFormComponent,
      },
      {
        path: '',
        redirectTo: 'client',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'edit/:id',
    component: AppointmentEditComponent,
    canActivate: [RoleGuard],
    data: {
      title: 'Editar Agendamento',
      subtitle: 'Alterar informações do agendamento',
      roles: [UserRoles.BARBER, UserRoles.ADMIN],
    },
    resolve: {
      appointments: appointmentEditResolver,
    },
    children: [
      {
        path: 'client',
        component: AppointmentClientFormComponent,
      },
      {
        path: 'appointment',
        component: AppointmentDetailsFormComponent,
      },
      {
        path: 'services',
        component: AppointmentServicesFormComponent,
      },
      {
        path: '',
        redirectTo: 'client',
        pathMatch: 'full',
      },
    ],
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
