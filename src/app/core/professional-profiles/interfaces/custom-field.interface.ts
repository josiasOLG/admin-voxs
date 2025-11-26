/**
 * Tipos de campos customizados suportados.
 */
export type CustomFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'image'
  | 'currency'
  | 'percentage';

/**
 * Entidades onde campos customizados podem ser aplicados.
 */
export type CustomFieldEntity = 'client' | 'service' | 'appointment' | 'record' | 'payment';

/**
 * Define um campo customizado para uma entidade específica.
 * Permite estender o modelo de dados padrão com informações específicas da profissão.
 */
export interface CustomField {
  /** Identificador único do campo */
  id: string;

  /** Nome de exibição do campo */
  name: string;

  /** Tipo do campo */
  type: CustomFieldType;

  /** Entidade onde o campo será aplicado */
  entity: CustomFieldEntity;

  /** Campo obrigatório? */
  required: boolean;

  /** Valor padrão (opcional) */
  defaultValue?: any;

  /** Placeholder/hint (opcional) */
  placeholder?: string;

  /** Texto de ajuda (opcional) */
  helpText?: string;

  /** Opções para campos select/radio (obrigatório para esses tipos) */
  options?: CustomFieldOption[];

  /** Validação customizada (regex ou função) */
  validation?: CustomFieldValidation;

  /** Ordem de exibição */
  order?: number;

  /** Visível apenas para roles específicos */
  visibleForRoles?: string[];

  /** Descrição para IA entender o propósito do campo */
  aiDescription?: string;

  /** Metadados adicionais */
  metadata?: Record<string, any>;
}

/**
 * Opção para campos do tipo select/multiselect/radio.
 */
export interface CustomFieldOption {
  /** Valor da opção */
  value: string;

  /** Label de exibição */
  label: string;

  /** Ícone (opcional) */
  icon?: string;

  /** Cor associada (opcional) */
  color?: string;

  /** Opção desabilitada */
  disabled?: boolean;
}

/**
 * Validação customizada para campos.
 */
export interface CustomFieldValidation {
  /** Expressão regular para validação */
  pattern?: string;

  /** Mensagem de erro customizada */
  errorMessage?: string;

  /** Valor mínimo (para números/datas) */
  min?: number | string;

  /** Valor máximo (para números/datas) */
  max?: number | string;

  /** Tamanho mínimo (para textos) */
  minLength?: number;

  /** Tamanho máximo (para textos) */
  maxLength?: number;

  /** Função de validação customizada (nome da função) */
  customValidator?: string;
}
