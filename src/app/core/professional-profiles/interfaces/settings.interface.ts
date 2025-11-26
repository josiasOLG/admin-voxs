/**
 * Configurações gerais do perfil profissional.
 * Define comportamentos e funcionalidades específicas por tipo de profissional.
 */
export interface ProfessionalSettings {
  /** Duração padrão de sessão/atendimento (em minutos) */
  defaultSessionDuration: number;

  /** Intervalo padrão entre sessões (em minutos) */
  defaultBreakBetweenSessions?: number;

  /** Permitir agendamentos recorrentes? */
  allowRecurringAppointments: boolean;

  /** Tempo mínimo entre sessões do mesmo cliente (em minutos) */
  minimumTimeBetweenSessions?: number;

  /** Tempo máximo de antecedência para agendamento (em dias) */
  maxAdvanceBookingDays?: number;

  /** Tempo mínimo de antecedência para agendamento (em horas) */
  minAdvanceBookingHours?: number;

  /** Requer pagamento de sinal/depósito? */
  requireDepositPayment: boolean;

  /** Percentual do depósito (se aplicável) */
  depositPercentage?: number;

  /** Habilitar programa de fidelidade? */
  enableLoyaltyProgram: boolean;

  /** Pontos por serviço (se programa de fidelidade ativo) */
  pointsPerService?: number;

  /** Valor de cada ponto em reais */
  pointValue?: number;

  /** Habilitar fotos de progresso/antes-depois? */
  enableProgressPhotos?: boolean;

  /** Habilitar planos alimentares? (Personal/Nutricionista) */
  enableMealPlans?: boolean;

  /** Rastrear métricas corporais? (Personal/Nutricionista) */
  trackBodyMetrics?: boolean;

  /** Gerar relatório de evolução automaticamente? */
  autoGenerateEvolutionReport?: boolean;

  /** Frequência de reavaliação (em dias) */
  reassessmentFrequencyDays?: number;

  /** Enviar lembretes automáticos? */
  sendAutomaticReminders: boolean;

  /** Horas de antecedência para lembrete */
  reminderHoursBefore?: number;

  /** Permitir cancelamento online? */
  allowOnlineCancellation: boolean;

  /** Prazo limite para cancelamento sem penalidade (em horas) */
  cancellationDeadlineHours?: number;

  /** Tipo de penalidade por cancelamento tardio */
  cancellationPenaltyType?: 'none' | 'percentage' | 'fixed' | 'lose_deposit';

  /** Valor da penalidade (se aplicável) */
  cancellationPenaltyValue?: number;

  /** Permitir lista de espera? */
  enableWaitingList: boolean;

  /** Modalidades de atendimento disponíveis */
  availableModalities: AppointmentModality[];

  /** Aceitar novos clientes? */
  acceptingNewClients: boolean;

  /** Tempo máximo de atraso tolerado (em minutos) */
  maxLatencyToleranceMinutes?: number;

  /** Configurações de privacidade */
  privacySettings?: PrivacySettings;

  /** Configurações de notificações */
  notificationSettings?: NotificationSettings;
}

/**
 * Modalidades de atendimento disponíveis.
 */
export type AppointmentModality =
  | 'presential' // Presencial no estabelecimento
  | 'home_service' // A domicílio
  | 'online' // Online/Videochamada
  | 'hybrid'; // Híbrido

/**
 * Configurações de privacidade.
 */
export interface PrivacySettings {
  /** Compartilhar perfil publicamente? */
  publicProfile: boolean;

  /** Mostrar localização exata? */
  showExactLocation: boolean;

  /** Mostrar preços publicamente? */
  showPrices: boolean;

  /** Permitir avaliações públicas? */
  allowPublicReviews: boolean;

  /** Mostrar histórico de clientes atendidos? */
  showClientCount: boolean;

  /** Permitir compartilhamento de fotos de trabalhos? */
  allowPortfolioSharing: boolean;
}

/**
 * Configurações de notificações.
 */
export interface NotificationSettings {
  /** Receber notificações por email? */
  emailNotifications: boolean;

  /** Receber notificações por SMS? */
  smsNotifications: boolean;

  /** Receber notificações push? */
  pushNotifications: boolean;

  /** Notificar sobre novos agendamentos? */
  notifyNewAppointments: boolean;

  /** Notificar sobre cancelamentos? */
  notifyCancellations: boolean;

  /** Notificar sobre mensagens de clientes? */
  notifyClientMessages: boolean;

  /** Notificar sobre avaliações? */
  notifyReviews: boolean;

  /** Notificar sobre pagamentos? */
  notifyPayments: boolean;

  /** Horário início para notificações */
  quietHoursStart?: string;

  /** Horário fim para notificações */
  quietHoursEnd?: string;
}
