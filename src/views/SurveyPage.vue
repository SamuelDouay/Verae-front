<template>
  <div class="survey-page">
    <h1>Page de Sondage</h1>
    <p>Ceci est la page de sondage.</p>
  </div>

<GenericDataTable
  title="Liste des Questionnaires"
  :columns="surveyColumns"
  :fetch-function="fetchSurveys"
  :paginator="true"
  :show-search="true"
  :show-footer="true"
/>
</template>

<script setup lang="ts">
import { surveyService } from '@/services/survey.api'
import type { ColumnConfig } from '@/types/table'
import type { Survey } from '@/types/survey'

const surveyColumns: ColumnConfig<Survey>[] = [
  { field: 'name', header: 'Titre', sortable: true },
  { field: 'anonymization', header: 'Anonymisation', sortable: true, format: 'boolean' },
  { field: 'description', header: 'Description', sortable: true, format: 'truncate' },
  { field: 'userId', header: 'Créateur ID', sortable: true },
  { field: 'quiz', header: 'Quiz', sortable: true, format: 'boolean' },
  { field: 'active', header: 'Actif', sortable: true, format: 'boolean' },
  { field: 'editing', header: 'Édition', sortable: true, format: 'boolean' },
  { field: 'shareToken', header: 'Token' },
  { field: 'public', header: 'Public', sortable: true, format: 'boolean' }
]

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore();


const fetchSurveys = async () => {
  console.log("Fetching surveys for user ID:", authStore.user?.name);
  return surveyService.getServeysByUser(authStore.user?.id);
}
</script>
