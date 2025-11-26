import { ProfessionalProfile } from '../interfaces';
import { ProfessionalType } from '../enums';

/**
 * Template para Personal Trainer.
 * Focado em treinamento físico personalizado e acompanhamento de evolução.
 */
export const PERSONAL_TRAINER_TEMPLATE: Partial<ProfessionalProfile> = {
  type: ProfessionalType.PERSONAL_TRAINER,
  isActive: true,

  branding: {
    displayName: 'Personal Training',
    icon: 'fitness_center',
    primaryColor: '#FF5722',
    secondaryColor: '#FF9800',
    accentColor: '#D84315',
    theme: 'dark',
  },

  terminology: {
    client: {
      singular: 'Aluno',
      plural: 'Alunos',
      description: 'Pessoa em treinamento',
    },
    service: {
      singular: 'Treino',
      plural: 'Treinos',
      description: 'Programa de exercícios',
    },
    appointment: {
      singular: 'Aula',
      plural: 'Aulas',
      description: 'Sessão de treinamento',
    },
    record: {
      singular: 'Ficha',
      plural: 'Fichas',
      description: 'Ficha de avaliação e evolução',
    },
    professional: 'Personal Trainer',
  },

  modules: [
    { moduleId: 'dashboard', enabled: true, priority: 1, visibleInMenu: true },
    { moduleId: 'clients', enabled: true, priority: 2, visibleInMenu: true, customName: 'Alunos' },
    { moduleId: 'appointments', enabled: true, priority: 3, visibleInMenu: true, customName: 'Aulas', showBadge: true },
    { moduleId: 'calendar', enabled: true, priority: 4, visibleInMenu: true },
    { moduleId: 'services', enabled: true, priority: 5, visibleInMenu: true, customName: 'Planos de Treino' },
    { moduleId: 'physical-assessment', enabled: true, priority: 6, visibleInMenu: true, customName: 'Avaliações Físicas' },
    { moduleId: 'workout-plans', enabled: true, priority: 7, visibleInMenu: true, customName: 'Fichas de Treino' },
    { moduleId: 'progress-tracking', enabled: true, priority: 8, visibleInMenu: true, customName: 'Evolução' },
    { moduleId: 'messages', enabled: true, priority: 9, visibleInMenu: true, showBadge: true },
    { moduleId: 'payments', enabled: true, priority: 10, visibleInMenu: true },
    { moduleId: 'reports', enabled: true, priority: 11, visibleInMenu: true },
    { moduleId: 'settings', enabled: true, priority: 99, visibleInMenu: true },
    // Opcionais
    { moduleId: 'meal-plans', enabled: false, priority: 12, visibleInMenu: false, customName: 'Planos Alimentares' },
  ],

  customFields: [
    {
      id: 'fitness-goal',
      name: 'Objetivo Principal',
      type: 'select',
      entity: 'client',
      required: true,
      options: [
        { value: 'weight-loss', label: 'Emagrecimento', icon: 'trending_down', color: '#FF5722' },
        { value: 'muscle-gain', label: 'Hipertrofia', icon: 'trending_up', color: '#4CAF50' },
        { value: 'performance', label: 'Performance Esportiva', icon: 'sports', color: '#2196F3' },
        { value: 'health', label: 'Saúde e Bem-estar', icon: 'favorite', color: '#E91E63' },
        { value: 'conditioning', label: 'Condicionamento Físico', icon: 'directions_run', color: '#FF9800' },
      ],
      order: 1,
      aiDescription: 'Objetivo principal do aluno com o treinamento',
    },
    {
      id: 'current-weight',
      name: 'Peso Atual (kg)',
      type: 'number',
      entity: 'client',
      required: false,
      placeholder: 'Ex: 75.5',
      validation: {
        min: 30,
        max: 300,
        errorMessage: 'Peso deve estar entre 30kg e 300kg',
      },
      order: 2,
      aiDescription: 'Peso atual do aluno em quilogramas',
    },
    {
      id: 'target-weight',
      name: 'Peso Objetivo (kg)',
      type: 'number',
      entity: 'client',
      required: false,
      placeholder: 'Ex: 70',
      order: 3,
    },
    {
      id: 'height',
      name: 'Altura (cm)',
      type: 'number',
      entity: 'client',
      required: false,
      placeholder: 'Ex: 175',
      validation: {
        min: 100,
        max: 250,
      },
      order: 4,
    },
    {
      id: 'body-fat',
      name: 'Percentual de Gordura (%)',
      type: 'number',
      entity: 'client',
      required: false,
      placeholder: 'Ex: 18.5',
      validation: {
        min: 3,
        max: 60,
      },
      order: 5,
      aiDescription: 'Percentual de gordura corporal',
    },
    {
      id: 'lean-mass',
      name: 'Massa Magra (kg)',
      type: 'number',
      entity: 'client',
      required: false,
      order: 6,
    },
    {
      id: 'training-experience',
      name: 'Experiência com Treinos',
      type: 'select',
      entity: 'client',
      required: false,
      options: [
        { value: 'beginner', label: 'Iniciante (0-6 meses)' },
        { value: 'intermediate', label: 'Intermediário (6-24 meses)' },
        { value: 'advanced', label: 'Avançado (2+ anos)' },
        { value: 'athlete', label: 'Atleta' },
      ],
      order: 7,
    },
    {
      id: 'health-restrictions',
      name: 'Restrições de Saúde',
      type: 'textarea',
      entity: 'client',
      required: false,
      placeholder: 'Lesões, problemas articulares, cardíacos, etc.',
      helpText: 'Importante para adequar os exercícios',
      order: 8,
    },
    {
      id: 'training-frequency',
      name: 'Frequência Semanal',
      type: 'select',
      entity: 'client',
      required: false,
      options: [
        { value: '2', label: '2x por semana' },
        { value: '3', label: '3x por semana' },
        { value: '4', label: '4x por semana' },
        { value: '5', label: '5x por semana' },
        { value: '6', label: '6x por semana' },
      ],
      order: 9,
    },
  ],

  settings: {
    defaultSessionDuration: 60,
    defaultBreakBetweenSessions: 30,
    allowRecurringAppointments: true,
    maxAdvanceBookingDays: 90,
    minAdvanceBookingHours: 4,
    requireDepositPayment: true,
    depositPercentage: 30,
    enableLoyaltyProgram: true,
    pointsPerService: 1,
    pointValue: 10.0,
    enableProgressPhotos: true,
    enableMealPlans: true,
    trackBodyMetrics: true,
    autoGenerateEvolutionReport: true,
    reassessmentFrequencyDays: 30, // Reavaliação mensal
    sendAutomaticReminders: true,
    reminderHoursBefore: 12,
    allowOnlineCancellation: true,
    cancellationDeadlineHours: 12,
    cancellationPenaltyType: 'lose_deposit',
    enableWaitingList: true,
    availableModalities: ['presential', 'online', 'home_service'],
    acceptingNewClients: true,
    maxLatencyToleranceMinutes: 10,
    privacySettings: {
      publicProfile: true,
      showExactLocation: true,
      showPrices: true,
      allowPublicReviews: true,
      showClientCount: true,
      allowPortfolioSharing: true, // Fotos de antes/depois (com autorização)
    },
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      notifyNewAppointments: true,
      notifyCancellations: true,
      notifyClientMessages: true,
      notifyReviews: true,
      notifyPayments: true,
    },
  },

  regulation: {
    council: 'CREF',
    registration: '',
    lgpdCompliant: true,
    requiresConsent: true,
    consentTemplate: 'termo-consentimento-personal',
    dataRetentionDays: 1095, // 3 anos
    encryptSensitiveData: false,
  },
};
