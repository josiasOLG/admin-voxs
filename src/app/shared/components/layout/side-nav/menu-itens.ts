import { AppRoutes } from '../../../constants';

export interface IMenuItem {
  label?: string;
  icon?: string;
  link?: string;
  action?: () => void;
  section?: string;
  children?: IMenuItem[];
}

export const MENU_ITEMS: IMenuItem[] = [
  {
    section: 'Sistema',
  },
  {
    label: 'Dashboard',
    icon: 'dashboard',
    link: `${AppRoutes.DASHBOARD}/${AppRoutes.LIST}`,
  },
  {
    label: 'Agendamentos',
    icon: 'event',
    link: `${AppRoutes.APPOINTMENTS}/${AppRoutes.LIST}`,
  },
];
