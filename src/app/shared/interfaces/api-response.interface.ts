export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T | T[] | null;
}
