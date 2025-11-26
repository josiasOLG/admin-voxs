import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
} from '../../../../shared/components';
import {
  AppointmentTableListComponent,
  AppointmentFiltersComponent,
  AppointmentApprovalDialogComponent
} from '../../components';
import { IAppointment } from '../../schema';
import { AppointmentFilters, FormattedAppointment } from '../../interfaces/appointment.interface';
import { AppointmentService } from '../../services';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-appointment-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
    SharedHeaderComponent,
    AppointmentTableListComponent,
    AppointmentFiltersComponent,
    AppointmentApprovalDialogComponent,
  ],
  providers: [MessageService],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
})
export class AppointmentListComponent
  extends BaseResourceComponent
  implements OnInit
{
  private appointmentService = inject(AppointmentService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);

  // ViewChild para acessar o componente de filtros
  public filtersComponent = viewChild(AppointmentFiltersComponent);

  // Signals
  public filterCount = signal<number>(0);
  public selectedAppointment = signal<FormattedAppointment | null>(null);
  public approvalDialogVisible = signal<boolean>(false);
  public approvalMode = signal<'approve' | 'reject'>('approve');
  public approvalLoading = signal<boolean>(false);

  public displayedColumns = this.generateDisplayedColumns<any>(
    {
      id: '',
      userName: '',
      barberName: '',
      date: new Date(),
      time: '',
      status: 'pending' as const,
      statusAprovacao: 'pending' as const,
      modality: 'presencial' as const,
      service: [],
      notes: '',
      repete: 'never',
      allDay: false,
    },
    {
      exclude: [
        'id',
        'userName',
        'barberId',
        'role',
        'statusMensage',
        'statusPoint',
        'exceptions',
        'color',
        'modality',
      ],
      includeActions: true,
    }
  );
  public dataSource: IAppointment[] = [];
  public isDataLoading = true;
  private currentFilters: AppointmentFilters = {};

  ngOnInit(): void {
    this.setBreadcrumb([
      { label: 'Agendamentos' },
      { label: 'Listar Agendamentos' },
    ]);
    this.loadUserAppointments();
  }

  /**
   * Carrega agendamentos do usuário logado com filtros opcionais
   */
  private loadUserAppointments(filters?: AppointmentFilters): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não autenticado',
      });
      this.isDataLoading = false;
      return;
    }

    this.isDataLoading = true;

    // Se filtros foram fornecidos, usa getAll com userId como filtro adicional
    // Caso contrário, usa getByUser
    if (filters && Object.keys(filters).length > 0) {
      // Adiciona o userId aos filtros existentes
      const userFilters = { ...filters, userId: currentUser.id };

      this.appointmentService.getAll(userFilters).subscribe({
        next: (response: any) => {
          this.dataSource = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
          this.isDataLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching user appointments with filters:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar seus agendamentos',
          });
          this.isDataLoading = false;
        },
      });
    } else {
      // Sem filtros, carrega todos os agendamentos do usuário
      this.appointmentService.getByUser(currentUser.id).subscribe({
        next: (appointments: IAppointment[]) => {
          this.dataSource = appointments;
          this.isDataLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching user appointments:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar seus agendamentos',
          });
          this.isDataLoading = false;
        },
      });
    }
  }

  /**
   * Aplica filtro de busca rápida
   */
  public applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (value && value.trim()) {
      this.currentFilters = { ...this.currentFilters, search: value.trim() };
      this.loadUserAppointments(this.currentFilters);
    } else {
      delete this.currentFilters.search;
      this.loadUserAppointments(this.currentFilters);
    }
  }

  /**
   * Abre o sidebar de filtros
   */
  public openFilters(): void {
    this.filtersComponent()?.open();
  }

  /**
   * Handler quando filtros são aplicados
   */
  public onFiltersApplied(filters: AppointmentFilters): void {
    this.currentFilters = { ...filters };
    this.updateFilterCount();
    this.loadUserAppointments(this.currentFilters);
  }

  /**
   * Handler quando filtros são limpos
   */
  public onFiltersCleared(): void {
    this.currentFilters = {};
    this.filterCount.set(0);
    this.loadUserAppointments();
  }

  /**
   * Atualiza contador de filtros ativos
   */
  private updateFilterCount(): void {
    let count = 0;
    if (this.currentFilters.status && this.currentFilters.status.length > 0) count++;
    if (this.currentFilters.statusAprovacao && this.currentFilters.statusAprovacao.length > 0) count++;
    if (this.currentFilters.dateFrom) count++;
    if (this.currentFilters.dateTo) count++;
    if (this.currentFilters.modality) count++;
    if (this.currentFilters.filter) count++;
    this.filterCount.set(count);
  }

  /**
   * Handler para aprovar agendamento
   */
  public onApproveItem(appointment: FormattedAppointment): void {
    this.selectedAppointment.set(appointment);
    this.approvalMode.set('approve');
    this.approvalDialogVisible.set(true);
  }

  /**
   * Handler para rejeitar agendamento
   */
  public onRejectItem(appointment: FormattedAppointment): void {
    this.selectedAppointment.set(appointment);
    this.approvalMode.set('reject');
    this.approvalDialogVisible.set(true);
  }

  /**
   * Confirma aprovação
   */
  public confirmApprove(id: string): void {
    this.approvalLoading.set(true);
    this.appointmentService.approve(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Agendamento aprovado com sucesso',
        });
        this.closeApprovalDialog();
        this.loadUserAppointments(this.currentFilters);
      },
      error: (error: any) => {
        console.error('Error approving appointment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao aprovar agendamento',
        });
        this.approvalLoading.set(false);
      },
    });
  }

  /**
   * Confirma rejeição
   */
  public confirmReject(data: { id: string; reason: string }): void {
    this.approvalLoading.set(true);
    this.appointmentService.reject(data.id, { cancelReason: data.reason }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Agendamento rejeitado',
        });
        this.closeApprovalDialog();
        this.loadUserAppointments(this.currentFilters);
      },
      error: (error: any) => {
        console.error('Error rejecting appointment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao rejeitar agendamento',
        });
        this.approvalLoading.set(false);
      },
    });
  }

  /**
   * Fecha o diálogo de aprovação
   */
  public closeApprovalDialog(): void {
    this.approvalDialogVisible.set(false);
    this.approvalLoading.set(false);
    this.selectedAppointment.set(null);
  }

  public onDeleteItem(id: string): void {
    this.dataSource = this.dataSource.filter((item) => item.id !== id);
  }

  public goToCalendar(): void {
    this.goTo('/appointment/calendar');
  }

  public goToCreate(): void {
    this.goTo('/appointment/create');
  }
}
