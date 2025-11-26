import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Interface para trust badge
 */
export interface TrustBadge {
  icon: string;
  label: string;
  description: string;
}

/**
 * Componente de badges de confiança
 * Exibe selos de segurança e conformidade com animações
 */
@Component({
  selector: 'app-trust-badges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trust-badges.component.html',
  styleUrls: ['./trust-badges.component.scss'],
})
export class TrustBadgesComponent {
  public readonly badges: TrustBadge[] = [
    {
      icon: 'pi pi-shield',
      label: 'Dados Seguros',
      description: 'Criptografia de ponta a ponta',
    },
    {
      icon: 'pi pi-verified',
      label: 'Certificado SSL',
      description: 'Conexão 100% segura',
    },
    {
      icon: 'pi pi-lock',
      label: 'LGPD Compliant',
      description: 'Conformidade total com a lei',
    },
  ];
}
