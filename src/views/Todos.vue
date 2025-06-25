<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Todos</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Manage your tasks and stay productive
        </p>
      </div>
      
      <div class="mt-4 sm:mt-0 flex items-center space-x-4">
        <!-- Filter -->
        <select
          v-model="filter"
          class="input w-40"
        >
          <option value="all">All Todos</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        
        <button @click="showCreateModal = true" class="btn-primary">
          Add Todo
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="card p-4 text-center">
        <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalTodos }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-semibold text-accent-600 dark:text-accent-400">{{ pendingTodos }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Pending</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-semibold text-green-600 dark:text-green-400">{{ completedTodos }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">Completed</p>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Loading todos..." />

    <!-- Todos List -->
    <div v-else class="space-y-3">
      <div
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="card p-4 flex items-center space-x-4 hover:shadow-md transition-shadow duration-200"
      >
        <!-- Checkbox -->
        <button
          @click="toggleTodo(todo)"
          class="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200"
          :class="todo.completed
            ? 'bg-green-500 border-green-500 text-white shadow-sm'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10'"
        >
          <svg v-if="todo.completed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <!-- Todo Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium"
             :class="todo.completed
               ? 'line-through text-gray-500 dark:text-gray-400'
               : 'text-gray-900 dark:text-white'">
            {{ todo.title }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            User {{ todo.userId }} • Todo #{{ todo.id }}
          </p>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <button
            @click="editTodo(todo)"
            class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            title="Edit todo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="deleteTodo(todo)"
            class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            title="Delete todo"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTodos.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h5.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 00.293-.707V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          {{ filter === 'all' ? 'No todos found' : `No ${filter} todos` }}
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ filter === 'all' ? 'Get started by creating your first todo.' : `You have no ${filter} todos at the moment.` }}
        </p>
      </div>
    </div>

    <!-- Create/Edit Todo Modal -->
    <div v-if="showCreateModal || editingTodo" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity" @click="closeModal"></div>
        
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ editingTodo ? 'Edit Todo' : 'Create New Todo' }}
          </h3>
          
          <form @submit.prevent="submitTodo">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                v-model="todoForm.title"
                type="text"
                required
                class="input w-full"
                placeholder="Enter todo title..."
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User ID
              </label>
              <input
                v-model.number="todoForm.userId"
                type="number"
                required
                min="1"
                max="10"
                class="input w-full"
              />
            </div>
            
            <div v-if="editingTodo" class="mb-6">
              <label class="flex items-center">
                <input
                  v-model="todoForm.completed"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Completed</span>
              </label>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" :disabled="submitting" class="btn-primary">
                <span v-if="submitting">{{ editingTodo ? 'Updating...' : 'Creating...' }}</span>
                <span v-else>{{ editingTodo ? 'Update Todo' : 'Create Todo' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="showDeleteDialog"
      title="Delete Todo"
      message="Are you sure you want to delete this todo? This action cannot be undone."
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
import { todoService } from '../services/todoService'
import LoadingSpinner from '../components/ui/LoadingSpinner.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import type { Todo } from '../types'
import { useToast } from '../composables/useToast'

const { success, error } = useToast()

const todos = ref<Todo[]>([])
const loading = ref(true)
const submitting = ref(false)

const filter = ref<'all' | 'pending' | 'completed'>('all')
const showCreateModal = ref(false)
const showDeleteDialog = ref(false)
const editingTodo = ref<Todo | null>(null)
const todoToDelete = ref<Todo | null>(null)

const todoForm = ref({
  title: '',
  userId: 1,
  completed: false
})

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'pending':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const totalTodos = computed(() => todos.value.length)
const pendingTodos = computed(() => todos.value.filter(todo => !todo.completed).length)
const completedTodos = computed(() => todos.value.filter(todo => todo.completed).length)

const loadTodos = async () => {
  try {
    loading.value = true
    todos.value = await todoService.getAllTodos()
  } catch (err) {
    error('Error loading todos', 'Please try again later')
    console.error('Error loading todos:', err)
  } finally {
    loading.value = false
  }
}

const toggleTodo = async (todo: Todo) => {
  try {
    await todoService.toggleComplete(todo.id, !todo.completed)
    todo.completed = !todo.completed
    success(
      todo.completed ? 'Todo completed' : 'Todo reopened',
      'Todo status has been updated successfully'
    )
  } catch (err) {
    error('Error updating todo', 'Please try again later')
    console.error('Error updating todo:', err)
  }
}

const editTodo = (todo: Todo) => {
  editingTodo.value = todo
  todoForm.value = {
    title: todo.title,
    userId: todo.userId,
    completed: todo.completed
  }
}

const deleteTodo = (todo: Todo) => {
  todoToDelete.value = todo
  showDeleteDialog.value = true
}

const submitTodo = async () => {
  try {
    submitting.value = true
    
    if (editingTodo.value) {
      // Update existing todo
      const updatedTodo = await todoService.updateTodo(editingTodo.value.id, todoForm.value)
      const index = todos.value.findIndex(t => t.id === editingTodo.value!.id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
      success('Todo updated', 'Todo has been updated successfully')
    } else {
      // Create new todo
      const newTodo = await todoService.createTodo(todoForm.value)
      todos.value.unshift(newTodo)
      success('Todo created', 'New todo has been created successfully')
    }
    
    closeModal()
  } catch (err) {
    error('Error saving todo', 'Please try again later')
    console.error('Error saving todo:', err)
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async () => {
  if (!todoToDelete.value) return
  
  try {
    await todoService.deleteTodo(todoToDelete.value.id)
    todos.value = todos.value.filter(t => t.id !== todoToDelete.value!.id)
    success('Todo deleted', 'Todo has been deleted successfully')
  } catch (err) {
    error('Error deleting todo', 'Please try again later')
    console.error('Error deleting todo:', err)
  } finally {
    todoToDelete.value = null
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTodo.value = null
  todoForm.value = {
    title: '',
    userId: 1,
    completed: false
  }
}

onMounted(() => {
  loadTodos()
})
</script>