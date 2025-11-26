import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private cookieService = inject(CookieService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let modifiedReq = req;

    if (typeof window !== 'undefined') {
      const accessToken = this.cookieService.get('accessToken');
      const userId = this.cookieService.get('userId');
      const refreshToken = this.cookieService.get('refreshToken');

      if (accessToken) {
        modifiedReq = modifiedReq.clone({
          setHeaders: {
            Authorization: 'Bearer ' + accessToken,
            ...(userId && { 'x-user-id': userId }),
            ...(refreshToken && { 'x-refresh-token': refreshToken })
          }
        });
      }
    }

    return next.handle(modifiedReq);
  }
}
