<template>
  <!-- Liste des questions avec v-for -->
  <div v-if="surveyLoading">Chargement des questions...</div>
  <div v-else-if="surveyError" class="error">{{ surveyError }}</div>
  <div v-else-if="surveys.length === 0">Aucune question trouvée</div>
  <div v-else class="surveys-list">
    <h3>Questions ({{ surveys.length }}) :</h3>
    <SurveyComponent v-for="survey in surveys" :key="survey.id" :survey="survey" />
  </div>
</template>

<script setup lang="ts">
import { surveyService } from '@/services/survey.api'
import { useAuthStore } from '@/stores/auth'
import SurveyComponent from '@/components/SurveyComponent.vue'
import type { Survey } from '@/types/survey'
import { ref, watch } from 'vue'

const surveys = ref<Survey[]>([])
const surveyLoading = ref(false)
const surveyError = ref<string | null>(null)

const authStore = useAuthStore()

const loadSurveys = async () => {
  surveyLoading.value = true
  surveyError.value = null
  try {
    surveys.value = await surveyService.getServeysByUser(authStore.user?.id)
  } catch (err) {
    surveyError.value = 'Erreur lors du chargement des sondages.'
    surveys.value = []
    console.error(err)
  } finally {
    surveyLoading.value = false
  }
}

watch(
  authStore,
  () => {
    if (authStore.user) {
      loadSurveys()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.surveys-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.error {
  color: red;
}
</style>
