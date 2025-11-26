import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { VeiculoService } from '../services/veiculo.service';

export const dashboardListResolver: ResolveFn<any> = () => {
  return inject(VeiculoService).getAll();
};

export const dashboardDetailResolver: ResolveFn<any> = (route, _state) => {
  const id = route.paramMap.get('id');
  return id ? inject(VeiculoService).getById(id) : of(null);
};

export const dashboardEditResolver: ResolveFn<any> = (route, _state) => {
  const id = route.paramMap.get('id');
  return id ? inject(VeiculoService).getById(id) : of(null);
};
