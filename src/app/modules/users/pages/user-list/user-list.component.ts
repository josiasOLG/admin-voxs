import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import {
  BaseResourceComponent,
  SharedHeaderComponent,
} from '../../../../shared/components';
import { UserRoles } from '../../../../shared/enums';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    ToolbarModule,
    TooltipModule,
    SharedHeaderComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent extends BaseResourceComponent implements OnInit {
  readonly users = signal<User[]>([]);

  constructor(private readonly userService: UserService) {
    super();
  }

  public ngOnInit(): void {
    this.setTitle('Usuários', 'Gerenciamento de usuários do sistema');
    this.setBreadcrumb([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Usuários' },
    ]);
    this.loadUsers();
  }

  /**
   * Carrega a lista de usuários.
   */
  private loadUsers(): void {
    this.startLoading();

    this.userService.findAll().subscribe({
      next: (response) => {
        this.users.set(response);
        this.stopLoading();
      },
      error: (error) => {
        this.showError('Erro ao carregar usuários', error.message);
        this.stopLoading();
      },
    });
  }

  /**
   * Retorna o label do role do usuário.
   *
   * @param role Role do usuário.
   * @returns Label formatado.
   */
  public getRoleLabel(role: UserRoles, typeService: string): string {
    const labels = {
      [UserRoles.ADMIN]: 'Administrador',
      [UserRoles.BARBER]: 'Barbeiro',
      [UserRoles.USER]: 'Cliente',
    };
    return labels[role] || typeService;
  }

  /**
   * Retorna a severidade da tag do role.
   *
   * @param role Role do usuário.
   * @returns Severidade da tag.
   */
  public getRoleSeverity(role: UserRoles): string {
    const severities = {
      [UserRoles.ADMIN]: 'danger',
      [UserRoles.BARBER]: 'warning',
      [UserRoles.USER]: 'info',
    };
    return severities[role] || 'secondary';
  }
}
