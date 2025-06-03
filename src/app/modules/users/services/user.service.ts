import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomHttpClient } from '../../../shared/http';
import {
  CreateUserAddressRequest,
  CreateUserRequest,
  UpdateUserAddressRequest,
  UpdateUserRequest,
  User,
  UserAddress,
} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = '/users';
  private readonly http = inject(CustomHttpClient);

  /**
   * Busca todos os usuários cadastrados.
   *
   * @returns Observable com lista de usuários.
   */
  public findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  /**
   * Busca um usuário por ID.
   *
   * @param id Identificador do usuário.
   * @returns Observable com dados do usuário.
   */
  public findById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/admin/${id}`);
  }

  /**
   * Cria um novo usuário.
   *
   * @param data Dados do usuário a ser criado.
   * @returns Observable com usuário criado.
   */
  public create(data: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.baseUrl, data);
  }

  /**
   * Atualiza um usuário existente.
   *
   * @param id Identificador do usuário.
   * @param data Dados a serem atualizados.
   * @returns Observable com usuário atualizado.
   */
  public update(id: string, data: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Remove um usuário.
   *
   * @param id Identificador do usuário.
   * @returns Observable de confirmação.
   */
  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Busca o endereço de um usuário.
   *
   * @param userId Identificador do usuário.
   * @returns Observable com endereço do usuário.
   */
  public getUserAddress(userId: string): Observable<UserAddress> {
    return this.http.get<UserAddress>(`${this.baseUrl}/${userId}/address`);
  }

  /**
   * Cria ou atualiza o endereço de um usuário.
   *
   * @param userId Identificador do usuário.
   * @param data Dados do endereço.
   * @returns Observable com endereço criado/atualizado.
   */
  public createOrUpdateAddress(
    userId: string,
    data: CreateUserAddressRequest | UpdateUserAddressRequest
  ): Observable<UserAddress> {
    return this.http.put<UserAddress>(
      `${this.baseUrl}/${userId}/address`,
      data
    );
  }
}
