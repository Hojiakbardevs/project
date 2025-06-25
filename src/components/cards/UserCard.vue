<template>
  <div class="card-hover p-6">
    <div class="flex items-center space-x-4">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
          <span class="text-white font-semibold text-lg">
            {{ user.name.charAt(0).toUpperCase() }}
          </span>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
          {{ user.name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
          @{{ user.username }}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-300 truncate">
          {{ user.email }}
        </p>
      </div>
      <div class="flex-shrink-0">
        <router-link
          :to="`/users/${user.id}`"
          class="btn-primary"
        >
          View Profile
        </router-link>
      </div>
    </div>
    
    <div class="mt-4 grid grid-cols-2 gap-4 text-center">
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
        <p class="text-sm text-gray-500 dark:text-gray-400">Company</p>
        <p class="font-medium text-gray-900 dark:text-gray-100 truncate">
          {{ user.company.name }}
        </p>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
        <p class="text-sm text-gray-500 dark:text-gray-400">Website</p>
        <a
          :href="`https://${user.website}`"
          target="_blank"
          class="font-medium text-primary-600 dark:text-primary-400 hover:underline truncate block"
        >
          {{ user.website }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../../types'

interface Props {
  user: User
}

defineProps<Props>()
</script>