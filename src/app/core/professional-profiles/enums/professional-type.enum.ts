/**
 * Tipos de profissionais suportados pelo sistema.
 * Cada tipo possui configurações específicas de terminologia, módulos e funcionalidades.
 */
export enum ProfessionalType {
  /** Barbeiro/Cabeleireiro - Serviços de beleza e estética capilar */
  BARBER = 'barber',

  /** Psicólogo - Atendimento psicológico e terapêutico */
  PSYCHOLOGIST = 'psychologist',

  /** Personal Trainer - Treinamento físico personalizado */
  PERSONAL_TRAINER = 'personal_trainer',

  /** Médico - Consultas e atendimentos médicos */
  DOCTOR = 'doctor',

  /** Advogado - Consultoria e serviços jurídicos */
  LAWYER = 'lawyer',

  /** Designer - Projetos de design gráfico e digital */
  DESIGNER = 'designer',

  /** Fotógrafo - Sessões fotográficas e ensaios */
  PHOTOGRAPHER = 'photographer',

  /** Arquiteto - Projetos arquitetônicos e acompanhamento de obras */
  ARCHITECT = 'architect',

  /** Professor Particular - Aulas e reforço escolar */
  TUTOR = 'tutor',

  /** Terapeuta/Massagista - Terapias e massagens */
  THERAPIST = 'therapist',

  /** Nutricionista - Consultoria nutricional e planos alimentares */
  NUTRITIONIST = 'nutritionist',

  /** Veterinário - Atendimento veterinário */
  VETERINARIAN = 'veterinarian',

  /** Dentista - Atendimento odontológico */
  DENTIST = 'dentist',

  /** Customizado - Perfil personalizado pelo usuário */
  CUSTOM = 'custom',
}
