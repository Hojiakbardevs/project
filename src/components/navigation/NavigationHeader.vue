<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
       <div class="flex items-center">
          <router-link
              to="/"
              class="group flex items-center space-x-3 hover:scale-105 transition-transform duration-300"
          >
            <div>
              <img
                  v-if="isDark"
                  src="/white_logo.svg"
                  alt="Furor Logo"
                  class="h-8 w-auto"
              >
              <img
                  v-else
                  src="/logo_furor.svg"
                  alt="Furor Logo"
                  class="h-8 w-auto"
              >
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            v-for="link in navigationLinks"
            :key="link.name"
            :to="link.path"
            class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{ 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': $route.path === link.path }"
          >
            {{ link.name }}
          </router-link>
        </nav>

        <!-- Right side controls -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative hidden lg:block">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="input w-64 pl-10"
              @keyup.enter="handleSearch"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
          >
            <svg v-if="!isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors duration-200"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
        <div class="space-y-2">
          <router-link
            v-for="link in navigationLinks"
            :key="link.name"
            :to="link.path"
            class="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-md text-base font-medium transition-colors duration-200"
            :class="{ 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': $route.path === link.path }"
            @click="mobileMenuOpen = false"
          >
            {{ link.name }}
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../../composables/useTheme'

const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const mobileMenuOpen = ref(false)
const searchQuery = ref('')

const navigationLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Users', path: '/users' },
  { name: 'Posts', path: '/posts' },
  { name: 'Todos', path: '/todos' },
  { name: 'Photos', path: '/photos' }
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Implement search functionality
    console.log('Searching for:', searchQuery.value)
  }
}
</script>