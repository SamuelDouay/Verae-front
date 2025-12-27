// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  token?: string
  [key: string]: unknown // Pour les propriétés additionnelles
}

// Type pour les erreurs API
import type { ApiError } from '@/types/response'

class ApiService {
  private readonly baseURL = '/api'
  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const authHeaders = this.getAuthHeaders()

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...authHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (response.type === 'opaque' || response.status === 0) {
        throw new Error('Erreur CORS: Impossible de contacter le serveur')
      }

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.data || errorMessage
        } catch {
          // Si la réponse n'est pas du JSON, on utilise le statut
        }

        const error: ApiError = {
          name: 'ApiError',
          message: errorMessage,
          status: response.statusText,
          code: response.status,
        }
        throw error
      }

      if (response.status === 204) {
        return { data: {} } as T
      }

      const jsonResponse = (await response.json()) as ApiResponse<T>
      return jsonResponse.data as T
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          'Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré et accessible.',
        )
      }
      throw error
    }
  }

  // Méthodes normales qui extraient automatiquement data
  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
      headers,
    })
  }

  async put<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, {
      method: 'PUT',
      body,
      headers,
    })
  }

  async patch<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body,
      headers,
    })
  }

  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }

  async postFormData<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        ...headers,
      },
    })
  }

  getAuthHeaders(token?: string): HeadersInit {
    const authToken = token || localStorage.getItem('token')
    if (!authToken) return {}

    return {
      Authorization: `Bearer ${authToken}`,
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token)
  }

  clearToken(): void {
    localStorage.removeItem('token')
  }

  hasToken(): boolean {
    try {
      return !!localStorage.getItem('token')
    } catch {
      return false
    }
  }
}

export const apiService = new ApiService()
