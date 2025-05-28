import { ZodSchema } from 'zod';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions<T = unknown> {
  schema?: ZodSchema<T>;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  responseType?: 'json';
  observe?: 'body';
  disableLoading?: boolean;
  timeout?: number;
}
