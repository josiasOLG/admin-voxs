/**
 * Define a terminologia customizada para cada tipo de profissional.
 * Permite adaptar o vocabulário do sistema ao contexto específico.
 *
 * @example
 * Barbeiro: "Cliente", "Serviço", "Agendamento"
 * Psicólogo: "Paciente", "Sessão", "Atendimento"
 */
export interface ProfessionalTerminology {
  /** Terminologia para cliente/paciente/aluno */
  client: TerminologyItem;

  /** Terminologia para serviço/consulta/sessão */
  service: TerminologyItem;

  /** Terminologia para agendamento/atendimento/aula */
  appointment: TerminologyItem;

  /** Terminologia para prontuário/ficha/histórico */
  record: TerminologyItem;

  /** Nome do profissional (ex: "Barbeiro", "Psicólogo") */
  professional: string;

  /** Terminologia adicional customizada */
  custom?: Record<string, TerminologyItem>;
}

/**
 * Item de terminologia com singular e plural.
 */
export interface TerminologyItem {
  /** Forma singular (ex: "Cliente") */
  singular: string;

  /** Forma plural (ex: "Clientes") */
  plural: string;

  /** Descrição do termo (opcional) */
  description?: string;
}
