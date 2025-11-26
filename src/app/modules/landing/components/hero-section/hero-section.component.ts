import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

/**
 * Interface para estatísticas do hero
 */
export interface HeroStat {
  value: string;
  label: string;
}

/**
 * Interface para cards visuais do hero
 */
export interface VisualCard {
  icon: string;
  label: string;
  position: number;
}

/**
 * Componente da seção hero da landing page
 * Apresenta título, descrição, CTAs e estatísticas
 */
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent {
  public stats = input.required<HeroStat[]>();
  public onRegisterClick = output<void>();
  public onLoginClick = output<void>();

  public readonly visualCards: VisualCard[] = [
    { icon: 'pi pi-calendar', label: 'Agendamento Inteligente', position: 1 },
    { icon: 'pi pi-chart-line', label: 'Analytics em Tempo Real', position: 2 },
    { icon: 'pi pi-users', label: 'Gestão de Clientes', position: 3 },
    { icon: 'pi pi-bell', label: 'Notificações Push', position: 4 },
    { icon: 'pi pi-mobile', label: 'App Mobile', position: 5 },
    { icon: 'pi pi-shield', label: 'Segurança Avançada', position: 6 },
    { icon: 'pi pi-dollar', label: 'Gestão Financeira', position: 7 },
    { icon: 'pi pi-clock', label: 'Controle de Horários', position: 8 },
  ];

  /**
   * Emite evento de clique no botão de registro
   */
  public handleRegisterClick(): void {
    this.onRegisterClick.emit();
  }

  /**
   * Emite evento de clique no botão de login
   */
  public handleLoginClick(): void {
    this.onLoginClick.emit();
  }
}
