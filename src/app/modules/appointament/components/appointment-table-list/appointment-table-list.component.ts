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
import { IAppointment } from '../../schema';
import { AppointmentService } from '../../services';

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
  selector: 'app-appointment-table-list',
  templateUrl: './appointment-table-list.component.html',
  styleUrls: ['./appointment-table-list.component.scss'],
  providers: [ConfirmationService],
})
export class AppointmentTableListComponent extends BaseResourceComponent {
  @Input() public dataSource: IAppointment[] = [];
  @Input() public displayedColumns: string[] = [];
  @Output() public deleteItem = new EventEmitter<string>();

  private appointmentService = inject(AppointmentService);
  private confirmationService = inject(ConfirmationService);
  public isLoadingDelete = false;

  public onEdit(id: string) {
    this.goTo([`/${AppRoutes.APPOINTMENTS}/${AppRoutes.EDIT}/${id}`]);
  }

  public onDelete(id: string) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir este agendamento?',
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.executeDelete(id);
      },
    });
  }

  private executeDelete(id: string) {
    this.isLoadingDelete = true;
    this.startLoading();

    this.appointmentService.delete(id).subscribe({
      next: () => {
        this.showSuccess('Agendamento removido com sucesso');
        this.deleteItem.emit(id);
      },
      error: (err: any) => {
        this.showError('Erro ao excluir agendamento', err?.message || '');
      },
      complete: () => {
        this.isLoadingDelete = false;
        this.stopLoading();
      },
    });
  }
}
