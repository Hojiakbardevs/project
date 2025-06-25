<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Manage and explore user profiles
        </p>
      </div>
      
      <!-- Search -->
      <div class="mt-4 sm:mt-0 sm:ml-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="input w-64 pl-10"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Loading users..." />

    <!-- Users Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UserCard
        v-for="user in filteredUsers"
        :key="user.id"
        :user="user"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredUsers.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ searchQuery ? 'Try adjusting your search terms.' : 'No users available at the moment.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userService } from '../services/userService'
import UserCard from '../components/cards/UserCard.vue'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import type { User } from '../types'
import { useToast } from '../composables/useToast'

const { error } = useToast()

const users = ref<User[]>([])
const loading = ref(true)
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.company.name.toLowerCase().includes(query)
  )
})

const loadUsers = async () => {
  try {
    loading.value = true
    users.value = await userService.getAllUsers()
  } catch (err) {
    error('Error loading users', 'Please try again later')
    console.error('Error loading users:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>