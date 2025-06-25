<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700"
      :class="[
        sizeClass,
        `border-t-${color}-500`
      ]"
    ></div>
    <span v-if="text" class="ml-3 text-gray-600 dark:text-gray-300">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent'
  text?: string
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  text: '',
  fullHeight: false
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-4 w-4'
    case 'lg': return 'h-8 w-8'
    default: return 'h-6 w-6'
  }
})

const containerClass = computed(() => {
  return props.fullHeight ? 'min-h-64' : 'py-8'
})
</script>