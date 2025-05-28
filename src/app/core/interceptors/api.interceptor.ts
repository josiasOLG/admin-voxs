import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  private readonly COOKIE_OPTIONS = {
    path: '/',
    secure: false,
    sameSite: 'Lax' as const,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(
      '[ApiInterceptor] 🚀 INTERCEPTOR EXECUTADO para:',
      req.method,
      req.url
    );

    const modifiedReq = this.addAuthHeader(req);
    const startTime = Date.now();

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logRequestDuration(req, startTime);

        if (error.status === 401 && !this.isRefreshTokenRequest(req)) {
          return this.handle401Error(modifiedReq, next);
        }

        return throwError(() => error);
      }),
      finalize(() => {
        this.logRequestDuration(req, startTime);
      })
    );
  }

  private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    console.log('[ApiInterceptor] 🔍 addAuthHeader chamado para:', req.url);

    if (typeof window === 'undefined') {
      console.log(
        '[ApiInterceptor] ⚠️ Window undefined - executando no servidor'
      );
      return req;
    }

    console.log(
      '[ApiInterceptor] ✅ Executando no cliente - verificando cookies...'
    );

    const accessToken = this.cookieService.get('accessToken');
    const refreshToken = this.cookieService.get('refreshToken');
    const userId = this.cookieService.get('userId');

    console.log('[ApiInterceptor] 📋 Cookies encontrados:', {
      accessToken: accessToken
        ? `${accessToken.substring(0, 20)}...`
        : 'undefined',
      refreshToken: refreshToken ? 'presente' : 'undefined',
      userId: userId || 'undefined',
    });

    // Começamos com os headers existentes da requisição
    let headers = req.headers;

    if (accessToken) {
      headers = headers.set('Authorization', `Bearer ${accessToken}`);
      console.log(
        '[ApiInterceptor] ✅ Adicionando Bearer token:',
        accessToken.substring(0, 20) + '...'
      );
    } else {
      console.log(
        '[ApiInterceptor] ❌ Nenhum accessToken encontrado nos cookies'
      );
    }

    if (refreshToken) {
      headers = headers.set('x-refresh-token', refreshToken);
      console.log('[ApiInterceptor] ✅ Adicionando x-refresh-token');
    }

    if (userId) {
      headers = headers.set('x-user-id', userId);
      console.log('[ApiInterceptor] ✅ Adicionando x-user-id:', userId);
    } else {
      console.log('[ApiInterceptor] ❌ Nenhum userId encontrado nos cookies');
    }

    console.log(
      '[ApiInterceptor] Headers finais para',
      req.method,
      req.url,
      ':',
      {
        Authorization: headers.get('Authorization')
          ? 'Bearer ***'
          : 'undefined',
        'x-user-id': headers.get('x-user-id'),
        'x-refresh-token': headers.get('x-refresh-token') ? '***' : 'undefined',
      }
    );

    return req.clone({ headers });
  }

  private logRequestDuration(req: HttpRequest<any>, startTime: number): void {
    const duration = Date.now() - startTime;
    console.log(`[HTTP] ${req.method} ${req.url} - ${duration}ms`);

    if (duration > 5000) {
      console.warn(
        `[HTTP] Slow request detected: ${req.method} ${req.url} took ${duration}ms`
      );
    }
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.cookieService.get('refreshToken');

      if (refreshToken) {
        return this.refreshAccessToken(refreshToken).pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;

            if (response?.accessToken) {
              this.cookieService.set(
                'accessToken',
                response.accessToken,
                this.COOKIE_OPTIONS
              );
              this.refreshTokenSubject.next(response.accessToken);

              return next.handle(this.addAuthHeader(req));
            }

            return this.handleRefreshFailure();
          }),
          catchError((error) => {
            this.isRefreshing = false;
            return this.handleRefreshFailure();
          })
        );
      }

      return this.handleRefreshFailure();
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap(() => next.handle(this.addAuthHeader(req)))
    );
  }

  private refreshAccessToken(refreshToken: string): Observable<any> {
    const refreshUrl = `${environment.apiUrl}/refresh-token`;

    return new Observable((observer) => {
      fetch(refreshUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  private handleRefreshFailure(): Observable<never> {
    this.cookieService.delete('accessToken', '/');
    this.cookieService.delete('refreshToken', '/');
    this.cookieService.delete('userId', '/');

    this.router.navigate(['/auth/login']);

    return throwError(() => new Error('Token refresh failed'));
  }

  private isRefreshTokenRequest(req: HttpRequest<any>): boolean {
    return req.url.includes('/refresh-token');
  }
}
