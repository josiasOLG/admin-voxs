import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { ProfessionalProfile, ModuleConfig, CustomField, TerminologyItem } from '../interfaces';
import { ProfessionalType } from '../enums';
import { getProfessionalTemplate } from '../templates';

/**
 * Service responsável pelo gerenciamento de perfis profissionais.
 * Gerencia a configuração, personalização e persistência de perfis.
 *
 * Features:
 * - Gestão de perfis profissionais com signals
 * - Templates pré-configurados por profissão
 * - Personalização de branding e terminologia
 * - Gestão de módulos e funcionalidades
 * - Campos customizados por entidade
 * - Cache local de configurações
 */
@Injectable({
  providedIn: 'root',
})
export class ProfessionalProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/professional-profiles';

  // Signals reativos
  private readonly currentProfileSignal = signal<ProfessionalProfile | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // Computeds
  public readonly currentProfile = this.currentProfileSignal.asReadonly();
  public readonly isLoading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  // Computed properties úteis
  public readonly professionalType = computed(() =>
    this.currentProfileSignal()?.type || ProfessionalType.CUSTOM
  );

  public readonly branding = computed(() =>
    this.currentProfileSignal()?.branding
  );

  public readonly terminology = computed(() =>
    this.currentProfileSignal()?.terminology
  );

  public readonly enabledModules = computed(() =>
    this.currentProfileSignal()?.modules.filter(m => m.enabled) || []
  );

  public readonly customFields = computed(() =>
    this.currentProfileSignal()?.customFields || []
  );

  public readonly settings = computed(() =>
    this.currentProfileSignal()?.settings
  );

  public readonly isRegulated = computed(() =>
    !!this.currentProfileSignal()?.regulation
  );

  constructor() {
    this.loadProfileFromStorage();
  }

  /**
   * Carrega o perfil profissional do backend.
   * @param userId ID do usuário
   * @returns Observable com o perfil
   */
  public loadProfile(userId: string): Observable<ProfessionalProfile> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<ProfessionalProfile>(`${this.apiUrl}/${userId}`).pipe(
      tap(profile => {
        this.currentProfileSignal.set(profile);
        this.saveProfileToStorage(profile);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao carregar perfil profissional');
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  /**
   * Cria um novo perfil profissional baseado em um template.
   * @param type Tipo de profissional
   * @param userId ID do usuário
   * @returns Observable com o perfil criado
   */
  public createProfileFromTemplate(
    type: ProfessionalType,
    userId: string
  ): Observable<ProfessionalProfile> {
    const template = getProfessionalTemplate(type);
    const newProfile: Partial<ProfessionalProfile> = {
      ...template,
      id: `profile-${userId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.loadingSignal.set(true);

    return this.http.post<ProfessionalProfile>(this.apiUrl, newProfile).pipe(
      tap(profile => {
        this.currentProfileSignal.set(profile);
        this.saveProfileToStorage(profile);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Erro ao criar perfil profissional');
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  /**
   * Atualiza o perfil profissional.
   * @param updates Atualizações parciais do perfil
   * @returns Observable com o perfil atualizado
   */
  public updateProfile(
    updates: Partial<ProfessionalProfile>
  ): Observable<ProfessionalProfile> {
    const currentProfile = this.currentProfileSignal();
    if (!currentProfile) {
      throw new Error('Nenhum perfil carregado');
    }

    const updatedProfile: ProfessionalProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date(),
    };

    this.loadingSignal.set(true);

    return this.http
      .put<ProfessionalProfile>(`${this.apiUrl}/${currentProfile.id}`, updatedProfile)
      .pipe(
        tap(profile => {
          this.currentProfileSignal.set(profile);
          this.saveProfileToStorage(profile);
          this.loadingSignal.set(false);
        }),
        catchError(error => {
          this.errorSignal.set('Erro ao atualizar perfil');
          this.loadingSignal.set(false);
          throw error;
        })
      );
  }

  /**
   * Atualiza as configurações de branding.
   * @param branding Novas configurações de branding
   */
  public updateBranding(branding: Partial<ProfessionalProfile['branding']>): Observable<ProfessionalProfile> {
    const currentProfile = this.currentProfileSignal();
    if (!currentProfile) {
      throw new Error('Nenhum perfil carregado');
    }

    return this.updateProfile({
      branding: { ...currentProfile.branding, ...branding },
    });
  }

  /**
   * Atualiza a terminologia.
   * @param terminology Nova terminologia
   */
  public updateTerminology(
    terminology: Partial<ProfessionalProfile['terminology']>
  ): Observable<ProfessionalProfile> {
    const currentProfile = this.currentProfileSignal();
    if (!currentProfile) {
      throw new Error('Nenhum perfil carregado');
    }

    return this.updateProfile({
      terminology: { ...currentProfile.terminology, ...terminology },
    });
  }

  /**
   * Habilita ou desabilita um módulo.
   * @param moduleId ID do módulo
   * @param enabled Status
   */
  public toggleModule(moduleId: string, enabled: boolean): Observable<ProfessionalProfile> {
    const currentProfile = this.currentProfileSignal();
    if (!currentProfile) {
      throw new Error('Nenhum perfil carregado');
    }

    const modules = currentProfile.modules.map(m =>
      m.moduleId === moduleId ? { ...m, enabled } : m
    );

    return this.updateProfile({ modules });
  }

  /**
   * Atualiza a configuração de um módulo.
   * @param moduleId ID do módulo
   * @param config Nova configuração
   */
  public updateModuleConfig(
    moduleId: string,
    config: Partial<ModuleConfig>
  ): Observable<ProfessionalProfile> {
    const currentProfile = this.currentProfileSignal();
    if (!currentProfile) {
      throw new Error('Nenhum perfil carregado');
    }

    const modules = currentProfile.modules.map(m =>
      m.moduleId === moduleId ? { ...m, ...config } : m
    );

    return this.updateProfile({ modules });
  }

  /**
   * Adiciona um campo customizado.
   * @param field Campo a adicionar
   */
  public addCustomField(field: CustomField): Observable<ProfessionalProfile> {
    const currentProfile = this.currentProfileSignal();
    if (!currentProfile) {
      throw new Error('Nenhum perfil carregado');
    }

    const customFields = [...currentProfile.customFields, field];
    return this.updateProfile({ customFields });
  }

  /**
   * Remove um campo customizado.
   * @param fieldId ID do campo
   */
  public removeCustomField(fieldId: string): Observable<ProfessionalProfile> {
    const currentProfile = this.currentProfileSignal();
    if (!currentProfile) {
      throw new Error('Nenhum perfil carregado');
    }

    const customFields = currentProfile.customFields.filter(f => f.id !== fieldId);
    return this.updateProfile({ customFields });
  }

  /**
   * Obtém campos customizados de uma entidade específica.
   * @param entity Entidade (client, service, appointment, etc)
   * @returns Array de campos customizados
   */
  public getCustomFieldsByEntity(entity: string): CustomField[] {
    return this.customFields().filter(f => f.entity === entity);
  }

  /**
   * Obtém a configuração de um módulo específico.
   * @param moduleId ID do módulo
   * @returns Configuração do módulo ou undefined
   */
  public getModuleConfig(moduleId: string): ModuleConfig | undefined {
    return this.enabledModules().find(m => m.moduleId === moduleId);
  }

  /**
   * Verifica se um módulo está habilitado.
   * @param moduleId ID do módulo
   * @returns true se habilitado
   */
  public isModuleEnabled(moduleId: string): boolean {
    return this.enabledModules().some(m => m.moduleId === moduleId);
  }

  /**
   * Obtém o termo traduzido baseado na terminologia do perfil.
   * @param key Chave do termo (client, service, appointment, record)
   * @param plural Se deve retornar plural
   * @returns Termo traduzido
   */
  public getTerm(key: keyof ProfessionalProfile['terminology'], plural = false): string {
    const terminology = this.terminology();
    if (!terminology) {
      return key;
    }

    const term = terminology[key];

    // Se for string (caso 'professional')
    if (typeof term === 'string') {
      return term;
    }

    // Type guard para TerminologyItem
    const isTerminologyItem = (value: any): value is TerminologyItem => {
      return value && typeof value === 'object' && 'singular' in value && 'plural' in value;
    };

    // Se for TerminologyItem
    if (isTerminologyItem(term)) {
      return plural ? term.plural : term.singular;
    }

    return key;
  }

  /**
   * Salva o perfil no localStorage.
   * @param profile Perfil a salvar
   */
  private saveProfileToStorage(profile: ProfessionalProfile): void {
    try {
      localStorage.setItem('professional-profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Erro ao salvar perfil no localStorage:', error);
    }
  }

  /**
   * Carrega o perfil do localStorage.
   */
  private loadProfileFromStorage(): void {
    try {
      const stored = localStorage.getItem('professional-profile');
      if (stored) {
        const profile = JSON.parse(stored) as ProfessionalProfile;
        this.currentProfileSignal.set(profile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do localStorage:', error);
    }
  }

  /**
   * Limpa o perfil atual.
   */
  public clearProfile(): void {
    this.currentProfileSignal.set(null);
    localStorage.removeItem('professional-profile');
  }
}
