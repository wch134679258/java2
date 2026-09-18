<template>
  <div class="field" :data-for="forModes" :class="{ invalid }">
    <svg v-if="kind === 'user'" class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>
    <svg v-else-if="kind === 'mail'" class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 5.5 8.5-5.5"/></svg>

    <input
      :type="type"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <label :for="id">{{ label }}</label>
    <span class="err">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  id: String,
  label: String,
  error: String,
  forModes: String,
  kind: { type: String, default: '' }, // 'user' | 'mail'
  type: { type: String, default: 'text' },
  autocomplete: { type: String, default: 'off' },
  placeholder: { type: String, default: ' ' },
  modelValue: { type: String, default: '' },
  invalid: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])

const inputEl = ref(null)
defineExpose({ focus: () => inputEl.value && inputEl.value.focus() })
</script>
