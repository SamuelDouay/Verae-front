<template>
  <div class="home-page">

    <div class="container">
      <Card>
        <template #title>Tableau de bord</template>
        <template #content>
          <p>Bienvenue {{ authStore.user?.name }} {{ authStore.user?.surname }} !</p>
          <p>Email: {{ authStore.user?.email }}</p>
        </template>
      </Card>

      <GenericDataTable
        title="Liste des Utilisateurs"
        :columns="userColumns"
        :fetch-function="fetchUsers"
        :paginator="true"
        :show-search="true"
      />

      <GenericDataTable
        title="Liste des Questions"
        :columns="questionColumns"
        :fetch-function="fetchQuestions"
        :paginator="true"
      />

      <GenericDataTable
        title="Liste des Réponses"
        :columns="answerColumns"
        :fetch-function="fetchAnswers"
        :paginator="true"
        :rows-per-page="5"
      />

<GenericDataTable
  title="Liste des Questionnaires"
  :columns="surveyColumns"
  :fetch-function="fetchSurveys"
  :paginator="true"
  :show-search="true"
  :show-footer="true"
/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/user.api'
import { questionService } from '@/services/question.api'
import { answerService } from '@/services/answer.api'
import { surveyService } from '@/services/survey.api'
import type { ColumnConfig } from '@/types/table'
import type { User } from '@/types/user'
import type { Question } from '@/types/question'
import type { Survey } from '@/types/survey'
import type { Answer } from '@/types/answers'
import GenericDataTable from '@/components/GenericDataTable.vue'

const authStore = useAuthStore()

// Configuration des colonnes pour chaque tableau
const userColumns: ColumnConfig<User>[] = [
  { field: 'name', header: 'Nom', sortable: true },
  { field: 'surname', header: 'Prénom', sortable: true },
  { field: 'email', header: 'Email', sortable: true },
  { field: 'admin', header: 'Rôle', sortable: true, format: 'boolean' }
]

const questionColumns: ColumnConfig<Question>[] = [
  { field: 'title', header: 'Titre', sortable: true, format: 'capitalize' },
  { field: 'description', header: 'Description', sortable: true, format: 'truncate' },
  { field: 'surveyId', header: 'Questionnaire ID', sortable: true },
  { field: 'mandatory', header: 'Obligatoire', sortable: true, format: 'boolean' },
  { field: 'correctAnswer', header: 'Réponse correcte' },
  { field: 'displayOrder', header: 'Ordre', sortable: true }
]

const answerColumns: ColumnConfig<Answer>[] = [
  { field: 'idQuestion', header: 'Question ID', sortable: true },
  { field: 'originalAnswer', header: 'Réponse originale', format: 'truncate' },
  { field: 'anonymousAnswer', header: 'Réponse anonyme', format: 'truncate' },
  { field: 'respondentId', header: 'Répondant ID', sortable: true },
  { field: 'isCorrect', header: 'Correct', sortable: true, format: 'boolean' },
  { field: 'submittedAt', header: 'Date', sortable: true, format: 'date' },
  { field: 'anonymous', header: 'Anonyme', sortable: true, format: 'boolean' }
]

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

// Fonctions de récupération
const fetchUsers = async () => {
  return userService.getAll()
}

const fetchQuestions = async () => {
  return questionService.getAll()
}

const fetchAnswers = async () => {
  return answerService.getAll()
}

const fetchSurveys = async () => {
  return surveyService.getAll()
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--surface-ground);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.container > * {
  margin-bottom: 2rem;
}
</style>

