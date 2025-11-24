// Types pour les réponses API
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  token?: string
  [key: string]: unknown // Pour les propriétés additionnelles
}

// Type pour les erreurs API
export interface ApiError {
  message: string
  status?: number
  code?: string
}

// Type générique pour les données de requête
export type RequestData = unknown;

class ApiService {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor() {
    this.baseURL = '/api'
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
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
          const errorData = await response.json() as ApiError
          errorMessage = errorData.message || errorMessage
        } catch {
          // Si la réponse n'est pas du JSON, on utilise le statut
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
        }
        throw error
      }

      if (response.status === 204) {
        return {} as T
      }

      return await response.json() as T
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Erreur de connexion au serveur. Vérifiez que le serveur backend est démarré et accessible.')
      }
      throw error
    }
  }

  async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(endpoint: string, data?: RequestData, headers?: HeadersInit): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
      headers,
    })
  }

  async put<T>(endpoint: string, data?: RequestData, headers?: HeadersInit): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, {
      method: 'PUT',
      body,
      headers,
    })
  }

  async patch<T>(endpoint: string, data?: RequestData, headers?: HeadersInit): Promise<T> {
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

  // Méthode pour les uploads de fichiers (FormData)
  async postFormData<T>(endpoint: string, formData: FormData, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        ...headers,
        // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
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
}

export const apiService = new ApiService()
