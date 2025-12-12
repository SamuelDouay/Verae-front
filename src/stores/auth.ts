import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiError
} from '@/types/auth'
import { getMe } from '@/services/user.api';
import { aapilogin, apilogout, apiregister } from '@/services/auth.api';

function isApiError(error: unknown): error is { message: string; status?: number; code?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

function getError(error: unknown): AuthResponse {
  if (isApiError(error)) {
    const apiError: ApiError = {
      name: 'ApiError',
      message: error.message,
      status: error.status,
      code: error.code
    }
    return { success: false, error: apiError.message }
  }
  return { success: false, error: 'Error Internal Server' }
}


export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await aapilogin(credentials);

      const authToken = response.token

      if (!authToken) {
        throw new Error('Token non reçu dans la réponse')
      }

      localStorage.setItem('token', authToken)
      isAuthenticated.value = true

      await fetchUserInfo()

      return { success: true }
    } catch (error) {
      return getError(error);
    }
  }

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      await apiregister(userData);
      return {
        success: true,
        message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
      }
    } catch (error) {
      return getError(error);
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (token.value) {
        await apilogout();
      }
    } catch (error) {
      getError(error);
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

      const response = await getMe();

      if (response) {
        user.value = response
      }
    } catch (error) {
      getError(error);
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
