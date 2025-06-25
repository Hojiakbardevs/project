<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Welcome back! Here's what's happening on your platform.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.users }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.posts }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h5.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 00.293-.707V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Todos</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.todos }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Photos</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.photos }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Posts -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h2>
          <router-link to="/posts" class="text-primary-600 dark:text-primary-400 text-sm hover:underline">
            View all
          </router-link>
        </div>
        <div class="space-y-4">
          <div v-for="post in recentPosts" :key="post.id" class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                {{ post.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                By User {{ post.userId }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Todos -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Todos</h2>
          <router-link to="/todos" class="text-primary-600 dark:text-primary-400 text-sm hover:underline">
            View all
          </router-link>
        </div>
        <div class="space-y-4">
          <div v-for="todo in recentTodos" :key="todo.id" class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-4 h-4 rounded border-2 flex items-center justify-center"
                   :class="todo.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'">
                <svg v-if="todo.completed" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white line-clamp-1"
                 :class="{ 'line-through text-gray-500 dark:text-gray-400': todo.completed }">
                {{ todo.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                User {{ todo.userId }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link to="/users" class="card-hover p-4 text-center">
          <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-900 dark:text-white">Manage Users</span>
        </router-link>

        <router-link to="/posts" class="card-hover p-4 text-center">
          <div class="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg class="w-5 h-5 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-900 dark:text-white">Create Post</span>
        </router-link>

        <router-link to="/todos" class="card-hover p-4 text-center">
          <div class="w-8 h-8 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg class="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h5.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 00.293-.707V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-900 dark:text-white">Add Todo</span>
        </router-link>

        <router-link to="/photos" class="card-hover p-4 text-center">
          <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-900 dark:text-white">View Gallery</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService } from '../services/userService'
import { postService } from '../services/postService'
import { todoService } from '../services/todoService'
import { photoService } from '../services/photoService'
import type { Post, Todo } from '../types'

const stats = ref({
  users: 0,
  posts: 0,
  todos: 0,
  photos: 0
})

const recentPosts = ref<Post[]>([])
const recentTodos = ref<Todo[]>([])

onMounted(async () => {
  try {
    // Load dashboard data
    const [users, posts, todos, photos] = await Promise.all([
      userService.getAllUsers(),
      postService.getAllPosts(),
      todoService.getAllTodos(),
      photoService.getAllPhotos()
    ])

    stats.value = {
      users: users.length,
      posts: posts.length,
      todos: todos.length,
      photos: photos.length
    }

    // Get recent items (last 5)
    recentPosts.value = posts.slice(0, 5)
    recentTodos.value = todos.slice(0, 5)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>