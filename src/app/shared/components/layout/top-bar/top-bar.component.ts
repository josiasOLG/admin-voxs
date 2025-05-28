import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { Subscription } from 'rxjs';
import { User } from '../../../../modules/auth/interfaces/auth.interface';
import { AuthService } from '../../../../modules/auth/services/auth.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
  ],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  public userMenuItems: MenuItem[] = [];
  public currentUser: User | null = null;
  private authService = inject(AuthService);
  private subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setupUserMenu();

    // Subscribe to user changes to update menu dynamically
    this.subscription.add(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
        this.setupUserMenu();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Configura o menu do usuário (dropdown)
   */
  private setupUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        command: () => {
          // Navegar para perfil do usuário
          this.router.navigate(['/profile']);
        },
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];
  }

  /**
   * Realiza o logout do usuário
   */
  public logout(): void {
    this.authService.logout();
  }
}
