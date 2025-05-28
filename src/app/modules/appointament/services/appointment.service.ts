import { Injectable } from '@angular/core';
import { CustomHttpClient } from '../../../shared/http/custom-http-client.service';
import { CreateAppointmentSchema, IAppointment } from '../schema/create-appointment.schema';
import { ApiResponse } from '../../../shared';

const AppointmentArraySchema = CreateAppointmentSchema.array();

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly Api = {
    base: '',
    byId: (id: string) => `/${id}`,
    search: '/search',
  };

  private client: ReturnType<CustomHttpClient['createDomainClient']>;

  constructor(private http: CustomHttpClient) {
    this.client = this.http.createDomainClient('appointments');
  }

  public getAll(params?: { page?: number; search?: string }) {
    return this.client.get<ApiResponse<IAppointment>>(this.Api.base, { params });
  }

  public getById(id: string) {
    return this.client.get<IAppointment>(this.Api.byId(id), {
      schema: CreateAppointmentSchema,
    });
  }

  public searchByUserId(userId: string) {
    return this.client.get<IAppointment[]>(this.Api.search, {
      params: { userId: userId },
      schema: AppointmentArraySchema,
    });
  }

  public create(data: Partial<IAppointment>) {
    return this.client.post<IAppointment>(this.Api.base, data, {
      schema: CreateAppointmentSchema,
    });
  }

  public update(id: string, data: Partial<IAppointment>) {
    return this.client.put<IAppointment>(this.Api.byId(id), data, {
      schema: CreateAppointmentSchema,
    });
  }

  public delete(id: string) {
    return this.client.delete<void>(this.Api.byId(id));
  }
}
