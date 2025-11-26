import { ProfessionalProfile } from '../interfaces';
import { ProfessionalType } from '../enums';

/**
 * Template para Barbeiro/Cabeleireiro.
 * Focado em serviços de beleza e estética capilar.
 */
export const BARBER_TEMPLATE: Partial<ProfessionalProfile> = {
  type: ProfessionalType.BARBER,
  isActive: true,

  branding: {
    displayName: 'Barbearia',
    icon: 'content_cut',
    primaryColor: '#1976D2',
    secondaryColor: '#FFC107',
    accentColor: '#212121',
    theme: 'light',
  },

  terminology: {
    client: {
      singular: 'Cliente',
      plural: 'Clientes',
      description: 'Pessoa que utiliza os serviços',
    },
    service: {
      singular: 'Serviço',
      plural: 'Serviços',
      description: 'Tipo de atendimento oferecido',
    },
    appointment: {
      singular: 'Agendamento',
      plural: 'Agendamentos',
      description: 'Horário reservado para atendimento',
    },
    record: {
      singular: 'Histórico',
      plural: 'Históricos',
      description: 'Registro de atendimentos anteriores',
    },
    professional: 'Barbeiro(a)',
  },

  modules: [
    { moduleId: 'dashboard', enabled: true, priority: 1, visibleInMenu: true },
    { moduleId: 'clients', enabled: true, priority: 2, visibleInMenu: true },
    { moduleId: 'appointments', enabled: true, priority: 3, visibleInMenu: true, showBadge: true },
    { moduleId: 'calendar', enabled: true, priority: 4, visibleInMenu: true },
    { moduleId: 'services', enabled: true, priority: 5, visibleInMenu: true },
    { moduleId: 'qrcode-loyalty', enabled: true, priority: 6, visibleInMenu: true },
    { moduleId: 'messages', enabled: true, priority: 7, visibleInMenu: true, showBadge: true },
    { moduleId: 'advertisements', enabled: true, priority: 8, visibleInMenu: true },
    { moduleId: 'payments', enabled: true, priority: 9, visibleInMenu: true },
    { moduleId: 'reports', enabled: true, priority: 10, visibleInMenu: true },
    { moduleId: 'settings', enabled: true, priority: 99, visibleInMenu: true },
    // Módulos desabilitados por padrão
    { moduleId: 'medical-records', enabled: false, priority: 999, visibleInMenu: false },
    { moduleId: 'prescriptions', enabled: false, priority: 999, visibleInMenu: false },
    { moduleId: 'clinical-notes', enabled: false, priority: 999, visibleInMenu: false },
  ],

  customFields: [
    {
      id: 'hair-type',
      name: 'Tipo de Cabelo',
      type: 'select',
      entity: 'client',
      required: false,
      options: [
        { value: 'straight', label: 'Liso', icon: 'straight' },
        { value: 'wavy', label: 'Ondulado', icon: 'water' },
        { value: 'curly', label: 'Cacheado', icon: 'circle' },
        { value: 'coily', label: 'Crespo', icon: 'blur_circular' },
      ],
      order: 1,
      aiDescription: 'Tipo de cabelo do cliente para sugerir serviços adequados',
    },
    {
      id: 'hair-length',
      name: 'Comprimento do Cabelo',
      type: 'select',
      entity: 'client',
      required: false,
      options: [
        { value: 'short', label: 'Curto' },
        { value: 'medium', label: 'Médio' },
        { value: 'long', label: 'Longo' },
      ],
      order: 2,
    },
    {
      id: 'preferred-style',
      name: 'Estilo Preferido',
      type: 'text',
      entity: 'client',
      required: false,
      placeholder: 'Ex: Degradê, Social, Moicano',
      order: 3,
    },
    {
      id: 'allergies',
      name: 'Alergias/Restrições',
      type: 'textarea',
      entity: 'client',
      required: false,
      placeholder: 'Alergias a produtos químicos, sensibilidade, etc.',
      helpText: 'Importante para evitar reações alérgicas',
      order: 4,
    },
  ],

  settings: {
    defaultSessionDuration: 50,
    defaultBreakBetweenSessions: 10,
    allowRecurringAppointments: true,
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
    requireDepositPayment: false,
    enableLoyaltyProgram: true,
    pointsPerService: 10,
    pointValue: 1.0,
    enableProgressPhotos: true,
    enableMealPlans: false,
    trackBodyMetrics: false,
    autoGenerateEvolutionReport: false,
    sendAutomaticReminders: true,
    reminderHoursBefore: 24,
    allowOnlineCancellation: true,
    cancellationDeadlineHours: 6,
    cancellationPenaltyType: 'none',
    enableWaitingList: true,
    availableModalities: ['presential'],
    acceptingNewClients: true,
    maxLatencyToleranceMinutes: 15,
    privacySettings: {
      publicProfile: true,
      showExactLocation: true,
      showPrices: true,
      allowPublicReviews: true,
      showClientCount: true,
      allowPortfolioSharing: true,
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      notifyNewAppointments: true,
      notifyCancellations: true,
      notifyClientMessages: true,
      notifyReviews: true,
      notifyPayments: true,
    },
  },
};
