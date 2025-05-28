import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomHttpClient } from '../../../shared/http/custom-http-client.service';
import { ToastService } from '../../../shared/services/toast.service';
import {
  LoginRequest,
  LoginResponse,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  User,
  ValidateCodeRequest,
  ValidateCodeResponse,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(CustomHttpClient);
  private httpClient = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private readonly COOKIE_OPTIONS = {
    path: '/',
    secure: false,
    sameSite: 'Lax' as const,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    if (typeof window === 'undefined') return;

    const savedUser = this.getUserFromCookie();
    const hasValidTokens = this.hasValidTokens();

    if (savedUser && hasValidTokens) {
      this.currentUserSubject.next(savedUser);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.clearAuthData();
    }
  }

  private setAuthenticatedUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.saveUserToCookie(user);
  }

  private saveUserToCookie(user: User): void {
    if (typeof window === 'undefined') return;
    this.cookieService.set(
      'auth_user',
      JSON.stringify(user),
      this.COOKIE_OPTIONS
    );
    this.cookieService.set('auth_status', 'true', this.COOKIE_OPTIONS);
  }

  private getUserFromCookie(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const userStr = this.cookieService.get('auth_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private hasValidTokens(): boolean {
    if (typeof window === 'undefined') return false;

    const accessToken = this.cookieService.get('accessToken');
    const refreshToken = this.cookieService.get('refreshToken');
    const userId = this.cookieService.get('userId');
    const authStatus = this.cookieService.get('auth_status');

    return !!(accessToken || refreshToken) && !!userId && authStatus === 'true';
  }

  private saveTokensToCookie(
    accessToken?: string,
    refreshToken?: string
  ): void {
    if (typeof window === 'undefined') return;

    if (accessToken) {
      this.cookieService.set('accessToken', accessToken, this.COOKIE_OPTIONS);
      console.log(
        '[AuthService] ✅ Salvando accessToken nos cookies:',
        accessToken.substring(0, 20) + '...'
      );
    }

    if (refreshToken) {
      this.cookieService.set('refreshToken', refreshToken, this.COOKIE_OPTIONS);
      console.log(
        '[AuthService] ✅ Salvando refreshToken nos cookies:',
        refreshToken.substring(0, 20) + '...'
      );
    }
  }

  public login(credentials: LoginRequest): Observable<LoginResponse> {
    this.loadingSubject.next(true);

    return this.httpClient
      .post<LoginResponse>(`${environment.apiUrl}/login`, credentials, {
        observe: 'response',
      })
      .pipe(
        tap((response: HttpResponse<LoginResponse>) => {
          console.log(
            '[AuthService] Response headers:',
            response.headers.keys()
          );

          const accessToken = response.headers.get('access-token');
          const refreshToken = response.headers.get('refresh-token');

          console.log(
            '[AuthService] Access token capturado:',
            accessToken ? accessToken.substring(0, 20) + '...' : 'NENHUM'
          );
          console.log(
            '[AuthService] Refresh token capturado:',
            refreshToken ? refreshToken.substring(0, 20) + '...' : 'NENHUM'
          );

          if (accessToken && refreshToken) {
            this.saveTokensToCookie(accessToken, refreshToken);
          } else {
            console.log(
              '[AuthService] ❌ Tokens não encontrados nos headers da resposta'
            );
          }

          if (response.body) {
            this.handleAuthSuccess(response.body);
            this.toastService.success('Login realizado', response.body.message);
          }
        }),
        catchError((error) => {
          this.toastService.error(
            'Erro no login',
            error.error?.error || 'Erro inesperado'
          );
          return throwError(() => error);
        }),
        map((response: HttpResponse<LoginResponse>) => {
          this.loadingSubject.next(false);
          return response.body!;
        })
      );
  }

  public register(userData: RegisterRequest): Observable<RegisterResponse> {
    this.loadingSubject.next(true);

    return this.http.post<RegisterResponse>('/register', userData).pipe(
      tap((response) => {
        this.toastService.success('Registro realizado', response.message);
      }),
      catchError((error) => {
        this.toastService.error(
          'Erro no registro',
          error.error?.error || 'Erro inesperado'
        );
        return throwError(() => error);
      }),
      map((response) => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  public refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.cookieService.get('refreshToken');

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<RefreshTokenResponse>('/refresh-token', { refreshToken })
      .pipe(
        tap((response) => {
          this.saveTokensToCookie(response.accessToken);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  public recoverPassword(
    email: RecoverPasswordRequest
  ): Observable<RecoverPasswordResponse> {
    this.loadingSubject.next(true);

    return this.http
      .post<RecoverPasswordResponse>('/recover-password', email)
      .pipe(
        tap((response) => {
          this.toastService.success('Email enviado', response.message);
        }),
        catchError((error) => {
          this.toastService.error(
            'Erro na recuperação',
            error.error?.error || 'Erro inesperado'
          );
          return throwError(() => error);
        }),
        map((response) => {
          this.loadingSubject.next(false);
          return response;
        })
      );
  }

  public sendVerificationCode(
    email: SendVerificationCodeRequest
  ): Observable<SendVerificationCodeResponse> {
    this.loadingSubject.next(true);

    return this.http
      .post<SendVerificationCodeResponse>('/send-verification-code', email)
      .pipe(
        tap((response) => {
          this.toastService.success('Código enviado', response.message);
        }),
        catchError((error) => {
          this.toastService.error(
            'Erro ao enviar código',
            error.error?.error || 'Erro inesperado'
          );
          return throwError(() => error);
        }),
        map((response) => {
          this.loadingSubject.next(false);
          return response;
        })
      );
  }

  public validateCode(
    data: ValidateCodeRequest
  ): Observable<ValidateCodeResponse> {
    this.loadingSubject.next(true);

    return this.http.post<ValidateCodeResponse>('/validate-code', data).pipe(
      tap((response) => {
        this.toastService.success('Código validado', response.message);
      }),
      catchError((error) => {
        this.toastService.error(
          'Código inválido',
          error.error?.error || 'Erro inesperado'
        );
        return throwError(() => error);
      }),
      map((response) => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  public resetPassword(
    data: ResetPasswordRequest
  ): Observable<ResetPasswordResponse> {
    this.loadingSubject.next(true);

    return this.http.post<ResetPasswordResponse>('/reset-password', data).pipe(
      tap((response) => {
        this.toastService.success('Senha redefinida', response.message);
      }),
      catchError((error) => {
        this.toastService.error(
          'Erro ao redefinir senha',
          error.error?.error || 'Erro inesperado'
        );
        return throwError(() => error);
      }),
      map((response) => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  public checkAuthenticationStatus(): Observable<boolean> {
    if (typeof window === 'undefined') {
      return of(false);
    }

    if (!this.hasValidTokens()) {
      this.clearAuthData();
      return of(false);
    }

    // Se tem tokens válidos e usuário salvo, está autenticado
    const savedUser = this.getUserFromCookie();
    if (savedUser) {
      this.setAuthenticatedUser(savedUser);
      return of(true);
    }

    this.clearAuthData();
    return of(false);
  }

  public logout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
    this.toastService.success(
      'Logout realizado',
      'Você foi desconectado com sucesso'
    );
  }

  private handleAuthSuccess(response: LoginResponse): void {
    if (typeof window === 'undefined') return;

    // Salvamos o ID do usuário nos cookies - pode ser user_id ou id dependendo do backend
    const userIdForCookie = response.user_id || response.id;
    this.cookieService.set('userId', userIdForCookie, this.COOKIE_OPTIONS);

    console.log('[AuthService] Salvando userId nos cookies:', userIdForCookie);
    console.log('[AuthService] Response completa:', response);

    const user: User = {
      id: response.id,
      active: response.active,
      code: response.code,
      email: response.email,
      username: response.username,
      points: response.points,
      type: response.type,
      service: response.service,
      image: response.image,
      certificacoes: response.certificacoes,
      descricao: response.descricao,
      endTime: response.endTime,
      startTime: response.startTime,
      lunchEndTime: response.lunchEndTime,
      lunchStartTime: response.lunchStartTime,
    };

    this.setAuthenticatedUser(user);
    this.router.navigate(['/dashboard']);
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      this.cookieService.delete('accessToken', '/');
      this.cookieService.delete('refreshToken', '/');
      this.cookieService.delete('userId', '/');
      this.cookieService.delete('auth_user', '/');
      this.cookieService.delete('auth_status', '/');
    }

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return this.isAuthenticatedSubject.value;
    }

    const internalState = this.isAuthenticatedSubject.value;
    const hasTokens = this.hasValidTokens();

    return internalState && hasTokens;
  }

  public get isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
