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

      <DataTable :value="users" :loading="loading">
        <template #header>
          <h2>Liste User</h2>
        </template>
        <Column field="name" header="Name"></Column>
        <Column field="surname" header="Surname"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="admin" header="Role"></Column>
      </DataTable>

      <UserList/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getUsers } from '@/services/user.api'
import type { User } from '@/types/user'

const authStore = useAuthStore()
const users = ref<User[]>([])
const loading = ref(false)

onMounted(async () => {
  try {
    loading.value = true
    users.value = await getUsers()
    console.log('Liste des utilisateurs dans usersList:', users.value)
  } catch (err: unknown) {
    console.error('Erreur lors de la récupération des utilisateurs:', err)
  } finally {
    loading.value = false
  }
})
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
