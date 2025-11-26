/**
 * Configurações de identidade visual e branding do profissional.
 */
export interface ProfessionalBranding {
  /** Nome de exibição (ex: "Barbearia João", "Clínica de Psicologia") */
  displayName: string;

  /** Ícone do Material Icons (ex: "content_cut", "psychology") */
  icon: string;

  /** Cor primária em hexadecimal (ex: "#1976D2") */
  primaryColor: string;

  /** Cor secundária em hexadecimal (ex: "#FFC107") */
  secondaryColor: string;

  /** Cor de destaque (opcional) */
  accentColor?: string;

  /** URL do logotipo (opcional) */
  logo?: string;

  /** URL da imagem de capa/banner (opcional) */
  coverImage?: string;

  /** Fonte customizada (opcional) */
  customFont?: string;

  /** Tema (light/dark) */
  theme?: 'light' | 'dark' | 'auto';
}
