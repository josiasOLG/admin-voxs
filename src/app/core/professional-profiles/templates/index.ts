import { ProfessionalProfile } from '../interfaces';
import { ProfessionalType } from '../enums';
import { BARBER_TEMPLATE } from './barber.template';
import { PSYCHOLOGIST_TEMPLATE } from './psychologist.template';
import { PERSONAL_TRAINER_TEMPLATE } from './personal-trainer.template';

/**
 * Registro de todos os templates profissionais disponíveis.
 * Utilizado para inicialização rápida de perfis profissionais.
 */
export const PROFESSIONAL_TEMPLATES: Record<ProfessionalType, Partial<ProfessionalProfile>> = {
  [ProfessionalType.BARBER]: BARBER_TEMPLATE,
  [ProfessionalType.PSYCHOLOGIST]: PSYCHOLOGIST_TEMPLATE,
  [ProfessionalType.PERSONAL_TRAINER]: PERSONAL_TRAINER_TEMPLATE,

  // Outros templates (serão implementados conforme necessário)
  [ProfessionalType.DOCTOR]: {
    type: ProfessionalType.DOCTOR,
    branding: {
      displayName: 'Consultório Médico',
      icon: 'medical_services',
      primaryColor: '#2196F3',
      secondaryColor: '#03A9F4',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Paciente', plural: 'Pacientes' },
      service: { singular: 'Consulta', plural: 'Consultas' },
      appointment: { singular: 'Atendimento', plural: 'Atendimentos' },
      record: { singular: 'Prontuário', plural: 'Prontuários' },
      professional: 'Médico(a)',
    },
  },

  [ProfessionalType.LAWYER]: {
    type: ProfessionalType.LAWYER,
    branding: {
      displayName: 'Escritório de Advocacia',
      icon: 'gavel',
      primaryColor: '#795548',
      secondaryColor: '#A1887F',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Cliente', plural: 'Clientes' },
      service: { singular: 'Consultoria', plural: 'Consultorias' },
      appointment: { singular: 'Reunião', plural: 'Reuniões' },
      record: { singular: 'Processo', plural: 'Processos' },
      professional: 'Advogado(a)',
    },
  },

  [ProfessionalType.DESIGNER]: {
    type: ProfessionalType.DESIGNER,
    branding: {
      displayName: 'Studio de Design',
      icon: 'palette',
      primaryColor: '#9C27B0',
      secondaryColor: '#BA68C8',
      theme: 'dark',
    },
    terminology: {
      client: { singular: 'Cliente', plural: 'Clientes' },
      service: { singular: 'Projeto', plural: 'Projetos' },
      appointment: { singular: 'Reunião', plural: 'Reuniões' },
      record: { singular: 'Briefing', plural: 'Briefings' },
      professional: 'Designer',
    },
  },

  [ProfessionalType.PHOTOGRAPHER]: {
    type: ProfessionalType.PHOTOGRAPHER,
    branding: {
      displayName: 'Estúdio Fotográfico',
      icon: 'photo_camera',
      primaryColor: '#607D8B',
      secondaryColor: '#90A4AE',
      theme: 'dark',
    },
    terminology: {
      client: { singular: 'Cliente', plural: 'Clientes' },
      service: { singular: 'Ensaio', plural: 'Ensaios' },
      appointment: { singular: 'Sessão', plural: 'Sessões' },
      record: { singular: 'Portfólio', plural: 'Portfólios' },
      professional: 'Fotógrafo(a)',
    },
  },

  [ProfessionalType.ARCHITECT]: {
    type: ProfessionalType.ARCHITECT,
    branding: {
      displayName: 'Escritório de Arquitetura',
      icon: 'architecture',
      primaryColor: '#00BCD4',
      secondaryColor: '#4DD0E1',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Cliente', plural: 'Clientes' },
      service: { singular: 'Projeto', plural: 'Projetos' },
      appointment: { singular: 'Visita', plural: 'Visitas' },
      record: { singular: 'Obra', plural: 'Obras' },
      professional: 'Arquiteto(a)',
    },
  },

  [ProfessionalType.TUTOR]: {
    type: ProfessionalType.TUTOR,
    branding: {
      displayName: 'Aulas Particulares',
      icon: 'school',
      primaryColor: '#FF9800',
      secondaryColor: '#FFB74D',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Aluno', plural: 'Alunos' },
      service: { singular: 'Disciplina', plural: 'Disciplinas' },
      appointment: { singular: 'Aula', plural: 'Aulas' },
      record: { singular: 'Histórico', plural: 'Históricos' },
      professional: 'Professor(a)',
    },
  },

  [ProfessionalType.THERAPIST]: {
    type: ProfessionalType.THERAPIST,
    branding: {
      displayName: 'Clínica de Terapias',
      icon: 'spa',
      primaryColor: '#009688',
      secondaryColor: '#4DB6AC',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Paciente', plural: 'Pacientes' },
      service: { singular: 'Terapia', plural: 'Terapias' },
      appointment: { singular: 'Sessão', plural: 'Sessões' },
      record: { singular: 'Ficha', plural: 'Fichas' },
      professional: 'Terapeuta',
    },
  },

  [ProfessionalType.NUTRITIONIST]: {
    type: ProfessionalType.NUTRITIONIST,
    branding: {
      displayName: 'Consultório de Nutrição',
      icon: 'restaurant',
      primaryColor: '#8BC34A',
      secondaryColor: '#AED581',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Paciente', plural: 'Pacientes' },
      service: { singular: 'Consulta', plural: 'Consultas' },
      appointment: { singular: 'Atendimento', plural: 'Atendimentos' },
      record: { singular: 'Prontuário', plural: 'Prontuários' },
      professional: 'Nutricionista',
    },
  },

  [ProfessionalType.VETERINARIAN]: {
    type: ProfessionalType.VETERINARIAN,
    branding: {
      displayName: 'Clínica Veterinária',
      icon: 'pets',
      primaryColor: '#3F51B5',
      secondaryColor: '#7986CB',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Tutor', plural: 'Tutores' },
      service: { singular: 'Consulta', plural: 'Consultas' },
      appointment: { singular: 'Atendimento', plural: 'Atendimentos' },
      record: { singular: 'Prontuário', plural: 'Prontuários' },
      professional: 'Veterinário(a)',
    },
  },

  [ProfessionalType.DENTIST]: {
    type: ProfessionalType.DENTIST,
    branding: {
      displayName: 'Consultório Odontológico',
      icon: 'sentiment_satisfied_alt',
      primaryColor: '#00BCD4',
      secondaryColor: '#4DD0E1',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Paciente', plural: 'Pacientes' },
      service: { singular: 'Procedimento', plural: 'Procedimentos' },
      appointment: { singular: 'Consulta', plural: 'Consultas' },
      record: { singular: 'Odontograma', plural: 'Odontogramas' },
      professional: 'Dentista',
    },
  },

  [ProfessionalType.CUSTOM]: {
    type: ProfessionalType.CUSTOM,
    branding: {
      displayName: 'Profissional Autônomo',
      icon: 'person',
      primaryColor: '#9E9E9E',
      secondaryColor: '#BDBDBD',
      theme: 'light',
    },
    terminology: {
      client: { singular: 'Cliente', plural: 'Clientes' },
      service: { singular: 'Serviço', plural: 'Serviços' },
      appointment: { singular: 'Agendamento', plural: 'Agendamentos' },
      record: { singular: 'Registro', plural: 'Registros' },
      professional: 'Profissional',
    },
  },
};

/**
 * Obtém o template padrão para um tipo de profissional.
 * @param type Tipo de profissional
 * @returns Template de configuração
 */
export function getProfessionalTemplate(type: ProfessionalType): Partial<ProfessionalProfile> {
  return PROFESSIONAL_TEMPLATES[type] || PROFESSIONAL_TEMPLATES[ProfessionalType.CUSTOM];
}
