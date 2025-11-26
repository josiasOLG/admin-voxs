import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserRoles } from '../../../shared/enums/user-roles.enum';
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
  private readonly http = inject(CustomHttpClient);
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly COOKIE_OPTIONS = {
    path: '/',
    secure: false,
    sameSite: 'Lax' as const,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  // ==================== LOGIN ====================
  public login(credentials: LoginRequest): Observable<LoginResponse> {
    this.loadingSubject.next(true);

    return this.httpClient
      .post<LoginResponse>(`${environment.apiUrl}/login`, credentials, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<LoginResponse>) => {
          const accessToken = response.headers.get('access-token');
          const refreshToken = response.headers.get('refresh-token');
          const body = response.body!;

          // Salva tokens nos cookies
          this.cookieService.set('accessToken', accessToken!, this.COOKIE_OPTIONS);
          this.cookieService.set('refreshToken', refreshToken!, this.COOKIE_OPTIONS);
          this.cookieService.set('userId', body.id, this.COOKIE_OPTIONS);

          // Cria e salva usuário
          const user: User = {
            id: body.id,
            active: body.active,
            code: body.code,
            email: body.email,
            username: body.username,
            points: body.points,
            type: body.type || 'USER', // Default para USER se não vier
            service: body.service,
            image: body.image,
            certificacoes: body.certificacoes,
            descricao: body.descricao,
            endTime: body.endTime,
            startTime: body.startTime,
            lunchEndTime: body.lunchEndTime,
            lunchStartTime: body.lunchStartTime,
          };

          this.currentUserSubject.next(user);
          this.cookieService.set('user', JSON.stringify(user), this.COOKIE_OPTIONS);

          this.toastService.success('Login realizado', body.message);
          this.loadingSubject.next(false);

          // Navega usando window.location para forçar refresh
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 100);
        }),
        catchError((error) => {
          this.loadingSubject.next(false);
          this.toastService.error('Erro no login', error.error?.error || 'Erro inesperado');
          return throwError(() => error);
        }),
        map((response) => response.body!)
      );
  }

  // ==================== LOGOUT ====================
  public logout(): void {
    this.cookieService.deleteAll('/');
    this.currentUserSubject.next(null);
    window.location.href = '/auth/login';
  }

  // ==================== VERIFICAÇÃO ====================
  public isAuthenticated(): boolean {
    const hasToken = !!this.cookieService.get('accessToken');
    const hasUser = !!this.currentUserSubject.value;
    return hasToken && hasUser;
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ==================== RECUPERAÇÃO DE SENHA ====================
  public register(userData: RegisterRequest): Observable<RegisterResponse> {
    this.loadingSubject.next(true);
    return this.http.post<RegisterResponse>('/register', userData).pipe(
      tap((response) => {
        this.toastService.success('Registro realizado', response.message);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.toastService.error('Erro no registro', error.error?.error || 'Erro inesperado');
        return throwError(() => error);
      })
    );
  }

  public refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.cookieService.get('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokenResponse>('/refresh-token', { refreshToken }).pipe(
      tap((response) => {
        this.cookieService.set('accessToken', response.accessToken, this.COOKIE_OPTIONS);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  public recoverPassword(email: RecoverPasswordRequest): Observable<RecoverPasswordResponse> {
    this.loadingSubject.next(true);
    return this.http.post<RecoverPasswordResponse>('/recover-password', email).pipe(
      tap((response) => {
        this.toastService.success('Email enviado', response.message);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.toastService.error('Erro na recuperação', error.error?.error || 'Erro inesperado');
        return throwError(() => error);
      })
    );
  }

  public sendVerificationCode(email: SendVerificationCodeRequest): Observable<SendVerificationCodeResponse> {
    this.loadingSubject.next(true);
    return this.http.post<SendVerificationCodeResponse>('/send-verification-code', email).pipe(
      tap((response) => {
        this.toastService.success('Código enviado', response.message);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.toastService.error('Erro ao enviar código', error.error?.error || 'Erro inesperado');
        return throwError(() => error);
      })
    );
  }

  public validateCode(data: ValidateCodeRequest): Observable<ValidateCodeResponse> {
    this.loadingSubject.next(true);
    return this.http.post<ValidateCodeResponse>('/validate-code', data).pipe(
      tap((response) => {
        this.toastService.success('Código validado', response.message);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.toastService.error('Código inválido', error.error?.error || 'Erro inesperado');
        return throwError(() => error);
      })
    );
  }

  public resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    this.loadingSubject.next(true);
    return this.http.post<ResetPasswordResponse>('/reset-password', data).pipe(
      tap((response) => {
        this.toastService.success('Senha redefinida', response.message);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.loadingSubject.next(false);
        this.toastService.error('Erro ao redefinir senha', error.error?.error || 'Erro inesperado');
        return throwError(() => error);
      })
    );
  }

  // ==================== ROLES ====================
  public hasRole(role: UserRoles): boolean {
    const user = this.getCurrentUser();
    return user?.type === role;
  }

  public hasAnyRole(requiredRoles: (UserRoles | string)[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.type) return false;
    return requiredRoles.includes(user.type as UserRoles);
  }

  public hasAllRoles(requiredRoles: (UserRoles | string)[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.type) return false;
    return requiredRoles.length === 1 && requiredRoles.includes(user.type as UserRoles);
  }

  // ==================== PRIVATE ====================
  private loadUserFromStorage(): void {
    if (typeof window === 'undefined') return;

    const userStr = this.cookieService.get('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('[AuthService] Error parsing user from storage');
      }
    }
  }
}
