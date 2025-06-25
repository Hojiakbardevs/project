<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Loading post..." />
    
    <div v-else-if="post">
      <!-- Back Button -->
      <router-link to="/posts" class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-6">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Posts
      </router-link>

      <!-- Post Content -->
      <article class="card p-8 mb-8">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {{ post.title }}
          </h1>
          <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              By User {{ post.userId }}
            </span>
            <span class="mx-2">•</span>
            <span>{{ commentCount }} comments</span>
          </div>
        </header>
        
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ post.body }}
          </p>
        </div>
      </article>

      <!-- Comments Section -->
      <section class="card p-8">
        <CommentsSection
          :post-id="post.id"
          :current-user-id="1"
          @comments-loaded="handleCommentsLoaded"
          @comment-added="handleCommentAdded"
          @comment-updated="handleCommentUpdated"
          @comment-deleted="handleCommentDeleted"
        />
      </section>
    </div>

    <!-- Error State -->
    <div v-else-if="!loading" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Post not found</h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">The post you're looking for doesn't exist.</p>
      <router-link to="/posts" class="mt-4 btn-primary inline-block">
        Back to Posts
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { postService } from '../services/postService'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import CommentsSection from '../components/comments/CommentsSection.vue'
import type { Post, Comment } from '../types'
import { useToast } from '../composables/useToast'

const route = useRoute()
const { error } = useToast()

const post = ref<Post | null>(null)
const loading = ref(true)
const commentCount = ref(0)

const loadPost = async () => {
  try {
    const postId = parseInt(route.params.id as string)
    post.value = await postService.getPostById(postId)
  } catch (err) {
    error('Error loading post', 'Please try again later')
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

const handleCommentsLoaded = (count: number) => {
  commentCount.value = count
}

const handleCommentAdded = (comment: any) => {
  commentCount.value++
  console.log('Comment added:', comment)
}

const handleCommentUpdated = (comment: any) => {
  console.log('Comment updated:', comment)
}

const handleCommentDeleted = (commentId: string) => {
  commentCount.value--
  console.log('Comment deleted:', commentId)
}

onMounted(() => {
  loadPost()
})
</script>