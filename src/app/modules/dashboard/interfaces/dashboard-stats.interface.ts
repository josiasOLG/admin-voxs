/**
 * Estatísticas do dashboard.
 * Contém métricas gerais do negócio.
 */
export interface DashboardStats {
  /** Total de agendamentos */
  appointments: AppointmentStats;

  /** Estatísticas de clientes */
  clients: ClientStats;

  /** Estatísticas financeiras */
  revenue: RevenueStats;

  /** Ocupação da agenda */
  occupancy: OccupancyStats;

  /** Período dos dados */
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * Estatísticas de agendamentos.
 */
export interface AppointmentStats {
  /** Total de agendamentos hoje */
  today: number;

  /** Total desta semana */
  thisWeek: number;

  /** Total deste mês */
  thisMonth: number;

  /** Total pendentes de aprovação */
  pending: number;

  /** Total confirmados */
  confirmed: number;

  /** Total cancelados */
  cancelled: number;

  /** Próximo agendamento */
  next?: UpcomingAppointment;

  /** Taxa de comparecimento (%) */
  attendanceRate?: number;

  /** Taxa de cancelamento (%) */
  cancellationRate?: number;
}

/**
 * Próximo agendamento.
 */
export interface UpcomingAppointment {
  id: string;
  clientName: string;
  service: string;
  date: Date;
  time: string;
  modality: string;
  status: string;
}

/**
 * Estatísticas de clientes.
 */
export interface ClientStats {
  /** Total de clientes ativos */
  total: number;

  /** Novos clientes este mês */
  newThisMonth: number;

  /** Clientes recorrentes */
  recurring: number;

  /** Clientes inativos (sem agendamento há 30+ dias) */
  inactive: number;

  /** Taxa de retenção (%) */
  retentionRate?: number;
}

/**
 * Estatísticas de receita.
 */
export interface RevenueStats {
  /** Receita hoje */
  today: number;

  /** Receita esta semana */
  thisWeek: number;

  /** Receita este mês */
  thisMonth: number;

  /** Receita estimada (agendamentos pendentes) */
  estimated: number;

  /** Ticket médio */
  averageTicket: number;

  /** Crescimento comparado ao mês anterior (%) */
  growthRate?: number;
}

/**
 * Ocupação da agenda.
 */
export interface OccupancyStats {
  /** Percentual de ocupação hoje */
  today: number;

  /** Percentual esta semana */
  thisWeek: number;

  /** Percentual este mês */
  thisMonth: number;

  /** Horários disponíveis hoje */
  availableSlotsToday: number;

  /** Total de horários hoje */
  totalSlotsToday: number;
}

/**
 * Dados para gráficos do dashboard.
 */
export interface DashboardChartData {
  /** Agendamentos por dia (últimos 7 dias) */
  appointmentsByDay: ChartDataPoint[];

  /** Receita por dia (últimos 30 dias) */
  revenueByDay: ChartDataPoint[];

  /** Serviços mais populares */
  topServices: ServicePopularity[];

  /** Horários mais agendados */
  peakHours: HourPopularity[];

  /** Status de agendamentos (pie chart) */
  appointmentsByStatus: StatusDistribution[];
}

/**
 * Ponto de dados para gráfico.
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
}

/**
 * Popularidade de serviço.
 */
export interface ServicePopularity {
  serviceName: string;
  count: number;
  revenue: number;
  percentage: number;
}

/**
 * Popularidade de horário.
 */
export interface HourPopularity {
  hour: string;
  count: number;
  percentage: number;
}

/**
 * Distribuição por status.
 */
export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

/**
 * Ações rápidas do dashboard.
 */
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  route: string;
  color: string;
  enabled: boolean;
  badge?: number;
}

/**
 * Widget do dashboard.
 */
export interface DashboardWidget {
  id: string;
  title: string;
  type: WidgetType;
  data: any;
  order: number;
  size: WidgetSize;
  visible: boolean;
  refreshInterval?: number; // em segundos
}

/**
 * Tipos de widgets.
 */
export type WidgetType =
  | 'stat-card'
  | 'chart'
  | 'list'
  | 'calendar'
  | 'quick-actions'
  | 'recent-activity';

/**
 * Tamanho do widget.
 */
export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

/**
 * Filtros do dashboard.
 */
export interface DashboardFilters {
  dateRange: DateRange;
  professionalId?: string;
  serviceIds?: string[];
  status?: string[];
}

/**
 * Intervalo de datas.
 */
export interface DateRange {
  start: Date;
  end: Date;
  preset?: 'today' | 'week' | 'month' | 'year' | 'custom';
}
