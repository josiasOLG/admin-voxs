import { ProfessionalProfile } from '../interfaces';
import { ProfessionalType } from '../enums';

/**
 * Template para Psicólogo.
 * Focado em atendimento psicológico e terapêutico com conformidade regulatória.
 */
export const PSYCHOLOGIST_TEMPLATE: Partial<ProfessionalProfile> = {
  type: ProfessionalType.PSYCHOLOGIST,
  isActive: true,

  branding: {
    displayName: 'Clínica de Psicologia',
    icon: 'psychology',
    primaryColor: '#4CAF50',
    secondaryColor: '#8BC34A',
    accentColor: '#2E7D32',
    theme: 'light',
  },

  terminology: {
    client: {
      singular: 'Paciente',
      plural: 'Pacientes',
      description: 'Pessoa em atendimento psicológico',
    },
    service: {
      singular: 'Sessão',
      plural: 'Sessões',
      description: 'Atendimento terapêutico',
    },
    appointment: {
      singular: 'Atendimento',
      plural: 'Atendimentos',
      description: 'Horário de sessão terapêutica',
    },
    record: {
      singular: 'Prontuário',
      plural: 'Prontuários',
      description: 'Registro clínico do paciente',
    },
    professional: 'Psicólogo(a)',
  },

  modules: [
    { moduleId: 'dashboard', enabled: true, priority: 1, visibleInMenu: true },
    { moduleId: 'clients', enabled: true, priority: 2, visibleInMenu: true, customName: 'Pacientes' },
    { moduleId: 'appointments', enabled: true, priority: 3, visibleInMenu: true, customName: 'Atendimentos', showBadge: true },
    { moduleId: 'calendar', enabled: true, priority: 4, visibleInMenu: true },
    { moduleId: 'services', enabled: true, priority: 5, visibleInMenu: true, customName: 'Tipos de Terapia' },
    { moduleId: 'medical-records', enabled: true, priority: 6, visibleInMenu: true, customName: 'Prontuários' },
    { moduleId: 'clinical-notes', enabled: true, priority: 7, visibleInMenu: true, customName: 'Anotações Clínicas' },
    { moduleId: 'documents', enabled: true, priority: 8, visibleInMenu: true, customName: 'Documentos' },
    { moduleId: 'messages', enabled: true, priority: 9, visibleInMenu: true, showBadge: true },
    { moduleId: 'payments', enabled: true, priority: 10, visibleInMenu: true },
    { moduleId: 'reports', enabled: true, priority: 11, visibleInMenu: true },
    { moduleId: 'settings', enabled: true, priority: 99, visibleInMenu: true },
    // Módulos desabilitados
    { moduleId: 'qrcode-loyalty', enabled: false, priority: 999, visibleInMenu: false },
    { moduleId: 'advertisements', enabled: false, priority: 999, visibleInMenu: false },
  ],

  customFields: [
    {
      id: 'therapy-approach',
      name: 'Abordagem Terapêutica',
      type: 'select',
      entity: 'service',
      required: true,
      options: [
        { value: 'tcc', label: 'TCC - Terapia Cognitivo-Comportamental' },
        { value: 'psychoanalysis', label: 'Psicanálise' },
        { value: 'humanistic', label: 'Humanista' },
        { value: 'systemic', label: 'Sistêmica/Familiar' },
        { value: 'gestalt', label: 'Gestalt-Terapia' },
        { value: 'analytical', label: 'Psicologia Analítica (Junguiana)' },
      ],
      order: 1,
      aiDescription: 'Abordagem terapêutica utilizada no atendimento',
    },
    {
      id: 'emergency-contact',
      name: 'Contato de Emergência',
      type: 'phone',
      entity: 'client',
      required: true,
      placeholder: '(00) 00000-0000',
      helpText: 'Telefone de um familiar ou pessoa próxima para emergências',
      order: 2,
      aiDescription: 'Contato para situações de emergência',
    },
    {
      id: 'main-complaint',
      name: 'Queixa Principal',
      type: 'textarea',
      entity: 'record',
      required: true,
      placeholder: 'Descreva o motivo da busca por atendimento...',
      order: 3,
      aiDescription: 'Motivo principal que levou o paciente a buscar terapia',
    },
    {
      id: 'previous-treatment',
      name: 'Tratamento Anterior',
      type: 'textarea',
      entity: 'client',
      required: false,
      placeholder: 'Histórico de tratamentos psicológicos ou psiquiátricos anteriores',
      order: 4,
    },
    {
      id: 'medications',
      name: 'Medicações em Uso',
      type: 'textarea',
      entity: 'client',
      required: false,
      placeholder: 'Liste medicações psiquiátricas ou outras em uso',
      helpText: 'Importante para compreensão do quadro clínico',
      order: 5,
    },
    {
      id: 'session-goals',
      name: 'Objetivos da Sessão',
      type: 'textarea',
      entity: 'appointment',
      required: false,
      placeholder: 'Objetivos terapêuticos para esta sessão',
      order: 6,
    },
  ],

  settings: {
    defaultSessionDuration: 50,
    defaultBreakBetweenSessions: 10,
    allowRecurringAppointments: true,
    minimumTimeBetweenSessions: 1440, // 24 horas
    maxAdvanceBookingDays: 60,
    minAdvanceBookingHours: 24,
    requireDepositPayment: false,
    enableLoyaltyProgram: false,
    enableProgressPhotos: false,
    enableMealPlans: false,
    trackBodyMetrics: false,
    autoGenerateEvolutionReport: true,
    reassessmentFrequencyDays: 90, // Reavaliação a cada 3 meses
    sendAutomaticReminders: true,
    reminderHoursBefore: 48,
    allowOnlineCancellation: true,
    cancellationDeadlineHours: 24,
    cancellationPenaltyType: 'percentage',
    cancellationPenaltyValue: 50, // 50% do valor
    enableWaitingList: true,
    availableModalities: ['presential', 'online'],
    acceptingNewClients: true,
    maxLatencyToleranceMinutes: 10,
    privacySettings: {
      publicProfile: true,
      showExactLocation: false, // Privacidade maior
      showPrices: true,
      allowPublicReviews: true,
      showClientCount: false, // Confidencialidade
      allowPortfolioSharing: false, // Sem fotos de pacientes
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      notifyNewAppointments: true,
      notifyCancellations: true,
      notifyClientMessages: true,
      notifyReviews: false,
      notifyPayments: true,
      quietHoursStart: '20:00',
      quietHoursEnd: '08:00',
    },
  },

  regulation: {
    council: 'CRP',
    registration: '',
    lgpdCompliant: true,
    requiresConsent: true,
    consentTemplate: 'termo-consentimento-psicologia',
    dataRetentionDays: 1825, // 5 anos (CFP)
    encryptSensitiveData: true,
    sensitiveFields: [
      'main-complaint',
      'previous-treatment',
      'medications',
      'clinical-notes',
      'diagnosis',
    ],
    auditConfig: {
      logAllActions: true,
      retentionDays: 1825,
      notifyOnCriticalActions: true,
    },
  },
};
