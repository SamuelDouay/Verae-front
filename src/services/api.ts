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
  private readonly isWebClient = true;
  private readonly defaultHeaders = {
    'Content-Type': 'application/json',
  }

  // Stockage du token CSRF en mémoire
  private csrfToken: string | null = null
  private csrfInitialized = false
  private csrfPromise: Promise<void> | null = null

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const authHeaders = this.getAuthHeaders()

    const method = options.method?.toUpperCase() || 'GET'
    const isMutating = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)

    if (isMutating && !this.csrfInitialized) {
      await this.ensureCsrfInitialized()
    }

    const headers = {
      ...this.defaultHeaders,
      ...authHeaders,
      ...options.headers,
    } as Record<string, string>

    if (isMutating && this.csrfToken) {
      headers['x-csrf-token'] = this.csrfToken
      console.log('🔐 CSRF envoyé pour', method, endpoint)
    } else if (isMutating) {
      console.warn('⚠️ Requête mutante sans token CSRF:', method, endpoint)
    }

    if (this.isWebClient) {
      headers['X-Client-Type'] = 'web'
    }

    const config: RequestInit = {
      ...options,
      credentials: 'include' as RequestCredentials,
      headers,
    }

    try {
      const response = await fetch(url, config)

      if (response.type === 'opaque' || response.status === 0) {
        throw new Error('Erreur CORS: Impossible de contacter le serveur')
      }

      // 3. Gérer les erreurs CSRF (403)
      if (response.status === 403) {
        const errorText = await response.text()
        if (errorText.includes('CSRF')) {
          console.log('Token CSRF invalide, tentative de renouvellement...')

          // Nettoyer et réessayer une fois
          this.csrfToken = null
          this.csrfInitialized = false

          if (isMutating) {
            // Réessayer avec un nouveau token
            return this.retryRequestWithNewCsrf<T>(endpoint, options, authHeaders)
          }
        }
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

      const newCsrfToken = response.headers.get('x-csrf-token')
      if (newCsrfToken) {
        this.csrfToken = newCsrfToken
        this.csrfInitialized = true
        console.log('🔐 Token CSRF reçu:', newCsrfToken.substring(0, 10) + '...')
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

  /**
   * Réessaye une requête après avoir obtenu un nouveau token CSRF
   */
  private async retryRequestWithNewCsrf<T>(
    endpoint: string,
    options: RequestInit,
    authHeaders: HeadersInit
  ): Promise<T> {
    try {
      await this.initializeCsrf()

      if (!this.csrfToken) {
        throw new Error('Impossible d\'obtenir un nouveau token CSRF')
      }

      const headers = {
        ...this.defaultHeaders,
        ...authHeaders,
        ...options.headers,
        'x-csrf-token': this.csrfToken,
      }

      const config: RequestInit = {
        ...options,
        credentials: 'include',
        headers,
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, config)

      if (!response.ok) {
        throw new Error(`Échec après réessai CSRF: ${response.status}`)
      }

      // Mettre à jour le token depuis la réponse
      const newToken = response.headers.get('x-csrf-token')
      if (newToken) {
        this.csrfToken = newToken
      }

      if (response.status === 204) {
        return { data: {} } as T
      }

      const jsonResponse = (await response.json()) as ApiResponse<T>
      return jsonResponse.data as T
    } catch (retryError) {
      console.error('Échec de la réessai CSRF:', retryError)
      throw retryError
    }
  }

  /**
   * Initialise le token CSRF avec une requête GET
   */
  private async initializeCsrf(): Promise<void> {
    if (this.csrfInitialized) return
    if (this.csrfPromise) return this.csrfPromise

    this.csrfPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/admin/health`, {
          method: 'GET',
          credentials: 'include',
          headers: this.getAuthHeaders(),
        })

        if (response.ok) {
          const token = response.headers.get('x-csrf-token')
          if (token) {
            this.csrfToken = token
            this.csrfInitialized = true
            console.log('🔐 CSRF token initialisé')
          } else {
            console.warn('⚠️ Aucun token CSRF dans la réponse')
          }
        }
      } catch (error) {
        console.warn('Erreur lors de l\'initialisation CSRF:', error)
        throw error
      } finally {
        this.csrfPromise = null
      }
    })()

    return this.csrfPromise
  }

  /**
   * S'assure que le CSRF est initialisé
   */
  private async ensureCsrfInitialized(): Promise<void> {
    if (!this.csrfInitialized) {
      await this.initializeCsrf()
    }
  }

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
    // Pour FormData, ne pas ajouter Content-Type (le navigateur le fera)
    const { 'Content-Type': _, ...otherHeaders } = this.defaultHeaders

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        ...otherHeaders,
        ...this.getAuthHeaders(),
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
    // Réinitialiser le CSRF quand le token change
    this.csrfToken = null
    this.csrfInitialized = false
  }

  clearToken(): void {
    localStorage.removeItem('token')
    this.csrfToken = null
    this.csrfInitialized = false
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
