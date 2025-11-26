/**
 * Categorias de módulos do sistema.
 * Utilizado para organizar e agrupar módulos no marketplace e menu.
 */
export enum ModuleCategory {
  /** Módulos essenciais do sistema (Dashboard, Auth, Settings) */
  CORE = 'core',

  /** Módulos de agendamento e calendário */
  SCHEDULING = 'scheduling',

  /** Módulos de gestão de clientes/pacientes */
  CLIENT_MANAGEMENT = 'client_management',

  /** Módulos clínicos (Prontuários, Exames, Receitas) */
  CLINICAL = 'clinical',

  /** Módulos de comunicação (Mensagens, Notificações) */
  COMMUNICATION = 'communication',

  /** Módulos de marketing (Anúncios, Fidelidade) */
  MARKETING = 'marketing',

  /** Módulos financeiros (Pagamentos, Relatórios) */
  FINANCIAL = 'financial',

  /** Módulos de documentação (Contratos, Documentos) */
  DOCUMENTATION = 'documentation',

  /** Módulos customizados pelo usuário */
  CUSTOM = 'custom',
}
