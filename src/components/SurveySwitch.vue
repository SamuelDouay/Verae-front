<template>
  <div>{{ name }} : <ToggleSwitch v-model="checked" /></div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  name: string
  value: boolean
}>()

const checked = ref(props.value)
</script>

<style scoped></style>
