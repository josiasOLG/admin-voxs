import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TrustBadgesComponent } from '../trust-badges/trust-badges.component';

/**
 * Interface para benefício
 */
export interface Benefit {
  icon: string;
  text: string;
}

/**
 * Componente da seção CTA (Call To Action)
 * Exibe chamada para ação com benefícios e trust badges
 */
@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, ButtonModule, TrustBadgesComponent],
  templateUrl: './cta-section.component.html',
  styleUrls: ['./cta-section.component.scss'],
})
export class CtaSectionComponent {
  public onRegisterClick = output<void>();
  public onLoginClick = output<void>();

  public readonly benefits: Benefit[] = [
    { icon: 'pi pi-check-circle', text: 'Sem cartão de crédito' },
    { icon: 'pi pi-check-circle', text: 'Configuração em 5 minutos' },
    { icon: 'pi pi-check-circle', text: 'Suporte 24/7' },
    { icon: 'pi pi-check-circle', text: 'Cancele quando quiser' },
  ];

  /**
   * Emite evento de clique no botão de registro
   */
  public handleRegisterClick(): void {
    this.onRegisterClick.emit();
  }

  /**
   * Emite evento de clique no botão de demo
   */
  public handleDemoClick(): void {
    this.onLoginClick.emit();
  }
}
