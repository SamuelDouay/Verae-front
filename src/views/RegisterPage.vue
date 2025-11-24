<template>
  <div class="register-page">
    <div class="container">
      <Card class="register-card">
        <template #header>
          <div class="card-header">
            <h2>Créer un compte</h2>
            <p>Rejoignez la communauté VERA</p>
          </div>
        </template>

        <template #content>
          <div class="p-fluid">
            <div class="field">
              <FloatLabel>
                <InputText
                  id="name"
                  v-model="registerForm.name"
                  :class="{ 'p-invalid': registerErrors.name }"
                />
                <label for="name">Prénom</label>
              </FloatLabel>
              <small class="p-error" v-if="registerErrors.name">{{ registerErrors.name }}</small>
            </div>

            <div class="field">
              <FloatLabel>
                <InputText
                  id="surname"
                  v-model="registerForm.surname"
                  :class="{ 'p-invalid': registerErrors.surname }"
                />
                <label for="surname">Nom</label>
              </FloatLabel>
              <small class="p-error" v-if="registerErrors.surname">{{ registerErrors.surname }}</small>
            </div>

            <div class="field">
              <FloatLabel>
                <InputText
                  id="email"
                  v-model="registerForm.email"
                  type="email"
                  :class="{ 'p-invalid': registerErrors.email }"
                />
                <label for="email">Email</label>
              </FloatLabel>
              <small class="p-error" v-if="registerErrors.email">{{ registerErrors.email }}</small>
            </div>

            <div class="field">
              <FloatLabel>
                <Password
                  id="password"
                  v-model="registerForm.password"
                  :feedback="false"
                  toggleMask
                  :class="{ 'p-invalid': registerErrors.password }"
                />
                <label for="password">Mot de passe</label>
              </FloatLabel>
              <small class="p-error" v-if="registerErrors.password">{{ registerErrors.password }}</small>
            </div>

            <Button
              label="S'inscrire"
              class="w-full"
              :loading="loading"
              @click="handleRegister"
            />

            <Divider>
              <span class="p-tag">ou</span>
            </Divider>

            <Button
              label="Se connecter"
              severity="secondary"
              class="w-full"
              @click="goToLogin"
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

// PrimeVue components
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import FloatLabel from 'primevue/floatlabel'
import Divider from 'primevue/divider'
import Toast from 'primevue/toast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)

const registerForm = reactive({
  name: '',
  surname: '',
  email: '',
  password: ''
})

const registerErrors = reactive({
  name: '',
  surname: '',
  email: '',
  password: ''
})

const validateRegister = () => {
  let isValid = true

  registerErrors.name = ''
  registerErrors.surname = ''
  registerErrors.email = ''
  registerErrors.password = ''

  if (!registerForm.name) {
    registerErrors.name = 'Le prénom est requis'
    isValid = false
  }

  if (!registerForm.surname) {
    registerErrors.surname = 'Le nom est requis'
    isValid = false
  }

  if (!registerForm.email) {
    registerErrors.email = 'L\'email est requis'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
    registerErrors.email = 'Format d\'email invalide'
    isValid = false
  }

  if (!registerForm.password) {
    registerErrors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (registerForm.password.length < 6) {
    registerErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateRegister()) return

  loading.value = true
  const result = await authStore.register(registerForm)
  loading.value = false

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Inscription réussie',
      detail: result.message,
      life: 5000
    })
    // Redirection vers la page de login après inscription réussie
    router.push('/login')
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur d\'inscription',
      detail: result.error,
      life: 5000
    })
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 400px;
}

.register-card {
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
