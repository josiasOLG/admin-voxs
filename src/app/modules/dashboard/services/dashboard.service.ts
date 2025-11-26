import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';

import {
  DashboardStats,
  DashboardChartData,
  DashboardFilters,
  QuickAction,
  AppointmentStats,
  ClientStats,
  RevenueStats,
  OccupancyStats,
} from '../interfaces';
import { ProfessionalProfileService } from '../../../core/professional-profiles';
import { environment } from '../../../environments/environment';

/**
 * Service para gerenciamento do dashboard.
 * Fornece dados estatísticos, gráficos e métricas do negócio.
 *
 * Features:
 * - Estatísticas em tempo real com signals
 * - Dados de gráficos adaptados ao profissional
 * - Cache inteligente de dados
 * - Auto-refresh configurável
 * - Filtros avançados
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly profileService = inject(ProfessionalProfileService);

  private readonly apiUrl = `${environment.apiUrl}`;

  // Signals reativos
  private readonly statsSignal = signal<DashboardStats | null>(null);
  private readonly chartDataSignal = signal<DashboardChartData | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly filtersSignal = signal<DashboardFilters>(this.getDefaultFilters());

  // Computed signals
  public readonly stats = this.statsSignal.asReadonly();
  public readonly chartData = this.chartDataSignal.asReadonly();
  public readonly isLoading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();
  public readonly filters = this.filtersSignal.asReadonly();

  // Computed properties
  public readonly appointments = computed(() => this.stats()?.appointments);
  public readonly clients = computed(() => this.stats()?.clients);
  public readonly revenue = computed(() => this.stats()?.revenue);
  public readonly occupancy = computed(() => this.stats()?.occupancy);

  // Quick Actions adaptadas ao perfil
  public readonly quickActions = computed(() => this.getQuickActions());

  // Cache de dados
  private statsCache$?: Observable<DashboardStats>;
  private chartCache$?: Observable<DashboardChartData>;

  /**
   * Carrega todas as estatísticas do dashboard.
   * @param professionalId ID do profissional
   * @param filters Filtros opcionais
   */
  public loadDashboardData(professionalId: string, filters?: Partial<DashboardFilters>): Observable<DashboardStats> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    if (filters) {
      this.updateFilters(filters);
    }

    const currentFilters = this.filtersSignal();

    // Buscar dados em paralelo
    this.statsCache$ = forkJoin({
      appointments: this.fetchAppointmentStats(professionalId, currentFilters),
      clients: this.fetchClientStats(professionalId, currentFilters),
      revenue: this.fetchRevenueStats(professionalId, currentFilters),
      occupancy: this.fetchOccupancyStats(professionalId, currentFilters),
    }).pipe(
      map(data => ({
        appointments: data.appointments,
        clients: data.clients,
        revenue: data.revenue,
        occupancy: data.occupancy,
        period: {
          start: currentFilters.dateRange.start,
          end: currentFilters.dateRange.end,
        },
      })),
      tap(stats => {
        this.statsSignal.set(stats);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao carregar dados do dashboard');
        this.loadingSignal.set(false);
        throw error;
      }),
      shareReplay(1)
    );

    return this.statsCache$;
  }

  /**
   * Carrega dados para gráficos.
   * @param professionalId ID do profissional
   */
  public loadChartData(professionalId: string): Observable<DashboardChartData> {
    const currentFilters = this.filtersSignal();

    this.chartCache$ = forkJoin({
      appointmentsByDay: this.fetchAppointmentsByDay(professionalId, currentFilters),
      revenueByDay: this.fetchRevenueByDay(professionalId, currentFilters),
      topServices: this.fetchTopServices(professionalId, currentFilters),
      peakHours: this.fetchPeakHours(professionalId, currentFilters),
      appointmentsByStatus: this.fetchAppointmentsByStatus(professionalId, currentFilters),
    }).pipe(
      tap(chartData => {
        this.chartDataSignal.set(chartData);
      }),
      catchError(error => {
        console.error('Erro ao carregar dados de gráficos:', error);
        return of({
          appointmentsByDay: [],
          revenueByDay: [],
          topServices: [],
          peakHours: [],
          appointmentsByStatus: [],
        });
      }),
      shareReplay(1)
    );

    return this.chartCache$;
  }

  /**
   * Busca estatísticas de agendamentos.
   */
  private fetchAppointmentStats(
    professionalId: string,
    filters: DashboardFilters
  ): Observable<AppointmentStats> {
    const params = this.buildHttpParams(filters);

    return this.http
      .get<any>(`${this.apiUrl}/appointments/stats/${professionalId}`, { params })
      .pipe(
        map(response => ({
          today: response.today || 0,
          thisWeek: response.thisWeek || 0,
          thisMonth: response.thisMonth || 0,
          pending: response.pending || 0,
          confirmed: response.confirmed || 0,
          cancelled: response.cancelled || 0,
          next: response.next,
          attendanceRate: response.attendanceRate || 0,
          cancellationRate: response.cancellationRate || 0,
        })),
        catchError(() => of(this.getEmptyAppointmentStats()))
      );
  }

  /**
   * Busca estatísticas de clientes.
   */
  private fetchClientStats(
    professionalId: string,
    filters: DashboardFilters
  ): Observable<ClientStats> {
    const params = this.buildHttpParams(filters);

    return this.http
      .get<any>(`${this.apiUrl}/users/clients/stats/${professionalId}`, { params })
      .pipe(
        map(response => ({
          total: response.total || 0,
          newThisMonth: response.newThisMonth || 0,
          recurring: response.recurring || 0,
          inactive: response.inactive || 0,
          retentionRate: response.retentionRate || 0,
        })),
        catchError(() => of(this.getEmptyClientStats()))
      );
  }

  /**
   * Busca estatísticas de receita.
   */
  private fetchRevenueStats(
    professionalId: string,
    filters: DashboardFilters
  ): Observable<RevenueStats> {
    const params = this.buildHttpParams(filters);

    return this.http
      .get<any>(`${this.apiUrl}/appointments/revenue/${professionalId}`, { params })
      .pipe(
        map(response => ({
          today: response.today || 0,
          thisWeek: response.thisWeek || 0,
          thisMonth: response.thisMonth || 0,
          estimated: response.estimated || 0,
          averageTicket: response.averageTicket || 0,
          growthRate: response.growthRate || 0,
        })),
        catchError(() => of(this.getEmptyRevenueStats()))
      );
  }

  /**
   * Busca estatísticas de ocupação.
   */
  private fetchOccupancyStats(
    professionalId: string,
    filters: DashboardFilters
  ): Observable<OccupancyStats> {
    const params = this.buildHttpParams(filters);

    return this.http
      .get<any>(`${this.apiUrl}/appointments/occupancy/${professionalId}`, { params })
      .pipe(
        map(response => ({
          today: response.today || 0,
          thisWeek: response.thisWeek || 0,
          thisMonth: response.thisMonth || 0,
          availableSlotsToday: response.availableSlotsToday || 0,
          totalSlotsToday: response.totalSlotsToday || 0,
        })),
        catchError(() => of(this.getEmptyOccupancyStats()))
      );
  }

  /**
   * Busca agendamentos por dia.
   */
  private fetchAppointmentsByDay(professionalId: string, filters: DashboardFilters): Observable<any[]> {
    const params = this.buildHttpParams(filters);
    return this.http
      .get<any[]>(`${this.apiUrl}/appointments/by-day/${professionalId}`, { params })
      .pipe(catchError(() => of([])));
  }

  /**
   * Busca receita por dia.
   */
  private fetchRevenueByDay(professionalId: string, filters: DashboardFilters): Observable<any[]> {
    const params = this.buildHttpParams(filters);
    return this.http
      .get<any[]>(`${this.apiUrl}/appointments/revenue-by-day/${professionalId}`, { params })
      .pipe(catchError(() => of([])));
  }

  /**
   * Busca serviços mais populares.
   */
  private fetchTopServices(professionalId: string, filters: DashboardFilters): Observable<any[]> {
    const params = this.buildHttpParams(filters);
    return this.http
      .get<any[]>(`${this.apiUrl}/appointments/top-services/${professionalId}`, { params })
      .pipe(catchError(() => of([])));
  }

  /**
   * Busca horários de pico.
   */
  private fetchPeakHours(professionalId: string, filters: DashboardFilters): Observable<any[]> {
    const params = this.buildHttpParams(filters);
    return this.http
      .get<any[]>(`${this.apiUrl}/appointments/peak-hours/${professionalId}`, { params })
      .pipe(catchError(() => of([])));
  }

  /**
   * Busca distribuição por status.
   */
  private fetchAppointmentsByStatus(professionalId: string, filters: DashboardFilters): Observable<any[]> {
    const params = this.buildHttpParams(filters);
    return this.http
      .get<any[]>(`${this.apiUrl}/appointments/by-status/${professionalId}`, { params })
      .pipe(catchError(() => of([])));
  }

  /**
   * Atualiza os filtros do dashboard.
   */
  public updateFilters(filters: Partial<DashboardFilters>): void {
    const currentFilters = this.filtersSignal();
    this.filtersSignal.set({ ...currentFilters, ...filters });
  }

  /**
   * Reseta os filtros para valores padrão.
   */
  public resetFilters(): void {
    this.filtersSignal.set(this.getDefaultFilters());
  }

  /**
   * Força atualização dos dados (bypass cache).
   */
  public refresh(professionalId: string): void {
    this.statsCache$ = undefined;
    this.chartCache$ = undefined;
    this.loadDashboardData(professionalId).subscribe();
    this.loadChartData(professionalId).subscribe();
  }

  /**
   * Retorna ações rápidas baseadas no perfil profissional.
   */
  private getQuickActions(): QuickAction[] {
    const profile = this.profileService.currentProfile();
    if (!profile) {
      return this.getDefaultQuickActions();
    }

    const terminology = profile.terminology;
    const enabledModules = profile.modules.filter(m => m.enabled);

    const actions: QuickAction[] = [];

    // Ação: Novo Agendamento
    if (enabledModules.some(m => m.moduleId === 'appointments')) {
      actions.push({
        id: 'new-appointment',
        label: `Novo ${terminology.appointment.singular}`,
        icon: 'pi-calendar-plus',
        route: '/appointments/create',
        color: profile.branding.primaryColor,
        enabled: true,
      });
    }

    // Ação: Novo Cliente
    if (enabledModules.some(m => m.moduleId === 'clients')) {
      actions.push({
        id: 'new-client',
        label: `Novo ${terminology.client.singular}`,
        icon: 'pi-user-plus',
        route: '/clients/create',
        color: profile.branding.secondaryColor,
        enabled: true,
      });
    }

    // Ação: Calendário
    if (enabledModules.some(m => m.moduleId === 'calendar')) {
      actions.push({
        id: 'view-calendar',
        label: 'Ver Calendário',
        icon: 'pi-calendar',
        route: '/calendar',
        color: '#4CAF50',
        enabled: true,
      });
    }

    // Ação: Serviços
    if (enabledModules.some(m => m.moduleId === 'services')) {
      actions.push({
        id: 'manage-services',
        label: `Gerenciar ${terminology.service.plural}`,
        icon: 'pi-briefcase',
        route: '/services',
        color: '#FF9800',
        enabled: true,
      });
    }

    return actions;
  }

  /**
   * Retorna ações rápidas padrão.
   */
  private getDefaultQuickActions(): QuickAction[] {
    return [
      {
        id: 'new-appointment',
        label: 'Novo Agendamento',
        icon: 'pi-calendar-plus',
        route: '/appointments/create',
        color: '#1976D2',
        enabled: true,
      },
      {
        id: 'new-client',
        label: 'Novo Cliente',
        icon: 'pi-user-plus',
        route: '/clients/create',
        color: '#FFC107',
        enabled: true,
      },
    ];
  }

  /**
   * Constrói HttpParams a partir dos filtros.
   */
  private buildHttpParams(filters: DashboardFilters): HttpParams {
    let params = new HttpParams();

    if (filters.dateRange) {
      params = params
        .set('startDate', filters.dateRange.start.toISOString())
        .set('endDate', filters.dateRange.end.toISOString());
    }

    if (filters.serviceIds && filters.serviceIds.length > 0) {
      params = params.set('serviceIds', filters.serviceIds.join(','));
    }

    if (filters.status && filters.status.length > 0) {
      params = params.set('status', filters.status.join(','));
    }

    return params;
  }

  /**
   * Retorna filtros padrão.
   */
  private getDefaultFilters(): DashboardFilters {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      dateRange: {
        start: firstDayOfMonth,
        end: lastDayOfMonth,
        preset: 'month',
      },
    };
  }

  // Métodos auxiliares para dados vazios
  private getEmptyAppointmentStats(): AppointmentStats {
    return { today: 0, thisWeek: 0, thisMonth: 0, pending: 0, confirmed: 0, cancelled: 0 };
  }

  private getEmptyClientStats(): ClientStats {
    return { total: 0, newThisMonth: 0, recurring: 0, inactive: 0 };
  }

  private getEmptyRevenueStats(): RevenueStats {
    return { today: 0, thisWeek: 0, thisMonth: 0, estimated: 0, averageTicket: 0 };
  }

  private getEmptyOccupancyStats(): OccupancyStats {
    return { today: 0, thisWeek: 0, thisMonth: 0, availableSlotsToday: 0, totalSlotsToday: 0 };
  }
}
