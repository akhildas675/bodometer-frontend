export interface ValidationError {
  field?: string;
  path?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  errors?: ValidationError[];
}
