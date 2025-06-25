<template>
  <div class="comment-form bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    <form @submit.prevent="handleSubmit">
      <!-- Text Input -->
      <div class="mb-3">
        <textarea
          ref="textareaRef"
          v-model="content"
          :placeholder="placeholder"
          rows="3"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          :class="{ 'border-red-500': hasError }"
          @input="handleInput"
          @keydown="handleKeydown"
        ></textarea>
        
        <!-- Character Count -->
        <div class="flex justify-between items-center mt-2 text-xs">
          <div class="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <!-- Formatting Options -->
            <button
              type="button"
              @click="insertFormatting('**', '**')"
              class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
              title="Bold"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
              </svg>
            </button>
            
            <button
              type="button"
              @click="insertFormatting('*', '*')"
              class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
              title="Italic"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4l4 16M6 8h12M4 16h12" />
              </svg>
            </button>
            
            <button
              type="button"
              @click="insertFormatting('`', '`')"
              class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
              title="Code"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
          </div>
          
          <span
            class="text-xs"
            :class="characterCount > maxLength ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'"
          >
            {{ characterCount }}/{{ maxLength }}
          </span>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-1 text-xs text-red-500">
          {{ errorMessage }}
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-2">
        <button
          v-if="isEdit || parentId"
          type="button"
          @click="handleCancel"
          class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          :disabled="!canSubmit || isLoading"
          class="px-4 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="isLoading">
            {{ isEdit ? 'Updating...' : 'Posting...' }}
          </span>
          <span v-else>
            {{ isEdit ? 'Update' : 'Post Comment' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import type { CommentFormData } from '../../types/comments'

interface Props {
  parentId?: string | null
  initialContent?: string
  placeholder?: string
  isLoading?: boolean
  isEdit?: boolean
  maxLength?: number
}

const props = withDefaults(defineProps<Props>(), {
  parentId: null,
  initialContent: '',
  placeholder: 'Write a comment...',
  isLoading: false,
  isEdit: false,
  maxLength: 1000
})

const emit = defineEmits<{
  submit: [data: CommentFormData]
  cancel: []
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const content = ref(props.initialContent)
const errorMessage = ref('')

const characterCount = computed(() => content.value.length)
const hasError = computed(() => !!errorMessage.value)

const canSubmit = computed(() => {
  return content.value.trim().length > 0 && 
         content.value.length <= props.maxLength && 
         !props.isLoading
})

const handleInput = () => {
  errorMessage.value = ''
  
  if (content.value.length > props.maxLength) {
    errorMessage.value = `Comment must be ${props.maxLength} characters or less`
  }
  
  // Auto-resize textarea
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Submit on Ctrl/Cmd + Enter
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    handleSubmit()
  }
}

const handleSubmit = () => {
  if (!canSubmit.value) return
  
  const trimmedContent = content.value.trim()
  if (!trimmedContent) {
    errorMessage.value = 'Comment cannot be empty'
    return
  }
  
  const formData: CommentFormData = {
    content: trimmedContent,
    parentId: props.parentId
  }
  
  emit('submit', formData)
  
  if (!props.isEdit) {
    content.value = ''
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  }
}

const handleCancel = () => {
  content.value = props.initialContent
  errorMessage.value = ''
  emit('cancel')
}

const insertFormatting = (before: string, after: string) => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)
  
  const newText = content.value.substring(0, start) + 
                  before + selectedText + after + 
                  content.value.substring(end)
  
  content.value = newText
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + before.length, end + before.length)
  })
}

// Watch for initial content changes
watch(() => props.initialContent, (newValue) => {
  content.value = newValue
})

onMounted(() => {
  if (props.parentId && textareaRef.value) {
    textareaRef.value.focus()
  }
})
</script>