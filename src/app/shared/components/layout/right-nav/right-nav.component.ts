import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RightNavFooterComponent } from './components/right-nav-footer';
import { RightNavItemComponent } from './components/right-nav-item';
import { RightNavLogoComponent } from './components/right-nav-logo';
import { IRightNavItem } from './right-nav-item.interface';
import { RIGHT_NAV_ITEMS } from './right-nav-items.data';
import { RightNavStateService } from './services';

/**
 * Componente de menu lateral direito
 * Menu fino com logo no topo, itens no meio e botões de ação no rodapé
 */
@Component({
  selector: 'app-right-nav',
  standalone: true,
  imports: [
    CommonModule,
    RightNavLogoComponent,
    RightNavItemComponent,
    RightNavFooterComponent,
  ],
  templateUrl: './right-nav.component.html',
  styleUrls: ['./right-nav.component.scss'],
})
export class RightNavComponent {
  public menuItems = signal<IRightNavItem[]>(RIGHT_NAV_ITEMS);

  private rightNavStateService = inject(RightNavStateService);

  /**
   * Computed signal para verificar qual item está selecionado
   */
  public readonly selectedItemId = computed(
    () => this.rightNavStateService.selectedRightNavItem()?.id
  );

  /**
   * Manipula o clique em um item do menu
   * Usa o service para gerenciar o estado compartilhado
   *
   * @param item Item clicado
   */
  public handleItemClick(item: IRightNavItem): void {
    this.rightNavStateService.selectRightNavItem(item);
  }

  /**
   * Manipula o clique no botão de configurações
   */
  public handleSettingsClick(): void {
    console.log('Configurações clicado');
  }

  /**
   * Manipula o clique no botão de logout
   */
  public handleLogoutClick(): void {
    console.log('Logout clicado');
  }
}
