import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { SharedHeaderComponent } from '../../../../shared/components/shared-header';

/**
 * Componente para edição de agendamento com menu lateral
 */
@Component({
  selector: 'app-appointment-edit',
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
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppointmentEditComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public menuItems = signal<MenuItem[]>([]);
  public appointmentId = signal<string | null>(null);

  ngOnInit(): void {
    // Captura o ID da rota
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.appointmentId.set(id);
        this.initializeMenu();
      }
    });
  }

  /**
   * Inicializa os itens do menu
   */
  private initializeMenu(): void {
    const id = this.appointmentId();

    this.menuItems.set([
      {
        label: 'Dados do Cliente',
        icon: 'pi pi-user',
        routerLink: `/appointment/edit/${id}/client`,
      },
      {
        label: 'Agendamento',
        icon: 'pi pi-calendar',
        routerLink: `/appointment/edit/${id}/appointment`,
      },
      {
        label: 'Serviços',
        icon: 'pi pi-briefcase',
        routerLink: `/appointment/edit/${id}/services`,
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
