import { Injectable } from '@angular/core';
import { ApiResponse } from '../../../shared';
import { CustomHttpClient } from '../../../shared/http/custom-http-client.service';
import { CreateVeiculoSchema, IVeiculo } from '../schema/create-veiculo.schema';

const VeiculoArraySchema = CreateVeiculoSchema.array();

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly Api = {
    base: '',
    byId: (id: string) => `/${id}`,
    search: '/search',
  };

  private client: ReturnType<CustomHttpClient['createDomainClient']>;

  constructor(private http: CustomHttpClient) {
    this.client = this.http.createDomainClient('veiculos');
  }

  public getAll(params?: { page?: number; search?: string }) {
    return this.client.get<ApiResponse<IVeiculo>>(this.Api.base, { params });
  }

  public getById(id: string) {
    return this.client.get<IVeiculo>(this.Api.byId(id), {
      schema: CreateVeiculoSchema,
    });
  }

  public searchByPlate(plate: string) {
    return this.client.get<IVeiculo[]>(this.Api.search, {
      params: { placa: plate },
      schema: VeiculoArraySchema,
    });
  }

  public create(data: Partial<IVeiculo>) {
    return this.client.post<IVeiculo>(this.Api.base, data, {
      schema: CreateVeiculoSchema,
    });
  }

  public update(id: string, data: Partial<IVeiculo>) {
    return this.client.put<IVeiculo>(this.Api.byId(id), data, {
      schema: CreateVeiculoSchema,
    });
  }

  public delete(id: string) {
    return this.client.delete(this.Api.byId(id));
  }
}
