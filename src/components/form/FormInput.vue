<template>
    <FloatLabel variant="on">
      <InputText
        :id="id"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @blur="onBlur"
        @input="onInput"
      />
      <label :for="id">{{ label }}</label>
    </FloatLabel>
    <small v-if="error" class="p-error">{{ error }}</small>
    <small v-else-if="helperText" class="p-helper-text">{{ helperText }}</small>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  modelValue: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  size?: 'small' | 'normal' | 'large'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
  (e: 'input', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'normal',
})

const emit = defineEmits<Emits>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const inputClasses = computed(() => ({
  'p-invalid': !!props.error,
  'input-small': props.size === 'small',
  'input-large': props.size === 'large',
  'input-disabled': props.disabled,
  'w-full': true,
}))

const onBlur = () => {
  emit('blur')
}

const onInput = (event: Event) => {
  emit('input', (event.target as HTMLInputElement).value)
}
</script>
