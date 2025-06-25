<template>
  <div class="comment-item" :class="{ 'ml-8': currentDepth > 0 }">
    <div class="flex space-x-3">
      <!-- User Avatar -->
      <div class="flex-shrink-0">
        <img
          :src="comment.userAvatar"
          :alt="comment.username"
          class="w-8 h-8 rounded-full object-cover"
          @error="handleAvatarError"
        />
      </div>
      
      <div class="flex-1 min-w-0">
        <!-- Comment Header -->
        <div class="flex items-center space-x-2 mb-1">
          <span class="font-medium text-gray-900 dark:text-white text-sm">
            {{ comment.username }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatTimestamp(comment.createdAt) }}
          </span>
          <span v-if="comment.updatedAt !== comment.createdAt" class="text-xs text-gray-400 dark:text-gray-500">
            (edited)
          </span>
        </div>
        
        <!-- Comment Content -->
        <div class="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
          {{ comment.content }}
        </div>
        
        <!-- Comment Actions -->
        <div class="flex items-center space-x-4 text-xs">
          <!-- Like Button -->
          <button
            @click="$emit('like', comment)"
            class="flex items-center space-x-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
            :class="{ 'text-primary-600 dark:text-primary-400': comment.isLiked }"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ comment.likes || 0 }}</span>
          </button>
          
          <!-- Reply Button -->
          <button
            v-if="currentDepth < maxDepth"
            @click="toggleReplyForm"
            class="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
          >
            Reply
          </button>
          
          <!-- Edit Button (only for own comments) -->
          <button
            v-if="comment.userId === currentUserId"
            @click="$emit('edit', comment)"
            class="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
          >
            Edit
          </button>
          
          <!-- Delete Button (only for own comments) -->
          <button
            v-if="comment.userId === currentUserId"
            @click="$emit('delete', comment)"
            class="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
        
        <!-- Reply Form -->
        <div v-if="showReplyForm" class="mt-3">
          <CommentForm
            :parent-id="comment.id"
            :is-loading="false"
            :placeholder="`Reply to ${comment.username}...`"
            @submit="handleReplySubmit"
            @cancel="showReplyForm = false"
            class="reply-form"
          />
        </div>
        
        <!-- Replies -->
        <div v-if="replies.length > 0" class="mt-4 space-y-3">
          <CommentItem
            v-for="reply in replies"
            :key="reply.id"
            :comment="reply"
            :current-user-id="currentUserId"
            :replies="[]"
            :max-depth="maxDepth"
            :current-depth="currentDepth + 1"
            @reply="$emit('reply', $event)"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
            @like="$emit('like', $event)"
            @load-replies="$emit('load-replies', $event)"
          />
        </div>
        
        <!-- Load More Replies Button -->
        <div v-if="comment.replyCount && comment.replyCount > replies.length" class="mt-3">
          <button
            @click="$emit('load-replies', comment.id)"
            class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            Load {{ comment.replyCount - replies.length }} more replies
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommentForm from './CommentForm.vue'
import type { Comment, CommentFormData } from '../../types/comments'

interface Props {
  comment: Comment
  currentUserId: number
  replies: Comment[]
  maxDepth: number
  currentDepth: number
}

defineProps<Props>()

const emit = defineEmits<{
  reply: [comment: Comment]
  edit: [comment: Comment]
  delete: [comment: Comment]
  like: [comment: Comment]
  'load-replies': [commentId: string]
}>()

const showReplyForm = ref(false)

const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value
}

const handleReplySubmit = (formData: CommentFormData) => {
  // Emit to parent component to handle the reply
  emit('reply', { ...formData, parentId: formData.parentId } as any)
  showReplyForm.value = false
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.comment.username)}&background=3B82F6&color=fff&size=32`
}
</script>