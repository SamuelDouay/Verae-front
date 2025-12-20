<template>
  <Card class="auth-container">
    <template #header>
        <h2>Créer un compte</h2>
        <p>Rejoignez la communauté VERA</p>
    </template>

    <template #content>
      <Form @submit="handleRegister">
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

        <Button type="submit" label="S'inscrire" :loading="loading" />

        <Divider>
          <span>ou</span>
        </Divider>

        <Button label="Se connecter" severity="secondary" @click="goToLogin" />
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
