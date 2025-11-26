import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../../../../modules/auth/services/auth.service';

/**
 * Componente de rodapé para o menu lateral direito
 */
@Component({
  selector: 'app-right-nav-footer',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    <div class="right-nav-footer">
      <button
        class="footer-button"
        (click)="handleSettings()"
        pTooltip="Configurações"
        tooltipPosition="left"
      >
        <i class="pi pi-cog"></i>
      </button>

      <button
        class="footer-button logout"
        (click)="handleLogout()"
        pTooltip="Sair"
        tooltipPosition="left"
      >
        <i class="pi pi-sign-out"></i>
      </button>
    </div>
  `,
  styleUrls: ['./right-nav-footer.component.scss'],
})
export class RightNavFooterComponent {
  public settingsClick = output<void>();
  public logoutClick = output<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Manipula o clique no botão de configurações
   */
  public handleSettings(): void {
    this.settingsClick.emit();
    console.log('Configurações clicado');
  }

  /**
   * Manipula o clique no botão de logout
   */
  public handleLogout(): void {
    this.logoutClick.emit();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
