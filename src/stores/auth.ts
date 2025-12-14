import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginRequest, RegisterRequest } from '@/types/auth'
import type { User } from '@/types/user'
import { userService } from '@/services/user.api'
import { apiLogin, apiLogout, apiRegister } from '@/services/auth.api'

// Type pour les réponses d'authentification
interface AuthStoreResponse {
  success: boolean
  message?: string
  error?: string
}

function getError(error: unknown): AuthStoreResponse {
  // Si c'est une ApiResponse avec une erreur
  if (error && typeof error === 'object' && 'error' in error) {
    const apiError = error as { error: { message?: string; status?: string; code?: number } }
    return {
      success: false,
      error: apiError.error.message || 'Erreur serveur',
    }
  }

  // Si c'est une Error standard
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    }
  }

  // Erreur générique
  return {
    success: false,
    error: 'Une erreur est survenue',
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const login = async (credentials: LoginRequest): Promise<AuthStoreResponse> => {
    try {
      const response = await apiLogin(credentials)
      let authToken: string | undefined

      if ('token' in response) {
        authToken = response.token
      }

      if (!authToken) {
        throw new Error('Token non reçu dans la réponse')
      }

      localStorage.setItem('token', authToken)
      token.value = authToken
      isAuthenticated.value = true

      await fetchUserInfo()

      return { success: true }
    } catch (error) {
      return getError(error)
    }
  }

  const register = async (userData: RegisterRequest): Promise<AuthStoreResponse> => {
    try {
      const response = await apiRegister(userData)

      // Vérifier si la réponse a réussi
      if ('success' in response && response.success === false) {
        return {
          success: false,
          error: "Erreur lors de l'inscription",
        }
      }

      return {
        success: true,
        message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.',
      }
    } catch (error) {
      return getError(error)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (token.value) {
        await apiLogout()
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
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
      const response = await userService.getMe()
      user.value = response as User
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
      logout()
    }
  }

  // Initialisation
  if (token.value) {
    setTimeout(() => {
      fetchUserInfo()
    }, 5)
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
