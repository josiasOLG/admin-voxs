import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../../../../constants/app.routes';
import { IMenuItem } from '../../side-nav/menu-itens';
import { IRightNavItem } from '../right-nav-item.interface';

/**
 * Interface para definir o conteúdo que será exibido no side-nav
 * quando um item do right-nav for selecionado
 */
export interface IRightNavContent {
  rightNavItemId: string;
  title: string;
  menuItems: IMenuItem[];
}

/**
 * Service para gerenciar o estado compartilhado entre right-nav e side-nav
 * Usa signals do Angular 19 para comunicação reativa
 */
@Injectable({
  providedIn: 'root',
})
export class RightNavStateService {
  private router = inject(Router);
  private _selectedRightNavItem = signal<IRightNavItem | null>({
    id: 'notifications',
    icon: 'pi pi-bell',
    label: 'Notificações',
  });
  private _isRightNavContentActive = signal<boolean>(true);

  /**
   * Item atualmente selecionado no right-nav
   */
  public readonly selectedRightNavItem =
    this._selectedRightNavItem.asReadonly();

  /**
   * Indica se o conteúdo do right-nav está ativo (exibindo no side-nav)
   */
  public readonly isRightNavContentActive =
    this._isRightNavContentActive.asReadonly();

  /**
   * Conteúdo computado baseado no item selecionado
   */
  public readonly currentContent = computed<IRightNavContent | null>(() => {
    const selectedItem = this._selectedRightNavItem();
    if (!selectedItem) return null;

    return this.getContentForItem(selectedItem);
  });

  /**
   * Seleciona um item do right-nav e ativa o conteúdo correspondente
   *
   * @param item Item do right-nav selecionado
   */
  public selectRightNavItem(item: IRightNavItem): void {
    const currentItem = this._selectedRightNavItem();

    // Toggle: se clicar no mesmo item, desseleciona
    if (currentItem?.id === item.id) {
      this._selectedRightNavItem.set(null);
      this._isRightNavContentActive.set(false);
    } else {
      this._selectedRightNavItem.set(item);
      this._isRightNavContentActive.set(true);
    }
  }

  /**
   * Limpa a seleção do right-nav
   */
  public clearSelection(): void {
    this._selectedRightNavItem.set(null);
    this._isRightNavContentActive.set(false);
  }

  /**
   * Retorna o conteúdo específico para cada item do right-nav
   * Aqui você define o que será exibido no side-nav para cada item
   *
   * @param item Item do right-nav
   * @returns Conteúdo para exibir no side-nav
   */
  private getContentForItem(item: IRightNavItem): IRightNavContent {
    const contentMap: Record<string, IRightNavContent> = {
      notifications: {
        rightNavItemId: 'notifications',
        title: 'Notificações',
        menuItems: [
          {
            section: 'Recentes',
          },
          {
            label: 'Nova mensagem de João',
            icon: 'pi pi-envelope',
            action: () => console.log('Notificação 1'),
          },
          {
            label: 'Agendamento confirmado',
            icon: 'pi pi-check-circle',
            action: () =>
              this.router.navigate([AppRoutes.APPOINTMENTS, AppRoutes.LIST]),
          },
          {
            label: 'Pagamento recebido',
            icon: 'pi pi-dollar',
            action: () => console.log('Notificação 3'),
          },
          {
            section: 'Anteriores',
          },
          {
            label: 'Sistema atualizado',
            icon: 'pi pi-sync',
            action: () => console.log('Notificação 4'),
          },
        ],
      },
      messages: {
        rightNavItemId: 'messages',
        title: 'Mensagens',
        menuItems: [
          {
            section: 'Conversas',
          },
          {
            label: 'Maria Silva',
            icon: 'pi pi-user',
            action: () => console.log('Mensagem 1'),
          },
          {
            label: 'Pedro Santos',
            icon: 'pi pi-user',
            action: () => console.log('Mensagem 2'),
          },
          {
            label: 'Ana Costa',
            icon: 'pi pi-user',
            action: () => console.log('Mensagem 3'),
          },
        ],
      },
      tasks: {
        rightNavItemId: 'tasks',
        title: 'Tarefas',
        menuItems: [
          {
            section: 'Hoje',
          },
          {
            label: 'Revisar agendamentos',
            icon: 'pi pi-calendar',
            action: () =>
              this.router.navigate([AppRoutes.APPOINTMENTS, AppRoutes.LIST]),
          },
          {
            label: 'Atualizar cadastros',
            icon: 'pi pi-pencil',
            action: () =>
              this.router.navigate([AppRoutes.USERS, AppRoutes.LIST]),
          },
          {
            section: 'Esta semana',
          },
          {
            label: 'Backup do sistema',
            icon: 'pi pi-database',
            action: () => console.log('Tarefa 3'),
          },
          {
            label: 'Relatório mensal',
            icon: 'pi pi-file',
            action: () => console.log('Tarefa 4'),
          },
        ],
      },
      calendar: {
        rightNavItemId: 'calendar',
        title: 'Calendário',
        menuItems: [
          {
            section: 'Eventos',
          },
          {
            label: 'Reunião de equipe',
            icon: 'pi pi-users',
            action: () => console.log('Evento 1'),
          },
          {
            label: 'Treinamento',
            icon: 'pi pi-book',
            action: () => console.log('Evento 2'),
          },
          {
            label: 'Apresentação',
            icon: 'pi pi-chart-bar',
            action: () => console.log('Evento 3'),
          },
        ],
      },
    };

    return (
      contentMap[item.id] || {
        rightNavItemId: item.id,
        title: item.label,
        menuItems: [],
      }
    );
  }
}
