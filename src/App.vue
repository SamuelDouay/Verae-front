<template>
  <AppHeader v-if="authStore.isAuthenticated" />
  <RouterView />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
