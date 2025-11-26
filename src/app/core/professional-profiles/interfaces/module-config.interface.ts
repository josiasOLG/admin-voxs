import { ModuleCategory } from '../enums';

/**
 * Configuração de um módulo no perfil profissional.
 * Define se o módulo está habilitado e suas configurações específicas.
 */
export interface ModuleConfig {
  /** ID único do módulo */
  moduleId: string;

  /** Módulo habilitado? */
  enabled: boolean;

  /** Prioridade/ordem no menu (menor = mais importante) */
  priority: number;

  /** Nome customizado do módulo (sobrescreve o padrão) */
  customName?: string;

  /** Ícone customizado (sobrescreve o padrão) */
  customIcon?: string;

  /** Rota customizada (sobrescreve a padrão) */
  customRoute?: string;

  /** Configurações específicas do módulo */
  configuration?: Record<string, any>;

  /** Campos obrigatórios para este módulo */
  requiredFields?: string[];

  /** Permissões necessárias */
  requiredPermissions?: string[];

  /** Visível no menu? */
  visibleInMenu?: boolean;

  /** Badge/contador no menu (ex: número de notificações) */
  showBadge?: boolean;
}

/**
 * Definição completa de um módulo do sistema.
 * Usado no marketplace para instalar/desinstalar módulos.
 */
export interface ModuleDefinition {
  /** ID único do módulo */
  id: string;

  /** Nome do módulo */
  name: string;

  /** Descrição detalhada */
  description: string;

  /** Ícone do Material Icons */
  icon: string;

  /** Categoria do módulo */
  category: ModuleCategory;

  /** Versão do módulo */
  version: string;

  /** Profissões que podem usar este módulo */
  availableFor: string[];

  /** Módulo obrigatório (não pode ser desabilitado) */
  isCore: boolean;

  /** Módulo premium (requer plano pago) */
  isPremium: boolean;

  /** Módulos dos quais este depende */
  dependsOn: string[];

  /** Módulos que dependem deste */
  dependents?: string[];

  /** Rota base do módulo */
  baseRoute: string;

  /** Componente principal do módulo */
  mainComponent?: string;

  /** Configuração padrão */
  defaultConfig?: Record<string, any>;

  /** Screenshots/imagens do módulo */
  screenshots?: string[];

  /** Autor do módulo */
  author?: string;

  /** Tags para busca */
  tags?: string[];
}
