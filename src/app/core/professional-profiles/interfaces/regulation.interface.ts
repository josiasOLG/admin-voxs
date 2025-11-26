/**
 * Configurações de regulamentação e compliance para profissões regulamentadas.
 * Garante conformidade com órgãos reguladores e legislação.
 */
export interface RegulationConfig {
  /** Conselho profissional (ex: "CRM", "CRP", "CREF") */
  council: string;

  /** Número de registro profissional */
  registration: string;

  /** UF do registro */
  registrationState?: string;

  /** Data de emissão do registro */
  registrationDate?: Date;

  /** Data de validade do registro */
  expirationDate?: Date;

  /** Registro ativo? */
  isActive?: boolean;

  /** Sistema em conformidade com LGPD? */
  lgpdCompliant: boolean;

  /** Requer termo de consentimento do cliente? */
  requiresConsent: boolean;

  /** Template do termo de consentimento */
  consentTemplate?: string;

  /** Prazo de retenção de dados (em dias) */
  dataRetentionDays: number;

  /** Criptografar dados sensíveis? */
  encryptSensitiveData: boolean;

  /** Lista de dados sensíveis a criptografar */
  sensitiveFields?: string[];

  /** Código de ética profissional (URL ou texto) */
  ethicsCode?: string;

  /** Certificações adicionais */
  certifications?: ProfessionalCertification[];

  /** Seguros profissionais */
  insurances?: ProfessionalInsurance[];

  /** Configurações de auditoria */
  auditConfig?: AuditConfig;
}

/**
 * Certificação profissional.
 */
export interface ProfessionalCertification {
  /** Nome da certificação */
  name: string;

  /** Instituição emissora */
  issuer: string;

  /** Número do certificado */
  certificateNumber?: string;

  /** Data de emissão */
  issueDate: Date;

  /** Data de validade (se aplicável) */
  expirationDate?: Date;

  /** URL do certificado digital */
  certificateUrl?: string;
}

/**
 * Seguro profissional.
 */
export interface ProfessionalInsurance {
  /** Nome da seguradora */
  insurer: string;

  /** Número da apólice */
  policyNumber: string;

  /** Tipo de cobertura */
  coverageType: string;

  /** Valor da cobertura */
  coverageAmount: number;

  /** Data de início */
  startDate: Date;

  /** Data de término */
  endDate: Date;

  /** Apólice ativa? */
  isActive: boolean;
}

/**
 * Configurações de auditoria.
 */
export interface AuditConfig {
  /** Registrar todas as ações? */
  logAllActions: boolean;

  /** Ações específicas a registrar */
  actionsToLog?: string[];

  /** Manter logs por quantos dias? */
  retentionDays: number;

  /** Notificar administrador em ações críticas? */
  notifyOnCriticalActions: boolean;

  /** Email para notificações de auditoria */
  auditEmail?: string;
}
