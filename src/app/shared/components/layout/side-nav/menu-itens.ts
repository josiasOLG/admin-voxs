import { AppRoutes } from '../../../constants';
import { UserRoles } from '../../../enums/user-roles.enum';

export interface IMenuItem {
  label?: string;
  icon?: string;
  link?: string;
  action?: () => void;
  section?: string;
  children?: IMenuItem[];
  roles?: UserRoles[]; // Roles necessárias para exibir o item
}

export const MENU_ITEMS: IMenuItem[] = [
  {
    section: 'Navegação',
  },
  {
    label: 'Home',
    icon: 'pi pi-home',
    link: `${AppRoutes.Home}/${AppRoutes.LIST}`,
    roles: [UserRoles.USER, UserRoles.BARBER, UserRoles.ADMIN], // Todos podem acessar home
  },
  {
    label: 'Agendamentos',
    icon: 'pi pi-calendar',
    link: `${AppRoutes.APPOINTMENTS}/${AppRoutes.LIST}`,
    roles: [UserRoles.BARBER, UserRoles.ADMIN], // Apenas barbeiros e admins podem ver agendamentos
  },
];
