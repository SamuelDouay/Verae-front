export interface ApiResponse<T = undefined> {
  data?: T
  message?: string
  [key: string]: unknown
}

export interface ApiError extends Error {
  status?: string
  code?: number
  data?: undefined
}

// api.service.ts
class ApiService {
  private baseURL = '/api'
  private csrfToken: string | null = null
  private currentUser: unknown = null

  private getHeaders(isMutating: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Client-Type': 'web',
    }

    if (isMutating && this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken
    }

    return headers
  }

  private isMutatingMethod(method: string): boolean {
    return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())
  }

  private handleErrorResponse = async (response: Response): Promise<never> => {
    if (response.status === 403) {
      const errorText = await response.text()
      if (errorText.includes('CSRF')) {
        this.csrfToken = null
        throw new Error('Token CSRF invalide')
      }
    }

    let errorMessage = `Erreur ${response.status}: ${response.statusText}`

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.data || errorMessage
    } catch {
      // Si ce n'est pas du JSON, on garde le message par défaut
    }

    const error: ApiError = new Error(errorMessage)
    error.status = response.statusText
    error.code = response.status

    throw error
  }

  private extractCsrfToken = (response: Response): void => {
    const token = response.headers.get('x-csrftoken')
    if (token) {
      this.csrfToken = token
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const isMutating = this.isMutatingMethod(options.method || 'GET')
    const isAuthEndpoint = endpoint.startsWith('/auth/')

    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        ...this.getHeaders(isMutating && !isAuthEndpoint),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        return this.handleErrorResponse(response)
      }

      this.extractCsrfToken(response)

      if (response.status === 204) {
        return {} as T
      }

      const data = await response.json()

      // Gérer les endpoints spéciaux
      if (isAuthEndpoint) {
        this.handleSpecialEndpoints(endpoint, data.data)
      }

      return data.data || data
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Erreur de connexion au serveur')
      }
      throw error
    }
  }

  private handleSpecialEndpoints(endpoint: string, data: any): void {
    switch (endpoint) {
      case '/auth/login':
        this.currentUser = data.user
        break
      case '/auth/logout':
        this.currentUser = null
        this.csrfToken = null
        break
      case '/auth/register':
        this.currentUser = data.user
        break
    }
  }

  async initializeCsrfToken(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        credentials: 'include',
        headers: { 'X-Client-Type': 'web' },
      })

      if (response.ok) {
        this.extractCsrfToken(response)
      }
    } catch (error) {
      console.warn('Échec initialisation CSRF:', error)
    }
  }

  // Méthodes HTTP simplifiées
  http = {
    get: <T>(endpoint: string, headers?: HeadersInit) =>
      this.request<T>(endpoint, { method: 'GET', headers }),

    post: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) =>
      this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data), headers }),

    put: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) =>
      this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), headers }),

    patch: <T>(endpoint: string, data?: unknown, headers?: HeadersInit) =>
      this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data), headers }),

    delete: <T>(endpoint: string, headers?: HeadersInit) =>
      this.request<T>(endpoint, { method: 'DELETE', headers }),
  }

  // Gestion utilisateur
  auth = {
    getCurrentUser: () => this.currentUser,
    setCurrentUser: (user: any) => {
      this.currentUser = user
    },
    clear: () => {
      this.currentUser = null
      this.csrfToken = null
    },

    check: async (): Promise<boolean> => {
      try {
        const user = await this.http.get('/users/me')
        return !!user
      } catch {
        this.currentUser = null
        return false
      }
    },
  }
}

export const apiService = new ApiService()
export default apiService
