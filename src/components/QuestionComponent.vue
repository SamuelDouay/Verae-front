<template>
  <div class="question-component">
    <h2>Composant de Question</h2>
    <p>Ceci est un composant de question réutilisable.</p>
    <div v-if="question" class="question-details">
      <h3>{{ question.title }}</h3>
      <p>{{ question.description }}</p>
      <p>Obligatoire : {{ question.mandatory ? 'Oui' : 'Non' }}</p>
      <p>Réponse correcte : {{ question.correctAnswer }}</p>
      <p>Ordre d'affichage : {{ question.displayOrder }}</p>
    </div>
    <div v-else class="no-question">Aucune question fournie</div>
  </div>
</template>

<script setup lang="ts">
import { Question } from '@/types/question'

const props = defineProps<{
  question: Question
}>()

console.log('QuestionComponent props:', props?.question.id)
</script>
