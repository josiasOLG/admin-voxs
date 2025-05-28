import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';

export const dashboardListResolver: ResolveFn<any> = () => {
  return inject(DashboardService).getAll();
};

export const dashboardDetailResolver: ResolveFn<any> = (route, _state) => {
  const id = route.paramMap.get('id');
  return id ? inject(DashboardService).getById(id) : of(null);
};

export const dashboardEditResolver: ResolveFn<any> = (route, _state) => {
  const id = route.paramMap.get('id');
  return id ? inject(DashboardService).getById(id) : of(null);
};
