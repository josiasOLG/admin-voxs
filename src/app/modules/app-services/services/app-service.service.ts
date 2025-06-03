import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpClient } from '../../../shared/http';
import {
  AppService,
  CreateActivityRequest,
  CreateAppServiceRequest,
  CreateCategoryRequest,
  IActivity,
  ICategory,
  UpdateActivityRequest,
  UpdateAppServiceRequest,
  UpdateCategoryRequest,
} from '../interfaces/app-service.interface';

@Injectable({
  providedIn: 'root',
})
export class AppServiceService {
  private readonly baseUrl = '/app-services';
  private readonly http = inject(CustomHttpClient);

  /**
   * Busca todos os app services cadastrados.
   *
   * @returns Observable com lista de app services.
   */
  public findAll(): Observable<AppService[]> {
    return this.http.get<AppService[]>(this.baseUrl);
  }

  /**
   * Busca um app service por ID.
   *
   * @param id Identificador do app service.
   * @returns Observable com dados do app service.
   */
  public findById(id: string): Observable<AppService> {
    return this.http.get<AppService>(`${this.baseUrl}/${id}`);
  }

  /**
   * Cria um novo app service.
   *
   * @param data Dados do app service a ser criado.
   * @returns Observable com app service criado.
   */
  public create(data: CreateAppServiceRequest): Observable<AppService> {
    return this.http.post<AppService>(this.baseUrl, data);
  }

  /**
   * Atualiza um app service existente.
   *
   * @param id Identificador do app service.
   * @param data Dados a serem atualizados.
   * @returns Observable com app service atualizado.
   */
  public update(
    id: string,
    data: UpdateAppServiceRequest
  ): Observable<AppService> {
    return this.http.put<AppService>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Remove um app service.
   *
   * @param id Identificador do app service.
   * @returns Observable de confirmação.
   */
  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Adiciona uma categoria ao app service.
   *
   * @param id Identificador do app service.
   * @param data Dados da categoria.
   * @returns Observable com categoria criada.
   */
  public addCategory(
    id: string,
    data: CreateCategoryRequest
  ): Observable<ICategory> {
    return this.http.post<ICategory>(`${this.baseUrl}/${id}/categories`, data);
  }

  /**
   * Atualiza uma categoria do app service.
   *
   * @param id Identificador do app service.
   * @param categoryId Identificador da categoria.
   * @param data Dados a serem atualizados.
   * @returns Observable com categoria atualizada.
   */
  public updateCategory(
    id: string,
    categoryId: string,
    data: UpdateCategoryRequest
  ): Observable<ICategory> {
    return this.http.put<ICategory>(
      `${this.baseUrl}/${id}/categories/${categoryId}`,
      data
    );
  }

  /**
   * Remove uma categoria do app service.
   *
   * @param id Identificador do app service.
   * @param categoryId Identificador da categoria.
   * @returns Observable de confirmação.
   */
  public removeCategory(id: string, categoryId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}/categories/${categoryId}`
    );
  }

  /**
   * Alterna o status ativo de uma categoria.
   *
   * @param id Identificador do app service.
   * @param categoryId Identificador da categoria.
   * @returns Observable com categoria atualizada.
   */
  public toggleCategoryActive(
    id: string,
    categoryId: string
  ): Observable<ICategory> {
    return this.http.patch<ICategory>(
      `${this.baseUrl}/${id}/categories/${categoryId}/toggle-active`,
      {}
    );
  }

  /**
   * Adiciona uma atividade ao app service.
   *
   * @param id Identificador do app service.
   * @param data Dados da atividade.
   * @returns Observable com atividade criada.
   */
  public addActivity(
    id: string,
    data: CreateActivityRequest
  ): Observable<IActivity> {
    return this.http.post<IActivity>(`${this.baseUrl}/${id}/activities`, data);
  }

  /**
   * Atualiza uma atividade do app service.
   *
   * @param id Identificador do app service.
   * @param activityId Identificador da atividade.
   * @param data Dados a serem atualizados.
   * @returns Observable com atividade atualizada.
   */
  public updateActivity(
    id: string,
    activityId: string,
    data: UpdateActivityRequest
  ): Observable<IActivity> {
    return this.http.put<IActivity>(
      `${this.baseUrl}/${id}/activities/${activityId}`,
      data
    );
  }

  /**
   * Remove uma atividade do app service.
   *
   * @param id Identificador do app service.
   * @param activityId Identificador da atividade.
   * @returns Observable de confirmação.
   */
  public removeActivity(id: string, activityId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}/activities/${activityId}`
    );
  }

  /**
   * Alterna o status ativo de uma atividade.
   *
   * @param id Identificador do app service.
   * @param activityId Identificador da atividade.
   * @returns Observable com atividade atualizada.
   */
  public toggleActivityActive(
    id: string,
    activityId: string
  ): Observable<IActivity> {
    return this.http.patch<IActivity>(
      `${this.baseUrl}/${id}/activities/${activityId}/toggle-active`,
      {}
    );
  }
}
