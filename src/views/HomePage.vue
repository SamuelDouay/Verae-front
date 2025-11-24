<template>
  <div class="home-page">
    <AppHeader />

    <div class="container">
      <Card>
        <template #title>Tableau de bord</template>
        <template #content>
          <p>Bienvenue {{ authStore.user?.name }} {{ authStore.user?.surname }} !</p>
          <p>Email: {{ authStore.user?.email }}</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--surface-ground);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>
