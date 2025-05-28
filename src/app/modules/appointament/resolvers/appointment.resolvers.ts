import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { of } from 'rxjs';

export const appointmentListResolver: ResolveFn<any> = () => {
  return inject(AppointmentService).getAll();
};

export const appointmentDetailResolver: ResolveFn<any> = (route, _state) => {
  const id = route.paramMap.get('id');
  return id ? inject(AppointmentService).getById(id) : of(null);
};

export const appointmentEditResolver: ResolveFn<any> = (route, _state) => {
  const id = route.paramMap.get('id');
  return id ? inject(AppointmentService).getById(id) : of(null);
};
