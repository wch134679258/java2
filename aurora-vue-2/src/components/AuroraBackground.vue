<template>
  <canvas id="bg" ref="canvas"></canvas>
</template>

<script setup>
import { ref } from 'vue'
import { useAurora } from '../composables/useAurora'

const canvas = ref(null)
useAurora(canvas)
</script>
