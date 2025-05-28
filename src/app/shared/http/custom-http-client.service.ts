import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, tap, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoadingService } from '../services';
import { HttpMethod, HttpRequestOptions } from './http.types';

@Injectable({ providedIn: 'root' })
export class CustomHttpClient {
  private readonly http = inject(HttpClient);
  private readonly loadingService = inject(LoadingService);
  private readonly apiBaseUrl = environment.apiUrl;

  public request<T = any>(
    method: HttpMethod,
    url: string,
    options: HttpRequestOptions<T> = {}
  ): Observable<T> {
    const fullUrl = this.resolveUrl(url);
    const params = new HttpParams({ fromObject: options.params || {} });

    const useLoading = options.disableLoading !== true;
    if (useLoading) this.loadingService.show();

    // Configuração sem headers vazios
    const httpOptions: { [key: string]: any } = {
      params,
      responseType: options.responseType ?? 'json',
      observe: options.observe ?? 'body',
    };

    // Só adiciona body se for método que aceita
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      httpOptions['body'] = options.body;
    }

    // Só adiciona headers se foram explicitamente fornecidos
    if (options.headers && Object.keys(options.headers).length > 0) {
      httpOptions['headers'] = new HttpHeaders(options.headers);
      console.log(
        '[CustomHttpClient] Adicionando headers customizados:',
        options.headers
      );
    } else {
      console.log(
        '[CustomHttpClient] Sem headers - deixando interceptor adicionar auth'
      );
    }

    // Usar métodos específicos baseados no HTTP method
    let request$: Observable<any>;

    switch (method) {
      case 'GET':
        request$ = this.http.get<T>(fullUrl, httpOptions);
        break;
      case 'POST':
        request$ = this.http.post<T>(fullUrl, options.body, httpOptions);
        break;
      case 'PUT':
        request$ = this.http.put<T>(fullUrl, options.body, httpOptions);
        break;
      case 'PATCH':
        request$ = this.http.patch<T>(fullUrl, options.body, httpOptions);
        break;
      case 'DELETE':
        request$ = this.http.delete<T>(fullUrl, httpOptions);
        break;
      default:
        throw new Error(`Método HTTP não suportado: ${method}`);
    }

    return request$.pipe(
      timeout(options.timeout ?? environment.timeout ?? 10000),
      tap(() => {}),
      catchError((err) => {
        console.error(`[HTTP][${method}]`, fullUrl, err);
        throw err;
      }),
      finalize(() => {
        if (useLoading) this.loadingService.hide();
      })
    );
  }

  public get<T>(url: string, options?: HttpRequestOptions<T>): Observable<T> {
    return this.request<T>('GET', url, options);
  }

  public post<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions<T>
  ): Observable<T> {
    return this.request<T>('POST', url, { ...options, body });
  }

  public put<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions<T>
  ): Observable<T> {
    return this.request<T>('PUT', url, { ...options, body });
  }

  public patch<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions<T>
  ): Observable<T> {
    return this.request<T>('PATCH', url, { ...options, body });
  }

  public delete<T>(
    url: string,
    options?: HttpRequestOptions<T>
  ): Observable<T> {
    return this.request<T>('DELETE', url, options);
  }

  public createDomainClient(domain: string) {
    const prefix = `/${domain}`;
    return {
      get: <T>(path: string, options?: HttpRequestOptions<T>): Observable<T> =>
        this.get<T>(`${prefix}${path}`, options),
      post: <T>(
        path: string,
        body: any,
        options?: HttpRequestOptions<T>
      ): Observable<T> => this.post<T>(`${prefix}${path}`, body, options),
      put: <T>(
        path: string,
        body: any,
        options?: HttpRequestOptions<T>
      ): Observable<T> => this.put<T>(`${prefix}${path}`, body, options),
      patch: <T>(
        path: string,
        body: any,
        options?: HttpRequestOptions<T>
      ): Observable<T> => this.patch<T>(`${prefix}${path}`, body, options),
      delete: <T>(
        path: string,
        options?: HttpRequestOptions<T>
      ): Observable<T> => this.delete<T>(`${prefix}${path}`, options),
    };
  }

  private resolveUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${this.apiBaseUrl}${path}`;
  }
}
