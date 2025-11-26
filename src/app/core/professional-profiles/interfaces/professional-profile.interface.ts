import { ProfessionalType } from '../enums';
import { ProfessionalBranding } from './branding.interface';
import { ProfessionalTerminology } from './terminology.interface';
import { ModuleConfig } from './module-config.interface';
import { CustomField } from './custom-field.interface';
import { ProfessionalSettings } from './settings.interface';
import { RegulationConfig } from './regulation.interface';

/**
 * Perfil completo de um profissional.
 * Define todas as configurações, personalizações e comportamentos do sistema
 * para um tipo específico de profissional.
 */
export interface ProfessionalProfile {
  /** Identificador único do perfil */
  id: string;

  /** Tipo de profissional */
  type: ProfessionalType;

  /** Data de criação do perfil */
  createdAt?: Date;

  /** Data da última atualização */
  updatedAt?: Date;

  /** Perfil ativo? */
  isActive: boolean;

  /** Configurações de branding e identidade visual */
  branding: ProfessionalBranding;

  /** Terminologia customizada */
  terminology: ProfessionalTerminology;

  /** Módulos habilitados e suas configurações */
  modules: ModuleConfig[];

  /** Campos customizados por entidade */
  customFields: CustomField[];

  /** Configurações gerais */
  settings: ProfessionalSettings;

  /** Configurações de regulamentação (se aplicável) */
  regulation?: RegulationConfig;

  /** Informações do profissional */
  professionalInfo?: ProfessionalInfo;

  /** Configurações de integração */
  integrations?: IntegrationConfig[];

  /** Metadados adicionais */
  metadata?: Record<string, any>;
}

/**
 * Informações profissionais do usuário.
 */
export interface ProfessionalInfo {
  /** Nome completo */
  fullName: string;

  /** Nome profissional/comercial */
  displayName: string;

  /** Biografia/Sobre */
  bio?: string;

  /** Especialidades */
  specialties?: string[];

  /** Anos de experiência */
  yearsOfExperience?: number;

  /** Formação acadêmica */
  education?: Education[];

  /** Idiomas falados */
  languages?: string[];

  /** Site profissional */
  website?: string;

  /** Redes sociais */
  socialMedia?: SocialMediaLinks;

  /** Endereço profissional */
  address?: ProfessionalAddress;

  /** Telefones de contato */
  phones?: ContactPhone[];

  /** Email profissional */
  email?: string;
}

/**
 * Formação acadêmica.
 */
export interface Education {
  /** Instituição */
  institution: string;

  /** Curso/Título */
  degree: string;

  /** Área de estudo */
  field?: string;

  /** Ano de conclusão */
  yearCompleted?: number;

  /** Instituição verificada? */
  verified?: boolean;
}

/**
 * Links de redes sociais.
 */
export interface SocialMediaLinks {
  /** Facebook */
  facebook?: string;

  /** Instagram */
  instagram?: string;

  /** LinkedIn */
  linkedin?: string;

  /** Twitter/X */
  twitter?: string;

  /** YouTube */
  youtube?: string;

  /** TikTok */
  tiktok?: string;

  /** WhatsApp Business */
  whatsappBusiness?: string;
}

/**
 * Endereço profissional.
 */
export interface ProfessionalAddress {
  /** CEP */
  zipCode: string;

  /** Rua */
  street: string;

  /** Número */
  number: string;

  /** Complemento */
  complement?: string;

  /** Bairro */
  neighborhood: string;

  /** Cidade */
  city: string;

  /** Estado (UF) */
  state: string;

  /** País */
  country: string;

  /** Coordenadas geográficas */
  coordinates?: {
    latitude: number;
    longitude: number;
  };

  /** Raio de atendimento (em km, para serviços a domicílio) */
  serviceRadius?: number;
}

/**
 * Telefone de contato.
 */
export interface ContactPhone {
  /** Tipo de telefone */
  type: 'mobile' | 'landline' | 'whatsapp';

  /** Número (com DDD) */
  number: string;

  /** Telefone principal? */
  isPrimary: boolean;

  /** WhatsApp? */
  isWhatsApp?: boolean;
}

/**
 * Configuração de integração externa.
 */
export interface IntegrationConfig {
  /** Nome da integração */
  name: string;

  /** Tipo de integração */
  type: IntegrationType;

  /** Integração ativa? */
  enabled: boolean;

  /** Credenciais/configurações (criptografadas) */
  credentials?: Record<string, any>;

  /** Data da última sincronização */
  lastSyncAt?: Date;

  /** Status da integração */
  status?: 'active' | 'error' | 'pending';

  /** Mensagem de erro (se houver) */
  errorMessage?: string;
}

/**
 * Tipos de integração suportados.
 */
export type IntegrationType =
  | 'google_calendar'
  | 'outlook_calendar'
  | 'zoom'
  | 'google_meet'
  | 'whatsapp_business'
  | 'pagseguro'
  | 'mercadopago'
  | 'stripe'
  | 'mailchimp'
  | 'sendgrid'
  | 'twilio'
  | 'zapier'
  | 'custom';
