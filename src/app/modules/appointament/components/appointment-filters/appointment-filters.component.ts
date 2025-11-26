import { Component, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import {
  AppointmentFilters,
  AppointmentStatus,
  ApprovalStatus,
  ModalityType,
} from '../../interfaces/appointment.interface';
import { ProfessionalProfileService } from '../../../../core/professional-profiles/services/professional-profile.service';

/**
 * Componente de filtros para agendamentos.
 * Utiliza PrimeNG Sidebar e componentes de formulário.
 * Segue padrões: Standalone, Signals, DRY, SOLID.
 */
@Component({
  selector: 'app-appointment-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    ButtonModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    InputTextModule,
  ],
  templateUrl: './appointment-filters.component.html',
  styleUrl: './appointment-filters.component.scss',
})
export class AppointmentFiltersComponent {
  private readonly profileService = inject(ProfessionalProfileService);

  // Signals
  public visible = signal<boolean>(false);
  public terminology = this.profileService.terminology;

  // Outputs
  public filtersApplied = output<AppointmentFilters>();
  public filtersCleared = output<void>();

  // Form
  public filterForm = new FormGroup({
    search: new FormControl<string>(''),
    status: new FormControl<AppointmentStatus[]>([]),
    statusAprovacao: new FormControl<ApprovalStatus[]>([]),
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
    modality: new FormControl<ModalityType | null>(null),
    filter: new FormControl<'today' | 'week' | 'month' | null>(null),
  });

  // Options
  public statusOptions = [
    { label: 'Pendente', value: AppointmentStatus.PENDING },
    { label: 'Aprovado', value: AppointmentStatus.APPROVED },
    { label: 'Rejeitado', value: AppointmentStatus.REJECTED },
    { label: 'Concluído', value: AppointmentStatus.COMPLETED },
    { label: 'Cancelado', value: AppointmentStatus.CANCELLED },
    { label: 'Não Compareceu', value: AppointmentStatus.NO_SHOW },
  ];

  public approvalStatusOptions = [
    { label: 'Pendente', value: ApprovalStatus.PENDING },
    { label: 'Aprovado', value: ApprovalStatus.APPROVED },
    { label: 'Rejeitado', value: ApprovalStatus.REJECTED },
  ];

  public modalityOptions = [
    { label: 'Presencial', value: ModalityType.IN_PERSON },
    { label: 'Online', value: ModalityType.ONLINE },
    { label: 'Domicílio', value: ModalityType.HOME },
  ];

  public quickFilterOptions = [
    { label: 'Hoje', value: 'today' as const },
    { label: 'Esta Semana', value: 'week' as const },
    { label: 'Este Mês', value: 'month' as const },
  ];

  /**
   * Abre o sidebar de filtros
   */
  public open(): void {
    this.visible.set(true);
  }

  /**
   * Fecha o sidebar de filtros
   */
  public close(): void {
    this.visible.set(false);
  }

  /**
   * Aplica os filtros
   */
  public applyFilters(): void {
    const formValue = this.filterForm.value;
    const filters: AppointmentFilters = {
      search: formValue.search || undefined,
      status: formValue.status || undefined,
      statusAprovacao: formValue.statusAprovacao || undefined,
      dateFrom: formValue.dateFrom || undefined,
      dateTo: formValue.dateTo || undefined,
      modality: formValue.modality || undefined,
      filter: formValue.filter || undefined,
    };
    this.filtersApplied.emit(filters);
    this.close();
  }

  /**
   * Limpa todos os filtros
   */
  public clearFilters(): void {
    this.filterForm.reset();
    this.filtersCleared.emit();
    this.close();
  }

  /**
   * Aplica filtro rápido
   */
  public applyQuickFilter(filter: 'today' | 'week' | 'month'): void {
    this.filterForm.patchValue({ filter });
    this.applyFilters();
  }
}
