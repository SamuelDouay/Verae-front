<template>
  <AppHeader v-if="authStore.isAuthenticated" />
  <section>
    <RouterView />
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
