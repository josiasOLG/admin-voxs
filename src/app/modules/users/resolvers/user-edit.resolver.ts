import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

/**
 * Resolver para carregar dados do usuário na edição.
 *
 * @param route Rota ativa.
 * @returns Observable com dados do usuário ou null em caso de erro.
 */
export const userEditResolver: ResolveFn<User | null> = (route) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  return userService.findById(id).pipe(
    map((response) => response),
    catchError(() => of(null))
  );
};
