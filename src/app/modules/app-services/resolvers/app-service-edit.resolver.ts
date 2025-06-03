import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../interfaces/app-service.interface';
import { AppServiceService } from '../services/app-service.service';

/**
 * Resolver para buscar dados do app service na edição.
 *
 * @param route Rota ativa.
 * @returns Observable com dados do app service.
 */
export const appServiceEditResolver: ResolveFn<AppService> = (
  route
): Observable<AppService> => {
  const appServiceService = inject(AppServiceService);
  const id = route.paramMap.get('id');

  if (!id) {
    throw new Error('ID do app service não encontrado na rota');
  }

  return appServiceService.findById(id);
};
