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

        <Button label="Se connecter" type="submit" :loading="loading" />

        <Divider>
          <span>ou</span>
        </Divider>

        <Button label="Créer un compte" severity="secondary" @click="goToRegister" />
      </Form>
    </template>
  </Card>

  <!-- Toast pour les notifications -->
  <Toast />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
})

const loginErrors = reactive({
  email: '',
  password: '',
})

const validateLogin = () => {
  let isValid = true

  loginErrors.email = ''
  loginErrors.password = ''

  if (!loginForm.email) {
    loginErrors.email = "L'email est requis"
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
    loginErrors.email = "Format d'email invalide"
    isValid = false
  }

  if (!loginForm.password) {
    loginErrors.password = 'Le mot de passe est requis'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateLogin()) return

  loading.value = true
  const result = await authStore.login(loginForm)
  loading.value = false

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Connexion réussie',
      detail: 'Bienvenue !',
      life: 3000,
    })
    router.push('/')
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur de connexion',
      detail: result.error,
      life: 5000,
    })
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>
