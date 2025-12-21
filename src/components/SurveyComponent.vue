<template>
  <Card>
    <template #title>
      <h2>{{ survey.name }}</h2>
    </template>
    <template #content>
      <p>{{ survey.description }}</p>
      <Switch name="Actif" :value="survey.active || false" />
      <Switch name="Quiz" :value="survey.quiz || false" />
      <Switch name="Public" :value="survey.public || false" />
      <p>Anonymisation : {{ survey.anonymization }}</p>
      <p>Token de partage : {{ survey.shareToken }}</p>
      <p>Public : {{ survey.public }}</p>
    </template>
    <template #footer>
      <Button
        label="Voir les questions"
        severity="primary"
        size="small"
        @click="$router.push(`/survey/${survey.id}`)"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Survey } from '@/types/survey'
import Switch from './SurveySwitch.vue';

const props = defineProps<{
  survey: Survey
}>()

console.log('SurveyComponent props:', props?.survey.id)
</script>
