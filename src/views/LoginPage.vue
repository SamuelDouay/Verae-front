<template>
  <div class="login-page">
    <div class="container">
      <Card class="login-card">
        <template #header>
          <div class="card-header">
            <h2>Bienvenue sur VERA</h2>
            <p>Connectez-vous à votre compte</p>
          </div>
        </template>

        <template #content>
          <div class="p-fluid">
            <div class="field">
              <FloatLabel>
                <InputText
                  id="email"
                  v-model="loginForm.email"
                  type="email"
                  :class="{ 'p-invalid': loginErrors.email }"
                />
                <label for="email">Email</label>
              </FloatLabel>
              <small class="p-error" v-if="loginErrors.email">{{ loginErrors.email }}</small>
            </div>

            <div class="field">
              <FloatLabel>
                <Password
                  id="password"
                  v-model="loginForm.password"
                  :feedback="false"
                  toggleMask
                  :class="{ 'p-invalid': loginErrors.password }"
                />
                <label for="password">Mot de passe</label>
              </FloatLabel>
              <small class="p-error" v-if="loginErrors.password">{{ loginErrors.password }}</small>
            </div>

            <Button
              label="Se connecter"
              class="w-full"
              :loading="loading"
              @click="handleLogin"
            />

            <Divider>
              <span class="p-tag">ou</span>
            </Divider>

            <Button
              label="Créer un compte"
              severity="secondary"
              class="w-full"
              @click="goToRegister"
            />
          </div>
        </template>
      </Card>

      <!-- Toast pour les notifications -->
      <Toast />
    </div>
  </div>
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
  password: ''
})

const loginErrors = reactive({
  email: '',
  password: ''
})

const validateLogin = () => {
  let isValid = true

  loginErrors.email = ''
  loginErrors.password = ''

  if (!loginForm.email) {
    loginErrors.email = 'L\'email est requis'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
    loginErrors.email = 'Format d\'email invalide'
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
      life: 3000
    })
    router.push('/')
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur de connexion',
      detail: result.error,
      life: 5000
    })
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  text-align: center;
  color: var(--primary-color);
}

.card-header h2 {
  margin: 0 0 8px 0;
  color: var(--text-color);
}

.card-header p {
  margin: 0;
  color: var(--text-color-secondary);
}

.field {
  margin-bottom: 1.5rem;
}

.w-full {
  width: 100%;
}

:deep(.p-divider .p-tag) {
  background: var(--surface-ground);
  color: var(--text-color-secondary);
  padding: 0.25rem 0.75rem;
}
</style>
