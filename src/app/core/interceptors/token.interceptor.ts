import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private cookieService = inject(CookieService);

  private readonly COOKIE_OPTIONS = {
    path: '/',
    secure: false,
    sameSite: 'Lax' as const,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const accessToken = event.headers.get('x-access-token');
          const refreshToken = event.headers.get('x-refresh-token');

          if (accessToken) {
            this.cookieService.set(
              'accessToken',
              accessToken,
              this.COOKIE_OPTIONS
            );
          }

          if (refreshToken) {
            this.cookieService.set(
              'refreshToken',
              refreshToken,
              this.COOKIE_OPTIONS
            );
          }
        }
      })
    );
  }
}
