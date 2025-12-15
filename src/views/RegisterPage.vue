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
          <Form class="p-fluid" @submit="handleRegister">
            <FormInput
              id="name"
              v-model="registerForm.name"
              label="Prénom"
              :error="registerErrors.name"
            />

            <FormInput
              id="surname"
              v-model="registerForm.surname"
              label="Nom"
              :error="registerErrors.surname"
            />

            <FormInput
              id="email"
              v-model="registerForm.email"
              label="Email"
              type="email"
              :error="registerErrors.email"
            />

            <FormInput
              id="password"
              v-model="registerForm.password"
              label="Mot de passe"
              type="password"
              :error="registerErrors.password"
            />

            <Button type="submit" label="S'inscrire" class="w-full" :loading="loading" />

            <Divider>
              <span class="p-tag">ou</span>
            </Divider>

            <Button label="Se connecter" severity="secondary" class="w-full" @click="goToLogin" />
          </Form>
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
import FormInput from '@/components/form/FormInput.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)

const registerForm = reactive({
  name: '',
  surname: '',
  email: '',
  password: '',
})

const registerErrors = reactive({
  name: '',
  surname: '',
  email: '',
  password: '',
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
    registerErrors.email = "L'email est requis"
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
    registerErrors.email = "Format d'email invalide"
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
      life: 5000,
    })
    // Redirection vers la page de login après inscription réussie
    router.push('/login')
  } else {
    toast.add({
      severity: 'error',
      summary: "Erreur d'inscription",
      detail: result.error,
      life: 5000,
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
