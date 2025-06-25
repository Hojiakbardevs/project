<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Discover and manage blog posts
        </p>
      </div>
      
      <div class="mt-4 sm:mt-0 flex items-center space-x-4">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts..."
            class="input w-64 pl-10"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <button @click="showCreateModal = true" class="btn-primary">
          Create Post
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Loading posts..." />

    <!-- Posts Grid -->
    <div v-else>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PostCard
          v-for="post in displayedPosts"
          :key="post.id"
          :post="post"
          :comment-count="getCommentCount(post.id)"
          @edit="handleEditPost"
          @delete="handleDeletePost"
        />
      </div>

      <!-- Load More Button -->
      <div v-if="hasMorePosts" class="text-center">
        <button
          @click="loadMorePosts"
          :disabled="loadingMore"
          class="btn-secondary"
        >
          <span v-if="loadingMore">Loading...</span>
          <span v-else>Load More Posts</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="displayedPosts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating a new post.' }}
        </p>
      </div>
    </div>

    <!-- Create/Edit Post Modal -->
    <div v-if="showCreateModal || editingPost" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity" @click="closeModal"></div>
        
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ editingPost ? 'Edit Post' : 'Create New Post' }}
          </h3>
          
          <form @submit.prevent="submitPost">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                v-model="postForm.title"
                type="text"
                required
                class="input w-full"
                placeholder="Enter post title..."
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <textarea
                v-model="postForm.body"
                required
                rows="6"
                class="input w-full resize-none"
                placeholder="Write your post content..."
              ></textarea>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author (User ID)
              </label>
              <input
                v-model.number="postForm.userId"
                type="number"
                required
                min="1"
                max="10"
                class="input w-full"
              />
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" :disabled="submitting" class="btn-primary">
                <span v-if="submitting">{{ editingPost ? 'Updating...' : 'Creating...' }}</span>
                <span v-else>{{ editingPost ? 'Update Post' : 'Create Post' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="showDeleteDialog"
      title="Delete Post"
      message="Are you sure you want to delete this post? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
      @close="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { postService } from '../services/postService'
import PostCard from '../components/cards/PostCard.vue'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import type { Post, Comment } from '../types'
import { useToast } from '../composables/useToast'

const { success, error } = useToast()

const posts = ref<Post[]>([])
const comments = ref<Comment[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const submitting = ref(false)

const searchQuery = ref('')
const currentPage = ref(1)
const postsPerPage = 10

const showCreateModal = ref(false)
const showDeleteDialog = ref(false)
const editingPost = ref<Post | null>(null)
const postToDelete = ref<Post | null>(null)

const postForm = ref({
  title: '',
  body: '',
  userId: 1
})

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value
  
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.body.toLowerCase().includes(query)
  )
})

const displayedPosts = computed(() => {
  return filteredPosts.value.slice(0, currentPage.value * postsPerPage)
})

const hasMorePosts = computed(() => {
  return displayedPosts.value.length < filteredPosts.value.length
})

const getCommentCount = (postId: number) => {
  return comments.value.filter(comment => comment.postId === postId).length
}

const loadPosts = async () => {
  try {
    loading.value = true
    const [postsData, commentsData] = await Promise.all([
      postService.getAllPosts(),
      postService.getPostComments(1) // Load all comments for post 1 as sample
    ])
    
    posts.value = postsData
    comments.value = commentsData
  } catch (err) {
    error('Error loading posts', 'Please try again later')
    console.error('Error loading posts:', err)
  } finally {
    loading.value = false
  }
}

const loadMorePosts = () => {
  loadingMore.value = true
  currentPage.value++
  // Simulate loading delay
  setTimeout(() => {
    loadingMore.value = false
  }, 500)
}

const handleEditPost = (post: Post) => {
  editingPost.value = post
  postForm.value = {
    title: post.title,
    body: post.body,
    userId: post.userId
  }
}

const handleDeletePost = (post: Post) => {
  postToDelete.value = post
  showDeleteDialog.value = true
}

const submitPost = async () => {
  try {
    submitting.value = true
    
    if (editingPost.value) {
      // Update existing post
      const updatedPost = await postService.updatePost(editingPost.value.id, postForm.value)
      const index = posts.value.findIndex(p => p.id === editingPost.value!.id)
      if (index !== -1) {
        posts.value[index] = updatedPost
      }
      success('Post updated', 'Post has been updated successfully')
    } else {
      // Create new post
      const newPost = await postService.createPost(postForm.value)
      posts.value.unshift(newPost)
      success('Post created', 'New post has been created successfully')
    }
    
    closeModal()
  } catch (err) {
    error('Error saving post', 'Please try again later')
    console.error('Error saving post:', err)
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async () => {
  if (!postToDelete.value) return
  
  try {
    await postService.deletePost(postToDelete.value.id)
    posts.value = posts.value.filter(p => p.id !== postToDelete.value!.id)
    success('Post deleted', 'Post has been deleted successfully')
  } catch (err) {
    error('Error deleting post', 'Please try again later')
    console.error('Error deleting post:', err)
  } finally {
    postToDelete.value = null
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingPost.value = null
  postForm.value = {
    title: '',
    body: '',
    userId: 1
  }
}

onMounted(() => {
  loadPosts()
})
</script>