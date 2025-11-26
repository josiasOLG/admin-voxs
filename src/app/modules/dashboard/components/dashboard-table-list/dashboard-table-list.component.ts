import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutes } from '../../../../shared';
import {
  BaseResourceComponent,
  SharedSkeletonComponent,
} from '../../../../shared/components';
import { IVeiculo } from '../../schema';
import { VeiculoService } from '../../services/veiculo.service';

@Component({
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ConfirmDialogModule,
    TooltipModule,
    SharedSkeletonComponent,
  ],
  standalone: true,
  selector: 'app-dashboard-table-list',
  templateUrl: './dashboard-table-list.component.html',
  styleUrls: ['./dashboard-table-list.component.scss'],
  providers: [ConfirmationService],
})
export class DashboardTableListComponent extends BaseResourceComponent {
  @Input() public dataSource: IVeiculo[] = [];
  @Input() public displayedColumns: string[] = [];
  @Output() public deleteItem = new EventEmitter<string>();

  private veiculoService = inject(VeiculoService);
  private confirmationService = inject(ConfirmationService);
  public isLoadingDelete = false;

  public onEdit(id: string) {
    this.goTo([`/${AppRoutes.DASHBOARD}/${AppRoutes.EDIT}/${id}`]);
  }

  public onDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este veículo?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoadingDelete = true;
        this.veiculoService.delete(id).subscribe({
          next: () => {
            this.showSuccess('Veículo excluído com sucesso');
            this.deleteItem.emit(id);
          },
          error: (err: any) => {
            this.showError('Erro ao excluir veículo', err?.message || '');
          },
          complete: () => {
            this.isLoadingDelete = false;
          },
        });
      },
    });
  }
}
