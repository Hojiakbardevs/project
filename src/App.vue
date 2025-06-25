<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <NavigationHeader />
    <main class="transition-all duration-300">
      <router-view />
    </main>
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import NavigationHeader from './components/navigation/NavigationHeader.vue'
import NotificationToast from './components/ui/NotificationToast.vue'
import { useTheme } from './composables/useTheme'

// Initialize theme
const { initTheme } = useTheme()
initTheme()
</script>