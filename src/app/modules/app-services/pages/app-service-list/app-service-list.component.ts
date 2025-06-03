import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
} from '../../../../shared/components';
import { AppRoutes } from '../../../../shared/constants/app.routes';
import { AppService } from '../../interfaces/app-service.interface';
import { AppServiceService } from '../../services/app-service.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    ToolbarModule,
    TooltipModule,
    SharedHeaderComponent,
  ],
  templateUrl: './app-service-list.component.html',
  styleUrls: ['./app-service-list.component.scss'],
})
export class AppServiceListComponent
  extends BaseResourceComponent
  implements OnInit
{
  readonly appServices = signal<AppService[]>([]);

  constructor(private readonly appServiceService: AppServiceService) {
    super();
  }

  public ngOnInit(): void {
    this.setTitle('App Services', 'Gerenciamento de serviços da aplicação');
    this.setBreadcrumb([
      { label: 'Dashboard', url: AppRoutes.DASHBOARD },
      { label: 'App Services' },
    ]);
    this.loadAppServices();
  }

  /**
   * Carrega a lista de app services.
   */
  private loadAppServices(): void {
    this.startLoading();

    this.appServiceService.findAll().subscribe({
      next: (response) => {
        this.appServices.set(response);
        this.stopLoading();
      },
      error: (error) => {
        this.showError('Erro ao carregar app services', error.message);
        this.stopLoading();
      },
    });
  }

  /**
   * Navega para a página de criação de app service.
   */
  public goToCreate(): void {
    this.goTo([AppRoutes.APP_SERVICES, AppRoutes.CREATE]);
  }

  /**
   * Navega para a página de edição de app service.
   *
   * @param id ID do app service.
   */
  public goToEdit(id: string): void {
    this.goTo([AppRoutes.APP_SERVICES, AppRoutes.EDIT, id]);
  }

  /**
   * Retorna a severidade da tag do status.
   *
   * @param active Status do app service.
   * @returns Severidade da tag.
   */
  public getStatusSeverity(active: boolean): string {
    return active ? 'success' : 'danger';
  }

  /**
   * Retorna o label do status.
   *
   * @param active Status do app service.
   * @returns Label formatado.
   */
  public getStatusLabel(active: boolean): string {
    return active ? 'Ativo' : 'Inativo';
  }

  /**
   * Formata o preço para exibição.
   *
   * @param price Preço do serviço.
   * @returns Preço formatado ou N/A.
   */
  public formatPrice(price?: number): string {
    return price ? `R$ ${price.toFixed(2)}` : 'N/A';
  }

  /**
   * Formata a duração para exibição.
   *
   * @param duration Duração em minutos.
   * @returns Duração formatada ou N/A.
   */
  public formatDuration(duration?: number): string {
    if (!duration) return 'N/A';

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }

    return `${minutes}min`;
  }
}
