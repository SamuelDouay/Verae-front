// Types génériques pour les réponses API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface ListResponse<T = any> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp?: string;
}
