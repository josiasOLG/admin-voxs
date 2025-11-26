import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { AppRoutes } from '../../../../shared';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
  ValidateInputComponent,
} from '../../../../shared/components';
import { initVeiculoForm } from '../../schema';
import { VeiculoService } from '../../services/veiculo.service';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    MessagesModule,
    ValidateInputComponent,
    SharedHeaderComponent,
  ],
  standalone: true,
  selector: 'app-dashboard-create',
  templateUrl: './dashboard-create.component.html',
  styleUrls: ['./dashboard-create.component.scss'],
})
export class DashboardCreateComponent
  extends BaseResourceComponent
  implements OnInit
{
  public form = initVeiculoForm();
  private readonly veiculoService = inject(VeiculoService);

  ngOnInit(): void {
    this.setBreadcrumb([
      { label: 'Dashboard', url: `/${AppRoutes.DASHBOARD}` },
      { label: 'Criar Veículo' },
    ]);
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.startLoading();
    const raw = this.form.getRawValue();
    const payload = {
      placa: raw.placa ?? '',
      chassi: raw.chassi ?? '',
      renavam: raw.renavam ?? '',
      modelo: raw.modelo ?? '',
      ano: raw.ano ?? '',
    };
    this.veiculoService.create(payload).subscribe({
      next: (createdVehicle: any) => {
        this.showSuccess('Veículo criado com sucesso');
        this.goTo([AppRoutes.DASHBOARD]);
      },
      error: (err: any) => {
        this.showError('Erro ao criar veículo', err?.message || '');
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
