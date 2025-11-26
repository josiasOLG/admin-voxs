/**
 * Interface completa para Agendamentos.
 * Baseada na entidade Appointment da APIBarbearia.
 */

export interface Address {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Appointment {
  id?: string;
  _id?: string;
  idServico?: string;
  userId: string;
  barberId: string;
  date: Date | string;
  time: string;
  status?: AppointmentStatus;
  statusAprovacao?: ApprovalStatus;
  statusMensage?: string;
  service: string[];
  notes?: string;
  statusPoint?: boolean;
  repete?: RepeatType;
  allDay?: boolean;
  exceptions?: Date[];
  endRepeat?: Date;
  color?: string;
  userNumber?: string;
  userName?: string;
  userEmail?: string;
  userCpf?: string;
  userAddress?: Address;
  modality?: ModalityType;
  create?: Date;
  update?: Date;
  active?: boolean;
  manual?: boolean;
  hashuser?: string;
}

/**
 * Status do agendamento
 */
export enum AppointmentStatus {
  PENDING = 'pending',
  APPROVED = 'aprovado',
  REJECTED = 'rejeitado',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no-show',
}

/**
 * Status de aprovação
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'aprovado',
  REJECTED = 'rejeitado',
}

/**
 * Tipo de repetição
 */
export enum RepeatType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

/**
 * Modalidade de atendimento
 */
export enum ModalityType {
  IN_PERSON = 'presencial',
  ONLINE = 'online',
  HOME = 'domicilio',
}

/**
 * Filtros para listagem de agendamentos
 */
export interface AppointmentFilters {
  barberId?: string;
  userId?: string;
  status?: AppointmentStatus[];
  statusAprovacao?: ApprovalStatus[];
  dateFrom?: Date | string;
  dateTo?: Date | string;
  modality?: ModalityType;
  serviceId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'time' | 'status' | 'create';
  sortOrder?: 'asc' | 'desc';
  filter?: 'today' | 'week' | 'month';
}

/**
 * Agendamento formatado para exibição
 */
export interface FormattedAppointment extends Appointment {
  barberName?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userImage?: string;
  userBirthDate?: Date;
  userDescription?: string;
  userPoints?: number;
  serviceNames?: string[];
}

/**
 * Dados para criar/atualizar agendamento
 */
export interface AppointmentPayload {
  userId: string;
  barberId: string;
  date: Date | string;
  time: string;
  service: string[];
  idServico?: string;
  notes?: string;
  modality?: ModalityType;
  repete?: RepeatType;
  allDay?: boolean;
  color?: string;
  userNumber?: string;
  userName?: string;
  userEmail?: string;
  userCpf?: string;
  userAddress?: Address;
  manual?: boolean;
  hashuser?: string;
}

/**
 * Resposta da API ao aprovar agendamento
 */
export interface ApproveAppointmentResponse {
  whatsappUrl?: string;
}

/**
 * Payload para rejeitar agendamento
 */
export interface RejectAppointmentPayload {
  cancelReason: string;
}

/**
 * Resposta ao verificar conflito
 */
export interface CheckExistingResponse {
  exists: boolean;
  message?: string;
}
