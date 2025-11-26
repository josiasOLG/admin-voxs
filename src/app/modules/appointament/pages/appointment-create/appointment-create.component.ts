import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { SharedHeaderComponent } from '../../../../shared/components/shared-header';

/**
 * Componente para criação de agendamento com menu lateral
 */
@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    PanelModule,
    MenuModule,
    ButtonModule,
    ToastModule,
    SharedHeaderComponent,
  ],
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppointmentCreateComponent implements OnInit {
  private router = inject(Router);

  public menuItems = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.initializeMenu();
  }

  /**
   * Inicializa os itens do menu
   */
  private initializeMenu(): void {
    this.menuItems.set([
      {
        label: 'Dados do Cliente',
        icon: 'pi pi-user',
        routerLink: '/appointment/create/client',
      },
      {
        label: 'Agendamento',
        icon: 'pi pi-calendar',
        routerLink: '/appointment/create/appointment',
      },
      {
        label: 'Serviços',
        icon: 'pi pi-briefcase',
        routerLink: '/appointment/create/services',
      },
    ]);
  }

  /**
   * Cancela e volta para listagem
   */
  public cancel(): void {
    this.router.navigate(['/appointment/list']);
  }
}
