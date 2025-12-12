// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  token?: string
  [key: string]: unknown // Pour les propriétés additionnelles
}

// Type pour les erreurs API
import type {
  ApiError
} from '@/types/auth'

class ApiService {
  private readonly baseURL: string
  private readonly defaultHeaders: HeadersInit

  constructor() {
    this.baseURL = '/api'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    extractData: boolean = true // Nouveau paramètre pour contrôler l'extraction
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const authHeaders = this.getAuthHeaders()

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...authHeaders,
        ...options.headers,
      }
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
          status: response.status,
        }
        throw error
      }

      if (response.status === 204) {
        return (extractData ? {} : { data: {} }) as T
      }

      const jsonResponse = await response.json() as ApiResponse<T>

      // Si extractData est true, retourner directement data, sinon retourner l'objet complet
      if (extractData) {
        // Vérifier si la réponse a une propriété data
        if ('data' in jsonResponse) {
          return jsonResponse.data as T
        } else {
          // Si pas de data, retourner l'objet complet
          return jsonResponse as unknown as T
        }
      } else {
        return jsonResponse as unknown as T
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré et accessible.')
      }
      throw error
    }
  }

  // Méthodes normales qui extraient automatiquement data
  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers }, true)
  }

  async post<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
      headers,
    }, true)
  }

  async put<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, {
      method: 'PUT',
      body,
      headers,
    }, true)
  }

  async patch<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body,
      headers,
    }, true)
  }

  async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers }, true)
  }

  // Méthode pour les uploads de fichiers (FormData)
  async postFormData<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        ...headers,
      },
    }, true)
  }

  // NOUVELLES MÉTHODES pour récupérer la réponse complète si besoin
  async getFullResponse<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>(endpoint, { method: 'GET', headers }, false)
  }

  async postFullResponse<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<ApiResponse<T>>(endpoint, {
      method: 'POST',
      body,
      headers,
    }, false)
  }

  async putFullResponse<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<ApiResponse<T>>(endpoint, {
      method: 'PUT',
      body,
      headers,
    }, false)
  }

  async patchFullResponse<T>(endpoint: string, data?: unknown, headers?: HeadersInit): Promise<ApiResponse<T>> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<ApiResponse<T>>(endpoint, {
      method: 'PATCH',
      body,
      headers,
    }, false)
  }

  async deleteFullResponse<T>(endpoint: string, headers?: HeadersInit): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>(endpoint, { method: 'DELETE', headers }, false)
  }

  getAuthHeaders(token?: string): HeadersInit {
    const authToken = token || localStorage.getItem('token')
    if (!authToken) return {}

    return {
      Authorization: `Bearer ${authToken}`,
    }
  }

  // Méthodes utilitaires
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
