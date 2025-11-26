import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CtaSectionComponent,
  Feature,
  FeaturesSectionComponent,
  HeroSectionComponent,
  HeroStat,
  LandingFooterComponent,
  Testimonial,
  TestimonialsSectionComponent,
} from '../../components';

/**
 * Componente da página inicial (Landing Page)
 * Apresenta a plataforma e redireciona para login
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    FeaturesSectionComponent,
    TestimonialsSectionComponent,
    CtaSectionComponent,
    LandingFooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private router = inject(Router);

  public readonly stats: HeroStat[] = [
    { value: '10K+', label: 'Agendamentos' },
    { value: '500+', label: 'Clientes Ativos' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Suporte' },
  ];

  public readonly features: Feature[] = [
    {
      icon: 'pi pi-calendar',
      title: 'Gestão de Agendamentos',
      description:
        'Controle total sobre seus agendamentos com calendário inteligente e notificações automáticas.',
    },
    {
      icon: 'pi pi-users',
      title: 'Gestão de Clientes',
      description:
        'Mantenha o histórico completo de seus clientes e personalize o atendimento.',
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Relatórios e Analytics',
      description:
        'Acompanhe o desempenho do seu negócio com relatórios detalhados e insights valiosos.',
    },
    {
      icon: 'pi pi-mobile',
      title: 'Acesso Mobile',
      description:
        'Gerencie seu negócio de qualquer lugar com nossa plataforma responsiva.',
    },
    {
      icon: 'pi pi-bell',
      title: 'Notificações Inteligentes',
      description:
        'Receba alertas sobre agendamentos, cancelamentos e lembretes automáticos.',
    },
    {
      icon: 'pi pi-shield',
      title: 'Segurança Total',
      description:
        'Seus dados protegidos com criptografia de ponta e backup automático.',
    },
    {
      icon: 'pi pi-dollar',
      title: 'Gestão Financeira',
      description:
        'Controle completo de receitas, despesas e pagamentos com relatórios financeiros detalhados.',
    },
    {
      icon: 'pi pi-clock',
      title: 'Controle de Horários',
      description:
        'Defina horários de funcionamento, intervalos e disponibilidade de forma inteligente.',
    },
    {
      icon: 'pi pi-comments',
      title: 'Chat Integrado',
      description:
        'Comunique-se diretamente com seus clientes através do chat integrado na plataforma.',
    },
    {
      icon: 'pi pi-star',
      title: 'Avaliações e Feedback',
      description:
        'Receba avaliações dos clientes e melhore continuamente a qualidade do seu serviço.',
    },
  ];

  public readonly testimonials: Testimonial[] = [
    {
      text: 'Aumentei minha produtividade em 300% desde que comecei a usar!',
      author: 'Maria Silva',
      role: 'Proprietária de Salão',
      rating: 5,
    },
    {
      text: 'A melhor plataforma de gestão que já usei. Intuitiva e completa!',
      author: 'João Santos',
      role: 'Barbeiro',
      rating: 5,
    },
    {
      text: 'Meus clientes adoram receber lembretes automáticos. Zero faltas!',
      author: 'Ana Costa',
      role: 'Esteticista',
      rating: 5,
    },
    {
      text: 'O app mobile me permite gerenciar tudo de qualquer lugar!',
      author: 'Pedro Oliveira',
      role: 'Proprietário de Clínica',
      rating: 5,
    },
    {
      text: 'Triplicamos nosso faturamento com os relatórios e insights!',
      author: 'Carla Mendes',
      role: 'Gestora de Spa',
      rating: 5,
    },
    {
      text: 'Sistema perfeito! Muito fácil de usar e super completo.',
      author: 'Rafael Lima',
      role: 'Cabeleireiro',
      rating: 5,
    },
    {
      text: 'Economia de tempo absurda! Agora foco no que realmente importa.',
      author: 'Juliana Rocha',
      role: 'Manicure',
      rating: 5,
    },
    {
      text: 'A gestão financeira facilitou muito minha vida empresarial!',
      author: 'Fernando Alves',
      role: 'Proprietário de Barbearia',
      rating: 5,
    },
    {
      text: 'Atendimento impecável e suporte sempre disponível. Recomendo!',
      author: 'Beatriz Ferreira',
      role: 'Designer de Sobrancelhas',
      rating: 5,
    },
    {
      text: 'Interface linda e funcional. Meus funcionários adoraram!',
      author: 'Lucas Martins',
      role: 'Gerente de Salão',
      rating: 5,
    },
    {
      text: 'Reduzimos 80% das ligações com as notificações automáticas!',
      author: 'Camila Souza',
      role: 'Proprietária de Clínica Estética',
      rating: 5,
    },
    {
      text: 'Profissionalismo e qualidade em cada detalhe da plataforma!',
      author: 'Ricardo Gomes',
      role: 'Barbeiro Profissional',
      rating: 5,
    },
    {
      text: 'Meus clientes ficaram impressionados com a organização!',
      author: 'Patrícia Dias',
      role: 'Podóloga',
      rating: 5,
    },
    {
      text: 'Sistema robusto e confiável. Nunca mais tive problemas!',
      author: 'Diego Cardoso',
      role: 'Proprietário de Studio',
      rating: 5,
    },
    {
      text: 'A segurança dos dados me deixa tranquilo. Excelente!',
      author: 'Fernanda Castro',
      role: 'Gestora de Spa',
      rating: 5,
    },
    {
      text: 'Automatizei tudo! Agora tenho mais tempo para minha família.',
      author: 'Thiago Ribeiro',
      role: 'Cabeleireiro',
      rating: 5,
    },
    {
      text: 'ROI incrível! Valeu cada centavo investido na plataforma.',
      author: 'Vanessa Pinto',
      role: 'Empresária',
      rating: 5,
    },
    {
      text: 'Chat integrado revolucionou meu atendimento ao cliente!',
      author: 'Marcelo Araujo',
      role: 'Proprietário de Barbearia',
      rating: 5,
    },
    {
      text: 'Controle total do meu negócio na palma da mão. Sensacional!',
      author: 'Gabriela Lopes',
      role: 'Micropigmentadora',
      rating: 5,
    },
    {
      text: 'Melhor decisão que tomei para meu negócio este ano!',
      author: 'Bruno Teixeira',
      role: 'Barbeiro',
      rating: 5,
    },
    {
      text: 'Sistema inteligente que realmente entende meu negócio!',
      author: 'Amanda Correia',
      role: 'Esteticista Facial',
      rating: 5,
    },
    {
      text: 'Dobrei minha carteira de clientes em 3 meses. Incrível!',
      author: 'Rodrigo Nunes',
      role: 'Personal Hair Stylist',
      rating: 5,
    },
  ];

  /**
   * Navega para a página de login
   */
  public goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Navega para a página de registro
   */
  public goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
