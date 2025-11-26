/**
 * Interface para definir os itens do menu lateral direito
 */
export interface IRightNavItem {
  id: string;
  icon: string;
  label: string;
  action?: () => void;
  link?: string;
}
