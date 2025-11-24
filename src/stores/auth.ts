import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '@/services/api'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse
} from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiService.post<ApiResponse<{ token?: string }>>(
        '/auth/login',
        credentials
      )

      const authToken = response.token || response.data?.token

      if (!authToken) {
        throw new Error('Token non reçu dans la réponse')
      }

      localStorage.setItem('token', response.data?.token || '')
      isAuthenticated.value = true

      await fetchUserInfo()

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      await apiService.post<ApiResponse>('/auth/register', userData)

      return {
        success: true,
        message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'inscription"
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (token.value) {
        await apiService.post(
          '/auth/logout',
          {},
          { Authorization: `Bearer ${token.value}` }
        )
      }
    } catch (error) {
      console.warn('Erreur lors de la déconnexion API:', error)
    } finally {
      user.value = null
      token.value = null
      isAuthenticated.value = false
      localStorage.removeItem('token')
    }
  }

  const fetchUserInfo = async (): Promise<void> => {
    if (!token.value) return

    try {

      const response = await apiService.get<ApiResponse<User>>(
        '/users/me',
        { Authorization: `Bearer ${token.value}` }
      )

      if (response.data) {
        user.value = response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des infos utilisateur:', error)
      // Si l'endpoint /users/me n'existe pas, on essaie autre chose
      await tryAlternativeUserFetch()
    }
  }

  const tryAlternativeUserFetch = async (): Promise<void> => {
    if (!token.value) return

    try {
      // Alternative: récupérer la liste des utilisateurs et trouver le courant
      // (ceci est un exemple, adapte-le à ton API)
      const response = await apiService.get<ApiResponse<User[]>>(
        '/users?limit=1',
        { Authorization: `Bearer ${token.value}` }
      )

      if (response.data && response.data.length > 0) {
        //user.value = response.data[0]
      }
    } catch (error) {
      console.error('Alternative user fetch failed:', error)
      await logout()
    }
  }

  // Initialisation
  if (token.value) {
    setTimeout(() => {
      fetchUserInfo()
    }, 1000)
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUserInfo,
  }
})
