// Types génériques pour les réponses API
export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode?: number
}

export interface ListResponse<T> {
  data: T[]
  total?: number
  limit?: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  name: string
  message: string
  status: string | undefined
  code: number | undefined
}
