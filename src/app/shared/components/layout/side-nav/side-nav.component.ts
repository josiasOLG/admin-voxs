import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../modules/auth/services/auth.service';
import { IMenuItem, MENU_ITEMS } from './menu-itens';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  public menuItems: IMenuItem[] = [];
  private openDropdowns = new Set<IMenuItem>();
  private authService = inject(AuthService);
  private subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMenuItems();

    // Subscribe to user changes to update menu dynamically
    this.subscription.add(
      this.authService.currentUser$.subscribe(() => {
        this.loadMenuItems();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Carrega e filtra os itens do menu baseado nas roles do usuário
   */
  private loadMenuItems(): void {
    this.menuItems = this.filterMenuItemsByRole(MENU_ITEMS);
  }

  /**
   * Filtra os itens do menu baseado nas roles do usuário atual
   */
  private filterMenuItemsByRole(items: IMenuItem[]): IMenuItem[] {
    const currentUser = this.authService.getCurrentUser();

    return items.filter((item) => {
      // Se o item não tem roles definidas, sempre exibe (ex: seções)
      if (!item.roles || item.roles.length === 0) {
        return true;
      }

      // Se não há usuário logado, não exibe itens com roles
      if (!currentUser) {
        return false;
      }

      // Verifica se o usuário tem pelo menos uma das roles necessárias
      const hasRequiredRole = this.authService.hasAnyRole(item.roles);

      // Se tem filhos, filtra os filhos recursivamente
      if (item.children && item.children.length > 0) {
        item.children = this.filterMenuItemsByRole(item.children);
        // Se após filtrar não sobrou nenhum filho, não exibe o item pai
        return hasRequiredRole && item.children.length > 0;
      }

      return hasRequiredRole;
    });
  }

  /**
   * Verifica se o usuário tem permissão para ver um item específico
   */
  public canViewMenuItem(item: IMenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    return this.authService.hasAnyRole(item.roles);
  }

  handleClick(item: IMenuItem): void {
    if (item.link) {
      this.router.navigateByUrl(item.link);
    } else if (item.action) {
      item.action();
    } else if (item.children) {
      this.toggleDropdown(item);
    }
  }

  toggleDropdown(item: IMenuItem): void {
    if (this.openDropdowns.has(item)) {
      this.openDropdowns.delete(item);
    } else {
      this.openDropdowns.add(item);
    }
  }

  isDropdownOpen(item: IMenuItem): boolean {
    return this.openDropdowns.has(item);
  }
}
