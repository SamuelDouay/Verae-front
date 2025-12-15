<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <h2>VERA</h2>
      </div>

      <div>
        <Button label="Accueil" severity="secondary" size="small" @click="$router.push('/')" />
        <Button label="Tableau de bord" severity="secondary" size="small" @click="$router.push('/dashboard')" />
        <Button label="Profil" severity="secondary" size="small" @click="$router.push('/profile')" />
        <Button label="Sondage" severity="secondary" size="small" @click="$router.push('/survey')" />
        <Button label="Administration" severity="secondary" size="small" @click="$router.push('/admin')" v-if="authStore.user?.admin === true" />
      </div>

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
.app-header {
  background: var(--surface-section);
  border-bottom: 1px solid var(--surface-border);
  padding: 1rem 0;
}

.app-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo h2 {
  margin: 0;
  color: var(--primary-color);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
