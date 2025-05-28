import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';

import { ApiResponse, AppRoutes } from '../../../../shared';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
  ValidateInputComponent,
} from '../../../../shared/components';
import { initVeiculoForm, IVeiculo } from '../../schema';
import { DashboardService } from '../../services';

@Component({
  standalone: true,
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    MessagesModule,
    SharedHeaderComponent,
    ValidateInputComponent,
  ],
})
export class DashboardEditComponent
  extends BaseResourceComponent
  implements OnInit
{
  public form = initVeiculoForm();
  private readonly dashboardService = inject(DashboardService);

  ngOnInit(): void {
    const vehicle = this.getRouteData<ApiResponse<IVeiculo>>('dashboard');
    this.setBreadcrumb([
      { label: 'Dashboard', url: `/${AppRoutes.DASHBOARD}` },
      { label: 'Editar Veículo' },
    ]);
    const data = vehicle?.data;
    if (data && !Array.isArray(data)) {
      this.form.patchValue(data);
    }
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.startLoading();
    const raw = this.form.getRawValue();

    const payload: Partial<IVeiculo> = {
      placa: raw.placa ?? undefined,
      chassi: raw.chassi ?? undefined,
      renavam: raw.renavam ?? undefined,
      modelo: raw.modelo ?? undefined,
      ano: raw.ano ?? undefined,
    };

    this.dashboardService.update(id, payload).subscribe({
      next: () => {
        this.showSuccess('Veículo atualizado com sucesso');
        this.goTo([AppRoutes.DASHBOARD]);
      },
      error: (err: any) => {
        this.showError('Erro ao atualizar veículo', err?.message || '');
      },
      complete: () => {
        this.stopLoading();
      },
    });
  }

  public back = () => {
    this.backViewlink(`/${AppRoutes.DASHBOARD}/${AppRoutes.LIST}`);
  };
}
