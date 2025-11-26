import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Interface para link do footer
 */
export interface FooterLink {
  label: string;
  url: string;
}

/**
 * Interface para seção do footer
 */
export interface FooterSection {
  title: string;
  links: FooterLink[];
}

/**
 * Interface para rede social
 */
export interface SocialLink {
  icon: string;
  url: string;
  label: string;
}

/**
 * Componente do footer da landing page
 * Exibe marca, links, redes sociais e copyright
 */
@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-footer.component.html',
  styleUrls: ['./landing-footer.component.scss'],
})
export class LandingFooterComponent {
  public readonly currentYear = new Date().getFullYear();

  public readonly sections: FooterSection[] = [
    {
      title: 'Produto',
      links: [
        { label: 'Funcionalidades', url: '#features' },
        { label: 'Preços', url: '#pricing' },
        { label: 'Demonstração', url: '#demo' },
        { label: 'Atualizações', url: '#updates' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre Nós', url: '#about' },
        { label: 'Blog', url: '#blog' },
        { label: 'Carreiras', url: '#careers' },
        { label: 'Contato', url: '#contact' },
      ],
    },
    {
      title: 'Suporte',
      links: [
        { label: 'Central de Ajuda', url: '#help' },
        { label: 'Documentação', url: '#docs' },
        { label: 'Status do Sistema', url: '#status' },
        { label: 'Fale Conosco', url: '#support' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Termos de Uso', url: '#terms' },
        { label: 'Política de Privacidade', url: '#privacy' },
        { label: 'Política de Cookies', url: '#cookies' },
        { label: 'LGPD', url: '#lgpd' },
      ],
    },
  ];

  public readonly socialLinks: SocialLink[] = [
    {
      icon: 'pi pi-facebook',
      url: 'https://facebook.com',
      label: 'Facebook',
    },
    {
      icon: 'pi pi-twitter',
      url: 'https://twitter.com',
      label: 'Twitter',
    },
    {
      icon: 'pi pi-instagram',
      url: 'https://instagram.com',
      label: 'Instagram',
    },
    {
      icon: 'pi pi-linkedin',
      url: 'https://linkedin.com',
      label: 'LinkedIn',
    },
    {
      icon: 'pi pi-youtube',
      url: 'https://youtube.com',
      label: 'YouTube',
    },
  ];

  /**
   * Navega para um link externo ou âncora
   */
  public navigateTo(url: string): void {
    if (url.startsWith('#')) {
      // Scroll suave para âncora
      const element = document.querySelector(url);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Abre em nova aba
      window.open(url, '_blank');
    }
  }
}
