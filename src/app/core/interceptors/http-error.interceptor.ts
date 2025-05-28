import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private toast = inject(ToastService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const status = error.status;
        const url = req.url;
        const method = req.method;
        const message = this.extractMessage(error);

        switch (status) {
          case 0:
            this.toast.error(
              'Erro de conexão',
              'Servidor inativo ou sem internet'
            );
            break;
          case 500:
            this.toast.error(
              'Erro interno',
              message ?? 'Estamos enfrentando instabilidades'
            );
            break;
          case 404:
            this.toast.warn(
              'Não encontrado',
              message ?? 'O recurso requisitado não existe'
            );
            break;
          case 400:
            this.toast.warn(
              'Requisição inválida',
              message ?? 'Dados inválidos'
            );
            break;
          case 401:
            this.toast.warn(
              'Não autorizado',
              message ?? 'Faça login para continuar'
            );
            break;
          case 403:
            this.toast.warn(
              'Acesso negado',
              message ?? 'Você não tem permissão para isso'
            );
            break;
        }

        console.warn(`[HTTP ERROR] ${method} ${url} [${status}]`, error);
        return throwError(() => error);
      })
    );
  }

  private extractMessage(error: HttpErrorResponse): string | null {
    const res = error.error;

    if (!res || typeof res !== 'object') return null;

    if (typeof res.message === 'string') {
      return res.message;
    }

    if (
      res.data &&
      typeof res.data === 'object' &&
      typeof res.data.message === 'string'
    ) {
      return res.data.message;
    }

    return null;
  }
}
