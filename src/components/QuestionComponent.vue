<template>
  <Card>
    <template #title v-if="question"
      >{{ question.title }} <span>{{ question.mandatory ? '*' : '' }}</span></template
    >
    <template #title v-else>Aucune question fournie</template>
    <template #subtitle>{{ question.description }}</template>
    <template #content>
      <div class="response">
        <InputText
          type="text"
          v-model="responseValue"
          :placeholder="'Votre réponse...'"
          @keyup.enter="validateReponse"
        />
        <Button label="Soumettre" @click="validateReponse" :disabled="isSubmitting" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Question } from '@/types/question'

const props = defineProps<{
  question: Question
}>()

const responseValue = ref<string>('')
const isSubmitting = ref<boolean>(false)

console.log('QuestionComponent props:', props?.question.id)

function validateReponse() {
  console.log(`Réponse soumise: ${responseValue.value}`)
  // Logique de validation ici
}
</script>

<style scoped>
.question-component {
  border: 1px solid #6f1212;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  background-color: #1e1111;
}
.question-details h3 {
  margin-top: 0;
}
.no-question {
  color: #888;
  font-style: italic;
}

span {
  color: red;
}
.response {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
.response :deep(.p-inputtext) {
  flex: 1;
}
.response :deep(.p-button) {
  flex-shrink: 0;
}
</style>
