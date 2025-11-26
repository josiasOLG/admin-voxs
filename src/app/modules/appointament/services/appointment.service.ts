import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CustomHttpClient } from '../../../shared/http/custom-http-client.service';
import { CreateAppointmentSchema, IAppointment } from '../schema/create-appointment.schema';
import { ApiResponse } from '../../../shared';
import { ProfessionalProfileService } from '../../../core/professional-profiles/services/professional-profile.service';
import {
  Appointment,
  AppointmentFilters,
  AppointmentPayload,
  FormattedAppointment,
  ApproveAppointmentResponse,
  RejectAppointmentPayload,
  CheckExistingResponse,
  AppointmentStatus,
  ApprovalStatus,
} from '../interfaces/appointment.interface';

const AppointmentArraySchema = CreateAppointmentSchema.array();

/**
 * Serviço completo para gerenciamento de agendamentos.
 * Segue padrões: SOLID, DRY, KISS, Clean Code.
 * Utiliza Angular Signals para reatividade.
 */
@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(CustomHttpClient);
  private readonly profileService = inject(ProfessionalProfileService);

  // Signals para estado reativo
  private appointmentsSignal = signal<FormattedAppointment[]>([]);
  private loadingSignal = signal<boolean>(false);
  private selectedAppointmentSignal = signal<FormattedAppointment | null>(null);

  // Computed values
  public readonly appointments = this.appointmentsSignal.asReadonly();
  public readonly loading = this.loadingSignal.asReadonly();
  public readonly selectedAppointment = this.selectedAppointmentSignal.asReadonly();

  public readonly terminology = computed(() => {
    return this.profileService.terminology();
  });

  private readonly Api = {
    base: '',
    byId: (id: string) => `/${id}`,
    approve: (id: string) => `/${id}/approve`,
    reject: (id: string) => `/${id}/reject`,
    byBarber: (barberId: string) => `/barber/${barberId}`,
    byUser: (userId: string) => `/user/${userId}`,
    checkExisting: '/check-existing',
    calendar: (barberId: string) => `/calendar/${barberId}`,
    search: '/search',
  };

  private client: ReturnType<CustomHttpClient['createDomainClient']>;

  constructor() {
    this.client = this.http.createDomainClient('appointments');
  }

  /**
   * Busca todos os agendamentos com paginação e filtros
   */
  public getAll(filters?: AppointmentFilters): Observable<ApiResponse<FormattedAppointment>> {
    this.loadingSignal.set(true);

    const params: Record<string, any> = {};
    if (filters?.page) params['page'] = filters.page;
    if (filters?.limit) params['limit'] = filters.limit;
    if (filters?.search) params['search'] = filters.search;
    if (filters?.status) params['status'] = filters.status.join(',');
    if (filters?.statusAprovacao) params['statusAprovacao'] = filters.statusAprovacao.join(',');
    if (filters?.dateFrom) params['dateFrom'] = filters.dateFrom;
    if (filters?.dateTo) params['dateTo'] = filters.dateTo;
    if (filters?.modality) params['modality'] = filters.modality;
    if (filters?.serviceId) params['serviceId'] = filters.serviceId;
    if (filters?.sortBy) params['sortBy'] = filters.sortBy;
    if (filters?.sortOrder) params['sortOrder'] = filters.sortOrder;

    return this.client.get<ApiResponse<FormattedAppointment>>(this.Api.base, { params }).pipe(
      tap((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        this.appointmentsSignal.set(data);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Busca agendamento por ID
   */
  public getById(id: string): Observable<IAppointment> {
    this.loadingSignal.set(true);
    return this.client.get<IAppointment>(this.Api.byId(id), {
      schema: CreateAppointmentSchema,
    }).pipe(
      tap((appointment) => {
        this.selectedAppointmentSignal.set(appointment as FormattedAppointment);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Busca agendamentos por profissional com filtros
   */
  public getByBarber(barberId: string, filters?: AppointmentFilters): Observable<IAppointment[]> {
    this.loadingSignal.set(true);

    const params: Record<string, any> = {};
    if (filters?.filter) params['filter'] = filters.filter; // today, week, month
    if (filters?.dateFrom) params['startDate'] = filters.dateFrom;
    if (filters?.dateTo) params['endDate'] = filters.dateTo;
    if (filters?.status) params['status'] = filters.status.join(',');

    return this.client.get<IAppointment[]>(this.Api.byBarber(barberId), {
      params,
      schema: AppointmentArraySchema,
    }).pipe(
      tap((appointments) => {
        this.appointmentsSignal.set(appointments as FormattedAppointment[]);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Busca agendamentos por usuário
   */
  public getByUser(userId: string): Observable<IAppointment[]> {
    this.loadingSignal.set(true);
    return this.client.get<IAppointment[]>(this.Api.byUser(userId), {
      schema: AppointmentArraySchema,
    }).pipe(
      tap((appointments) => {
        this.appointmentsSignal.set(appointments as FormattedAppointment[]);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Busca agendamentos para o calendário
   */
  public getCalendarAppointments(
    barberId: string,
    startDate?: Date | string,
    endDate?: Date | string,
    filter?: 'today' | 'week' | 'month'
  ): Observable<IAppointment[]> {
    const params: Record<string, any> = {};
    if (startDate) params['startDate'] = startDate;
    if (endDate) params['endDate'] = endDate;
    if (filter) params['filter'] = filter;

    return this.client.get<IAppointment[]>(this.Api.calendar(barberId), { params });
  }

  /**
   * Busca por userId (compatibilidade com código antigo)
   */
  public searchByUserId(userId: string): Observable<IAppointment[]> {
    return this.getByUser(userId);
  }

  /**
   * Cria novo agendamento
   */
  public create(data: AppointmentPayload): Observable<IAppointment> {
    this.loadingSignal.set(true);
    return this.client.post<IAppointment>(this.Api.base, data, {
      schema: CreateAppointmentSchema,
    }).pipe(
      tap(() => this.loadingSignal.set(false))
    );
  }

  /**
   * Atualiza agendamento
   */
  public update(id: string, data: Partial<AppointmentPayload>): Observable<IAppointment> {
    this.loadingSignal.set(true);
    return this.client.put<IAppointment>(this.Api.byId(id), data, {
      schema: CreateAppointmentSchema,
    }).pipe(
      tap((updated) => {
        this.selectedAppointmentSignal.set(updated as FormattedAppointment);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Aprova agendamento
   */
  public approve(id: string): Observable<ApproveAppointmentResponse> {
    this.loadingSignal.set(true);
    return this.client.put<ApproveAppointmentResponse>(this.Api.approve(id), {}).pipe(
      tap(() => this.loadingSignal.set(false))
    );
  }

  /**
   * Rejeita agendamento com motivo
   */
  public reject(id: string, payload: RejectAppointmentPayload): Observable<IAppointment> {
    this.loadingSignal.set(true);
    return this.client.put<IAppointment>(this.Api.reject(id), payload).pipe(
      tap((rejected) => {
        this.selectedAppointmentSignal.set(rejected as FormattedAppointment);
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Verifica se existe conflito de horário
   */
  public checkExisting(
    barberId: string,
    date: Date | string,
    time: string
  ): Observable<CheckExistingResponse> {
    return this.client.post<CheckExistingResponse>(this.Api.checkExisting, {
      barberId,
      date,
      time,
    });
  }

  /**
   * Deleta agendamento (soft delete)
   */
  public delete(id: string): Observable<void> {
    this.loadingSignal.set(true);
    return this.client.delete<void>(this.Api.byId(id)).pipe(
      tap(() => {
        // Remove do signal
        const current = this.appointmentsSignal();
        this.appointmentsSignal.set(current.filter(a => a.id !== id));
        this.loadingSignal.set(false);
      })
    );
  }

  /**
   * Limpa agendamento selecionado
   */
  public clearSelected(): void {
    this.selectedAppointmentSignal.set(null);
  }

  /**
   * Obtém cor de status para badges/tags
   */
  public getStatusColor(status?: AppointmentStatus): string {
    const colors: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'warning',
      [AppointmentStatus.APPROVED]: 'success',
      [AppointmentStatus.REJECTED]: 'danger',
      [AppointmentStatus.COMPLETED]: 'info',
      [AppointmentStatus.CANCELLED]: 'secondary',
      [AppointmentStatus.NO_SHOW]: 'danger',
    };
    return status ? colors[status] : 'secondary';
  }

  /**
   * Obtém cor de status de aprovação
   */
  public getApprovalStatusColor(status?: ApprovalStatus): string {
    const colors: Record<ApprovalStatus, string> = {
      [ApprovalStatus.PENDING]: 'warning',
      [ApprovalStatus.APPROVED]: 'success',
      [ApprovalStatus.REJECTED]: 'danger',
    };
    return status ? colors[status] : 'secondary';
  }

  /**
   * Formata status para exibição com terminologia adaptada
   */
  public formatStatus(status?: AppointmentStatus): string {
    const terms = this.terminology();
    const translations: Record<AppointmentStatus, string> = {
      [AppointmentStatus.PENDING]: 'Pendente',
      [AppointmentStatus.APPROVED]: 'Aprovado',
      [AppointmentStatus.REJECTED]: 'Rejeitado',
      [AppointmentStatus.COMPLETED]: 'Concluído',
      [AppointmentStatus.CANCELLED]: 'Cancelado',
      [AppointmentStatus.NO_SHOW]: 'Não Compareceu',
    };
    return status ? translations[status] : 'Desconhecido';
  }
}
