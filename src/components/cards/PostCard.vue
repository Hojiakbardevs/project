<template>
  <div class="card-hover p-6">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {{ post.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {{ post.body }}
        </p>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User {{ post.userId }}
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ commentCount }} comments
            </span>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="handleEdit"
              class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              title="Edit post"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="handleDelete"
              class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
              title="Delete post"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-4 flex justify-between items-center">
      <router-link
        :to="`/posts/${post.id}`"
        class="btn-secondary"
      >
        Read More
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '../../types'

interface Props {
  post: Post
  commentCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  commentCount: 0
})

const emit = defineEmits<{
  edit: [post: Post]
  delete: [post: Post]
}>()

const handleEdit = () => {
  emit('edit', props.post)
}

const handleDelete = () => {
  emit('delete', props.post)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>