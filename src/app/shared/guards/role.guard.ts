import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../../modules/auth/services/auth.service';
import { UserRoles } from '../enums';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as (UserRoles | string)[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Se não há roles definidas, permite acesso
    }

    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const hasPermission = this.authService.hasAnyRole(requiredRoles);

    if (!hasPermission) {
      this.toast.error(
        'Acesso Negado',
        'Você não tem permissão para acessar esta página'
      );
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
