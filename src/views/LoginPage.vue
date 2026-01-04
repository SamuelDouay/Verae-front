<template>
  <Card class="auth-container">
    <template #header>
      <h2>Bienvenue sur VERA</h2>
      <p>Connectez-vous à votre compte</p>
    </template>

    <template #content>
      <Form @submit="handleLogin">
        <FormInput
          id="email"
          v-model="loginForm.email"
          label="Email"
          type="email"
          :error="loginErrors.email"
        />

        <FormInput
          id="password"
          v-model="loginForm.password"
          label="Mot de passe"
          type="password"
          :error="loginErrors.password"
        />

        <Button
          label="Se connecter"
          type="submit"
          :loading="loading"
        />

        <Divider>
          <span>ou</span>
        </Divider>

        <Button
          label="Créer un compte"
          severity="secondary"
          @click="goToRegister"
        />
      </Form>
    </template>
  </Card>

  <!-- Toast pour les notifications -->
  <Toast />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import { safeRedirect } from '@/utils/navigation'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)

interface LoginForm {
  email: string
  password: string
}

interface LoginErrors {
  email: string
  password: string
}

const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
})

const loginErrors = reactive<LoginErrors>({
  email: '',
  password: '',
})

/**
 * Extrait le paramètre de redirection de l'URL de manière sécurisée
 */
function getRedirectParam(): string | null {
  const redirectParam = route.query.redirect

  if (!redirectParam) return null

  // Handle both string and array cases
  return Array.isArray(redirectParam)
    ? redirectParam[0]
    : redirectParam
}

/**
 * Redirige l'utilisateur après une connexion réussie
 */
function redirectAfterLogin(): void {
  const redirectParam = getRedirectParam()

  // Utilise safeRedirect pour valider et nettoyer la redirection
  const safeRedirectPath = safeRedirect(redirectParam, '/')

  console.log('🔀 Redirection sécurisée après login:', safeRedirectPath)
  router.push(safeRedirectPath)
}

/**
 * Redirige l'utilisateur déjà connecté
 */
function redirectIfAlreadyAuthenticated(): void {
  if (authStore.isAuthenticated) {
    console.log('⚠️ Utilisateur déjà connecté, redirection...')
    redirectAfterLogin()
  }
}

const validateLogin = (): boolean => {
  let isValid = true

  // Réinitialiser les erreurs
  loginErrors.email = ''
  loginErrors.password = ''

  // Validation email
  if (!loginForm.email.trim()) {
    loginErrors.email = "L'email est requis"
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
    loginErrors.email = "Format d'email invalide"
    isValid = false
  }

  // Validation mot de passe
  if (!loginForm.password) {
    loginErrors.password = 'Le mot de passe est requis'
    isValid = false
  }

  return isValid
}

const handleLogin = async (): Promise<void> => {
  // Validation avant soumission
  if (!validateLogin()) {
    toast.add({
      severity: 'error',
      summary: 'Formulaire invalide',
      detail: 'Veuillez corriger les erreurs dans le formulaire',
      life: 5000,
    })
    return
  }

  loading.value = true

  try {
    const result = await authStore.login(loginForm)

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Connexion réussie',
        detail: 'Bienvenue !',
        life: 3000,
      })

      // Utiliser la redirection sécurisée
      redirectAfterLogin()

    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur de connexion',
        detail: result.error || 'Identifiants incorrects',
        life: 5000,
      })

      // Optionnel : Réinitialiser le mot de passe en cas d'échec
      loginForm.password = ''
    }

  } catch (error: any) {
    console.error('❌ Erreur lors de la connexion:', error)

    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: error.message || 'Une erreur est survenue lors de la connexion',
      life: 5000,
    })

  } finally {
    loading.value = false
  }
}

const goToRegister = (): void => {
  const redirectParam = getRedirectParam()

  // Si on a un paramètre de redirection, le transmettre à la page d'inscription
  if (redirectParam) {
    router.push(`/register?redirect=${encodeURIComponent(redirectParam)}`)
  } else {
    router.push('/register')
  }
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
onMounted(() => {
  redirectIfAlreadyAuthenticated()

  // Log de sécurité pour le débogage
  const redirectParam = getRedirectParam()
  if (redirectParam) {
    const isSafe = safeRedirect(redirectParam) === redirectParam
    console.log('🔍 Paramètre redirect analysé:', {
      original: redirectParam,
      safe: isSafe,
      finalPath: safeRedirect(redirectParam)
    })
  }
})
</script>
