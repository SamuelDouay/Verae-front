export interface User {
  id: number
  name: string
  surname: string
  email: string
  admin: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  surname: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user?: User
}

export interface AuthResponse {
  success: boolean
  message?: string
  error?: string
  token?: string
}

// Réponse paginée
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Réponse de liste
export interface ListResponse<T> {
  data: T[]
  count?: number
}

// Filtres de base
export interface BaseFilters {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Filtres pour les utilisateurs
export interface UserFilters extends BaseFilters {
  name?: string
  email?: string
  isAdmin?: boolean
}

// Filtres pour les surveys
export interface SurveyFilters extends BaseFilters {
  name?: string
  isActive?: boolean
  isPublic?: boolean
  isQuiz?: boolean
  userId?: number
}

// Réponse API générique basée sur ton OpenAPI
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  [key: string]: unknown
}

// Réponse de liste basée sur ton OpenAPI
export interface ListResponse<T = unknown> {
  data: T[]
}
