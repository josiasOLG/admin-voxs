import { ApiResponse } from '../../shared';

export function extractData<T>(response: ApiResponse<T>): T[] {
  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (data) {
    return [data];
  }

  return [];
}
