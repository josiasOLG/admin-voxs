import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

/**
 * Layout com menu lateral para formulários de agendamento
 * Usado em Create e Edit
 */
@Component({
  selector: 'app-appointment-form-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PanelModule,
    MenuModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './appointment-form-layout.component.html',
  styleUrls: ['./appointment-form-layout.component.scss'],
})
export class AppointmentFormLayoutComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public menuItems = signal<MenuItem[]>([]);
  public activeItem = signal<string>('client');
  public isEditMode = signal<boolean>(false);
  public appointmentId = signal<string | null>(null);

  ngOnInit(): void {
    this.initializeMenu();
    this.checkEditMode();
    this.updateActiveItem();
  }

  /**
   * Inicializa os itens do menu
   */
  private initializeMenu(): void {
    const baseRoute = this.isEditMode() ? '../' : '';

    this.menuItems.set([
      {
        label: 'Dados do Cliente',
        icon: 'pi pi-user',
        id: 'client',
        command: () => this.navigateTo('client'),
        styleClass: this.activeItem() === 'client' ? 'active-menu-item' : '',
      },
      {
        label: 'Agendamento',
        icon: 'pi pi-calendar',
        id: 'appointment',
        command: () => this.navigateTo('appointment'),
        styleClass: this.activeItem() === 'appointment' ? 'active-menu-item' : '',
      },
      {
        label: 'Serviços',
        icon: 'pi pi-briefcase',
        id: 'services',
        command: () => this.navigateTo('services'),
        styleClass: this.activeItem() === 'services' ? 'active-menu-item' : '',
      },
    ]);
  }

  /**
   * Verifica se está em modo de edição
   */
  private checkEditMode(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode.set(true);
        this.appointmentId.set(id);
      }
    });

    // Verifica também pela URL
    const url = this.router.url;
    this.isEditMode.set(url.includes('/edit/'));
  }

  /**
   * Atualiza o item ativo baseado na rota
   */
  private updateActiveItem(): void {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.includes('/client')) {
        this.activeItem.set('client');
      } else if (url.includes('/appointment')) {
        this.activeItem.set('appointment');
      } else if (url.includes('/services')) {
        this.activeItem.set('services');
      }
      this.initializeMenu(); // Atualiza as classes do menu
    });
  }

  /**
   * Navega para a rota especificada
   */
  private navigateTo(section: string): void {
    this.activeItem.set(section);

    if (this.isEditMode()) {
      const id = this.appointmentId();
      this.router.navigate([`/appointment/edit/${id}/${section}`]);
    } else {
      this.router.navigate([`/appointment/create/${section}`]);
    }
  }

  /**
   * Cancela e volta para listagem
   */
  public cancel(): void {
    this.router.navigate(['/appointment/list']);
  }

  /**
   * Retorna o título baseado no modo
   */
  public getTitle(): string {
    return this.isEditMode() ? 'Editar Agendamento' : 'Novo Agendamento';
  }
}
