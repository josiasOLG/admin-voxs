import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';

/**
 * Componente de card de estatística.
 * Widget reutilizável para exibir métricas do dashboard.
 *
 * Features:
 * - Suporte a ícones PrimeNG
 * - Cores temáticas
 * - Indicador de crescimento/queda
 * - Navegação opcional
 * - Responsive
 */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, SkeletonModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  @Input() public title = '';
  @Input() public value: string | number = 0;
  @Input() public icon = 'pi-chart-bar';
  @Input() public iconClass = '';
  @Input() public color = '#1976D2';
  @Input() public subtitle = '';
  @Input() public trend?: number; // Percentual de crescimento/queda
  @Input() public route?: string;
  @Input() public loading = false;
  @Input() public actionLabel = 'Ver detalhes';
  @Input() public actionIcon = 'arrow-right';

  // Computed properties
  public readonly trendText = computed(() => {
    const trend = this.trend;
    if (trend === undefined || trend === null) return '';

    const prefix = trend >= 0 ? '+' : '';
    return `${prefix}${trend.toFixed(1)}%`;
  });

  public readonly trendClass = computed(() => {
    const trend = this.trend;
    if (trend === undefined || trend === null) return '';

    return trend >= 0 ? 'trend-up' : 'trend-down';
  });

  public readonly trendIcon = computed(() => {
    const trend = this.trend;
    if (trend === undefined || trend === null) return '';

    return trend >= 0 ? 'pi-arrow-up' : 'pi-arrow-down';
  });

  constructor(private router: Router) {}

  /**
   * Navega para a rota especificada.
   */
  public onAction(): void {
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }

  /**
   * Formata valor numérico para exibição.
   */
  public get formattedValue(): string {
    if (typeof this.value === 'number') {
      return this.value.toLocaleString('pt-BR');
    }
    return String(this.value);
  }
}
