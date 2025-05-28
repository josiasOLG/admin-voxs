import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  public canActivate(): Observable<boolean | UrlTree> {
    if (!this.authService.isAuthenticated) {
      return of(true);
    }

    return this.authService.checkAuthenticationStatus().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return this.router.createUrlTree(['/dashboard']);
        }
        return true;
      }),
      catchError(() => {
        return of(true);
      })
    );
  }
}
