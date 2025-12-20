<template>
  <header>
    <div class="container">
      <div class="logo">
        <h2>VERA</h2>
      </div>

      <nav>
        <Button label="Accueil" severity="secondary" size="small" @click="$router.push('/')" />
        <Button
          label="Tableau de bord"
          severity="secondary"
          size="small"
          @click="$router.push('/dashboard')"
        />
        <Button
          label="Profil"
          severity="secondary"
          size="small"
          @click="$router.push('/profile')"
        />
        <Button
          label="Sondage"
          severity="secondary"
          size="small"
          @click="$router.push('/survey')"
        />
        <Button
          label="Administration"
          severity="secondary"
          size="small"
          @click="$router.push('/admin')"
          v-if="authStore.user?.admin === true"
        />
      </nav>

      <div class="user-menu" v-if="authStore.isAuthenticated">
        <span>Bonjour, {{ authStore.user?.name }}</span>
        <Button label="Déconnexion" severity="secondary" size="small" @click="handleLogout" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const handleLogout = () => {
  authStore.logout()
  toast.add({
    severity: 'info',
    summary: 'Déconnexion',
    detail: 'Vous avez été déconnecté',
    life: 3000,
  })
  router.push('/login')
}

</script>

<style scoped>

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1400px;
}

nav, .user-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
</style>
