import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { BaseResourceComponent } from '../../../../shared/components';
import { DashboardService } from '../../services/dashboard.service';
import { ProfessionalProfileService } from '../../../../core/professional-profiles';
import { StatCardComponent, QuickActionsComponent } from '../../components';

/**
 * Página principal do Dashboard.
 * Exibe estatísticas, gráficos e ações rápidas adaptadas ao perfil profissional.
 */
@Component({
  selector: 'app-dashboard-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    SkeletonModule,
    StatCardComponent,
    QuickActionsComponent,
  ],
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss'],
})
export class DashboardListPage extends BaseResourceComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly profileService = inject(ProfessionalProfileService);

  // Signals do service
  public readonly stats = this.dashboardService.stats;
  public override readonly isLoading = this.dashboardService.isLoading;
  public readonly error = this.dashboardService.error;
  public readonly quickActions = this.dashboardService.quickActions;

  // Computed signals para estatísticas individuais
  public readonly appointments = this.dashboardService.appointments;
  public readonly clients = this.dashboardService.clients;
  public readonly revenue = this.dashboardService.revenue;
  public readonly occupancy = this.dashboardService.occupancy;

  // Perfil profissional
  public readonly profile = this.profileService.currentProfile;
  public readonly branding = this.profileService.branding;
  public readonly terminology = this.profileService.terminology;

  // ID do profissional (mock - seria obtido do usuário logado)
  private readonly professionalId = 'current-user-id';

  constructor() {
    super();

    // Effect para reagir a mudanças no perfil
    effect(() => {
      const currentProfile = this.profile();
      if (currentProfile) {
        console.log('Perfil carregado:', currentProfile.type);
      }
    });
  }

  ngOnInit(): void {
    this.setBreadcrumb([{ label: 'Dashboard' }]);
    this.loadDashboardData();
  }

  /**
   * Carrega os dados do dashboard.
   */
  private loadDashboardData(): void {
    this.dashboardService.loadDashboardData(this.professionalId).subscribe({
      next: () => console.log('Dashboard carregado com sucesso'),
      error: (err) => console.error('Erro ao carregar dashboard:', err),
    });

    this.dashboardService.loadChartData(this.professionalId).subscribe({
      next: () => console.log('Gráficos carregados com sucesso'),
      error: (err) => console.error('Erro ao carregar gráficos:', err),
    });
  }

  /**
   * Força atualização dos dados.
   */
  public refresh(): void {
    this.dashboardService.refresh(this.professionalId);
  }

  /**
   * Retorna a cor primária do perfil ou cor padrão.
   */
  public getPrimaryColor(): string {
    return this.branding()?.primaryColor || '#1976D2';
  }

  /**
   * Retorna a cor secundária do perfil ou cor padrão.
   */
  public getSecondaryColor(): string {
    return this.branding()?.secondaryColor || '#FFC107';
  }

  /**
   * Formata valor monetário.
   */
  public formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  /**
   * Formata percentual.
   */
  public formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
  }
}
