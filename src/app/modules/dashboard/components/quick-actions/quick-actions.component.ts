import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { QuickAction } from '../../interfaces';

/**
 * Componente de ações rápidas do dashboard.
 * Exibe botões para ações comuns do sistema.
 *
 * Features:
 * - Ações adaptadas ao perfil profissional
 * - Ícones e cores customizáveis
 * - Navegação rápida
 * - Layout responsivo
 */
@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss'],
})
export class QuickActionsComponent {
  @Input() public actions: QuickAction[] = [];
  @Input() public title = 'Ações Rápidas';

  constructor(private router: Router) {}

  /**
   * Executa a ação selecionada.
   */
  public onActionClick(action: QuickAction): void {
    if (!action.enabled) return;

    if (action.route) {
      this.router.navigate([action.route]);
    }
  }
}
