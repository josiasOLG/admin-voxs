import { IRightNavItem } from './right-nav-item.interface';

/**
 * Itens do menu lateral direito
 */
export const RIGHT_NAV_ITEMS: IRightNavItem[] = [
  {
    id: 'notifications',
    icon: 'pi pi-bell',
    label: 'Notificações',
    action: () => console.log('Notificações clicado'),
  },
  {
    id: 'messages',
    icon: 'pi pi-envelope',
    label: 'Mensagens',
    action: () => console.log('Mensagens clicado'),
  },
  {
    id: 'tasks',
    icon: 'pi pi-check-square',
    label: 'Tarefas',
    action: () => console.log('Tarefas clicado'),
  },
  {
    id: 'calendar',
    icon: 'pi pi-calendar',
    label: 'Calendário',
    action: () => console.log('Calendário clicado'),
  },
];
