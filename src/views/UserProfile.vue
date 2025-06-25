<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Loading user profile..." />
    
    <div v-else-if="user">
      <!-- User Header -->
      <div class="card p-8 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
          <div class="flex-shrink-0">
            <div class="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-3xl">
                {{ user.name.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 sm:mt-0 flex-1">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ user.name }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">@{{ user.username }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500">{{ user.email }}</p>
            
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h3>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.address.street }}, {{ user.address.suite }}
                </p>
                <p class="text-sm text-gray-900 dark:text-white">
                  {{ user.address.city }}, {{ user.address.zipcode }}
                </p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</h3>
                <p class="text-sm text-gray-900 dark:text-white">{{ user.phone }}</p>
                <a :href="`https://${user.website}`" target="_blank" 
                   class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  {{ user.website }}
                </a>
              </div>
            </div>
            
            <div class="mt-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Company</h3>
              <p class="text-sm text-gray-900 dark:text-white">{{ user.company.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.company.catchPhrase }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
            :class="activeTab === tab.id
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          >
            {{ tab.name }}
            <span class="ml-2 py-0.5 px-2 rounded-full text-xs"
                  :class="activeTab === tab.id
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="min-h-64">
        <!-- Posts Tab -->
        <div v-if="activeTab === 'posts'">
          <LoadingSpinner v-if="loadingPosts" size="sm" />
          <div v-else-if="userPosts.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PostCard
              v-for="post in userPosts"
              :key="post.id"
              :post="post"
              @edit="handleEditPost"
              @delete="handleDeletePost"
            />
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">No posts found</p>
          </div>
        </div>

        <!-- Todos Tab -->
        <div v-if="activeTab === 'todos'">
          <LoadingSpinner v-if="loadingTodos" size="sm" />
          <div v-else-if="userTodos.length > 0" class="space-y-3">
            <div
              v-for="todo in userTodos"
              :key="todo.id"
              class="card p-4 flex items-center space-x-3"
            >
              <button
                @click="toggleTodo(todo)"
                class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200"
                :class="todo.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'"
              >
                <svg v-if="todo.completed" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <span class="flex-1 text-sm"
                    :class="todo.completed
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'">
                {{ todo.title }}
              </span>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">No todos found</p>
          </div>
        </div>

        <!-- Albums Tab -->
        <div v-if="activeTab === 'albums'">
          <LoadingSpinner v-if="loadingAlbums" size="sm" />
          <div v-else-if="userAlbums.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="album in userAlbums"
              :key="album.id"
              class="card-hover p-6"
            >
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">{{ album.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Album #{{ album.id }}</p>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">No albums found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!loading" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">User not found</h3>
      <p class="mt-2 text-gray-500 dark:text-gray-400">The user you're looking for doesn't exist.</p>
      <router-link to="/users" class="mt-4 btn-primary inline-block">
        Back to Users
      </router-link>
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
import { useRoute } from 'vue-router'
import { userService } from '../services/userService'
import { todoService } from '../services/todoService'
import { postService } from '../services/postService'
import PostCard from '../components/cards/PostCard.vue'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import type { User, Post, Todo, Album } from '../types'
import { useToast } from '../composables/useToast'

const route = useRoute()
const { success, error } = useToast()

const user = ref<User | null>(null)
const userPosts = ref<Post[]>([])
const userTodos = ref<Todo[]>([])
const userAlbums = ref<Album[]>([])

const loading = ref(true)
const loadingPosts = ref(false)
const loadingTodos = ref(false)
const loadingAlbums = ref(false)

const activeTab = ref('posts')
const showDeleteDialog = ref(false)
const postToDelete = ref<Post | null>(null)

const tabs = computed(() => [
  { id: 'posts', name: 'Posts', count: userPosts.value.length },
  { id: 'todos', name: 'Todos', count: userTodos.value.length },
  { id: 'albums', name: 'Albums', count: userAlbums.value.length }
])

const loadUser = async () => {
  try {
    const userId = parseInt(route.params.id as string)
    user.value = await userService.getUserById(userId)
    
    // Load user's content
    await Promise.all([
      loadUserPosts(userId),
      loadUserTodos(userId),
      loadUserAlbums(userId)
    ])
  } catch (err) {
    error('Error loading user', 'Please try again later')
    console.error('Error loading user:', err)
  } finally {
    loading.value = false
  }
}

const loadUserPosts = async (userId: number) => {
  try {
    loadingPosts.value = true
    userPosts.value = (await userService.getUserPosts(userId)).data
  } catch (err) {
    console.error('Error loading user posts:', err)
  } finally {
    loadingPosts.value = false
  }
}

const loadUserTodos = async (userId: number) => {
  try {
    loadingTodos.value = true
    userTodos.value = (await userService.getUserTodos(userId)).data
  } catch (err) {
    console.error('Error loading user todos:', err)
  } finally {
    loadingTodos.value = false
  }
}

const loadUserAlbums = async (userId: number) => {
  try {
    loadingAlbums.value = true
    userAlbums.value = (await userService.getUserAlbums(userId)).data
  } catch (err) {
    console.error('Error loading user albums:', err)
  } finally {
    loadingAlbums.value = false
  }
}

const toggleTodo = async (todo: Todo) => {
  try {
    await todoService.toggleComplete(todo.id, !todo.completed)
    todo.completed = !todo.completed
    success('Todo updated', 'Todo status has been updated successfully')
  } catch (err) {
    error('Error updating todo', 'Please try again later')
    console.error('Error updating todo:', err)
  }
}

const handleEditPost = (post: Post) => {
  // Navigate to edit post or open edit modal
  console.log('Edit post:', post)
}

const handleDeletePost = (post: Post) => {
  postToDelete.value = post
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!postToDelete.value) return
  
  try {
    await postService.deletePost(postToDelete.value.id)
    userPosts.value = userPosts.value.filter(p => p.id !== postToDelete.value!.id)
    success('Post deleted', 'Post has been deleted successfully')
  } catch (err) {
    error('Error deleting post', 'Please try again later')
    console.error('Error deleting post:', err)
  } finally {
    postToDelete.value = null
  }
}

onMounted(() => {
  loadUser()
})
</script>