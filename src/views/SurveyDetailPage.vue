<template>
  <Card>
    <template #title v-if="loading">Chargement...</template>
    <template #title v-else-if="error">{{ error }}</template>
    <template #title v-else-if="!survey">Aucun sondage trouvé</template>
    <template #title v-else>{{ survey?.name }}</template>
    <template #subtitle>{{ survey?.description }}</template>
    <template #content>
      <div>
        <p>Anonymisation : {{ survey?.anonymization }}</p>

        <p>Quiz : {{ survey?.quiz }}</p>

        <p>Actif : {{ survey?.active }}</p>

        <p>Édition : {{ survey?.editing }}</p>

        <p>Token : {{ survey?.shareToken }}</p>

        <p>Public : {{ survey?.public }}</p>
      </div>
      <GenericDataTable
        :columns="questionColumns"
        :fetch-function="fetchQuestions"
        :paginator="true"
      />

      <!-- Liste des questions avec v-for -->
      <div v-if="questionsLoading">Chargement des questions...</div>
      <div v-else-if="questionsError" class="error">{{ questionsError }}</div>
      <div v-else-if="questions.length === 0">Aucune question trouvée</div>
      <div v-else class="questions-list">
        <h3>Questions ({{ questions.length }}) :</h3>
        <QuestionComponent v-for="question in questions" :key="question.id" :question="question" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { surveyService } from '@/services/survey.api'
import type { Survey } from '@/types/survey'
import { computed, ref, watchEffect, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { ColumnConfig } from '@/types/table'
import type { Question } from '@/types/question'
import { questionService } from '@/services/question.api'
import QuestionComponent from '@/components/QuestionComponent.vue'

const route = useRoute()
const slug = ref(route.params.slug as string)
const survey = ref<Survey | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
// États pour les questions
const questions = ref<Question[]>([])
const questionsLoading = ref(false)
const questionsError = ref<string | null>(null)

const questionColumns: ColumnConfig<Question>[] = [
  { field: 'title', header: 'Titre', sortable: true, format: 'capitalize' },
  { field: 'description', header: 'Description', sortable: true, format: 'truncate' },
  { field: 'surveyId', header: 'Questionnaire ID', sortable: true },
  { field: 'mandatory', header: 'Obligatoire', sortable: true, format: 'boolean' },
  { field: 'correctAnswer', header: 'Réponse correcte' },
  { field: 'displayOrder', header: 'Ordre', sortable: true },
]

// Calculer un ID numérique si le slug est un nombre
const surveyId = computed(() => {
  const s = slug.value
  return Number.isNaN(Number(s)) ? null : Number(s)
})

// Fonction pour charger les questions
const loadQuestions = async () => {
  if (!surveyId.value) {
    questionsError.value = 'Aucun ID de sondage'
    return
  }

  questionsLoading.value = true
  questionsError.value = null

  try {
    // Assurez-vous que cette méthode existe dans questionService
    questions.value = await questionService.getByIdSurvey(surveyId.value)
  } catch (err) {
    console.error('Erreur lors du chargement des questions:', err)
    questionsError.value = 'Impossible de charger les questions'
    questions.value = []
  } finally {
    questionsLoading.value = false
  }
}

// Fonction pour GenericDataTable (doit retourner une promesse)
const fetchQuestions = async (): Promise<Question[]> => {
  if (!surveyId.value) {
    return []
  }
  try {
    return await questionService.getByIdSurvey(surveyId.value)
  } catch (err) {
    console.error('Erreur:', err)
    return []
  }
}

// Charger le sondage
watchEffect(async () => {
  if (!surveyId.value) return

  loading.value = true
  error.value = null

  try {
    const result = await surveyService.getById(surveyId.value)
    survey.value = result

    // Charger les questions une fois le sondage chargé
    loadQuestions()
  } catch (err) {
    console.error('Erreur lors du chargement du sondage:', err)
    error.value = 'Impossible de charger le sondage'
    survey.value = null
  } finally {
    loading.value = false
  }
})

// Recharger les questions si l'ID change
watch(
  surveyId,
  () => {
    if (survey.value) {
      loadQuestions()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.questions-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
