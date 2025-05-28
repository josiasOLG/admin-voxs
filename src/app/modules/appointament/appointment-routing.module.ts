import { Routes } from '@angular/router';
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
    data: {
      title: 'Lista de Agendamentos',
      subtitle: 'Gerenciamento de agendamentos da barbearia',
    },
  },
  {
    path: 'create',
    component: AppointmentCreateComponent,
    data: {
      title: 'Criar Agendamento',
      subtitle: 'Agendar novo serviço',
    },
  },
  {
    path: 'edit/:id',
    component: AppointmentEditComponent,
    data: {
      title: 'Editar Agendamento',
      subtitle: 'Alterar informações do agendamento',
    },
    resolve: {
      appointments: appointmentEditResolver,
    },
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
];
