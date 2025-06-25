<template>
  <div class="comments-section">
    <!-- Comments Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Comments ({{ totalComments }})
      </h3>
      
      <!-- Sort Options -->
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-500 dark:text-gray-400">Sort by:</label>
        <select
          v-model="sortBy"
          class="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most-liked">Most Liked</option>
        </select>
      </div>
    </div>

    <!-- Comment Input Form -->
    <CommentForm
      :is-loading="submittingComment"
      :parent-id="null"
      @submit="handleSubmitComment"
      class="mb-8"
    />

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" text="Loading comments..." size="sm" />

    <!-- Comments List -->
    <div v-else-if="sortedComments.length > 0" class="space-y-4">
      <CommentItem
        v-for="comment in paginatedComments"
        :key="comment.id"
        :comment="comment"
        :current-user-id="currentUserId"
        :replies="getCommentReplies(comment.id)"
        :max-depth="maxDepth"
        :current-depth="0"
        @reply="handleReply"
        @edit="handleEdit"
        @delete="handleDelete"
        @like="handleLike"
        @load-replies="loadReplies"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No comments yet</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Be the first to share your thoughts!
      </p>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMoreComments" class="text-center mt-6">
      <button
        @click="loadMoreComments"
        :disabled="loadingMore"
        class="btn-secondary"
      >
        <span v-if="loadingMore">Loading...</span>
        <span v-else>Load More Comments</span>
      </button>
    </div>

    <!-- Edit Comment Modal -->
    <div v-if="editingComment" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity" @click="cancelEdit"></div>
        
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Edit Comment
          </h3>
          
          <CommentForm
            :initial-content="editingComment.content"
            :is-loading="updatingComment"
            :is-edit="true"
            @submit="handleUpdateComment"
            @cancel="cancelEdit"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :is-open="showDeleteDialog"
      title="Delete Comment"
      message="Are you sure you want to delete this comment? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteDialog = false"
      @close="showDeleteDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CommentItem from './CommentItem.vue'
import CommentForm from './CommentForm.vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import ConfirmDialog from '../ui/ConfirmDialog.vue'
import type { Comment, CommentFormData } from '../../types/comments'
import { useToast } from '../../composables/useToast'

interface Props {
  postId: number
  currentUserId?: number
  maxDepth?: number
  commentsPerPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentUserId: 1,
  maxDepth: 3,
  commentsPerPage: 10
})

const emit = defineEmits<{
  'comments-loaded': [count: number]
  'comment-added': [comment: Comment]
  'comment-updated': [comment: Comment]
  'comment-deleted': [commentId: string]
}>()

const { success, error } = useToast()

// State
const comments = ref<Comment[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const submittingComment = ref(false)
const updatingComment = ref(false)

const sortBy = ref<'newest' | 'oldest' | 'most-liked'>('newest')
const currentPage = ref(1)

const editingComment = ref<Comment | null>(null)
const showDeleteDialog = ref(false)
const commentToDelete = ref<Comment | null>(null)

// Computed
const totalComments = computed(() => {
  return comments.value.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0)
  }, 0)
})

const sortedComments = computed(() => {
  const sorted = [...comments.value.filter(c => !c.parentId)]
  
  switch (sortBy.value) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'most-liked':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
})

const paginatedComments = computed(() => {
  return sortedComments.value.slice(0, currentPage.value * props.commentsPerPage)
})

const hasMoreComments = computed(() => {
  return paginatedComments.value.length < sortedComments.value.length
})

// Methods
const loadComments = async () => {
  try {
    loading.value = true
    // Simulate API call - replace with actual API
    const mockComments: Comment[] = [
      {
        id: '1',
        postId: props.postId,
        userId: 1,
        username: 'john_doe',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        content: 'This is a great post! Thanks for sharing your insights.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 5,
        isLiked: false,
        replies: []
      },
      {
        id: '2',
        postId: props.postId,
        userId: 2,
        username: 'jane_smith',
        userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        content: 'I completely agree with your points. The examples you provided really help illustrate the concepts.',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        likes: 3,
        isLiked: true,
        replies: [
          {
            id: '3',
            postId: props.postId,
            parentId: '2',
            userId: 3,
            username: 'mike_wilson',
            userAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
            content: 'Exactly! The practical examples make it so much easier to understand.',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            likes: 1,
            isLiked: false,
            replies: []
          }
        ]
      }
    ]
    
    comments.value = mockComments
    emit('comments-loaded', totalComments.value)
  } catch (err) {
    error('Error loading comments', 'Please try again later')
    console.error('Error loading comments:', err)
  } finally {
    loading.value = false
  }
}

const loadMoreComments = () => {
  loadingMore.value = true
  currentPage.value++
  // Simulate loading delay
  setTimeout(() => {
    loadingMore.value = false
  }, 500)
}

const handleSubmitComment = async (formData: CommentFormData) => {
  try {
    submittingComment.value = true
    
    // Simulate API call
    const newComment: Comment = {
      id: Date.now().toString(),
      postId: props.postId,
      parentId: formData.parentId,
      userId: props.currentUserId,
      username: 'current_user',
      userAvatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      content: formData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    }
    
    if (formData.parentId) {
      // Add as reply
      const parentComment = findCommentById(formData.parentId)
      if (parentComment) {
        parentComment.replies = parentComment.replies || []
        parentComment.replies.push(newComment)
      }
    } else {
      // Add as top-level comment
      comments.value.unshift(newComment)
    }
    
    emit('comment-added', newComment)
    success('Comment posted', 'Your comment has been posted successfully')
  } catch (err) {
    error('Error posting comment', 'Please try again later')
    console.error('Error posting comment:', err)
  } finally {
    submittingComment.value = false
  }
}

const handleReply = (comment: Comment) => {
  // Scroll to comment form and focus with parent ID
  const form = document.querySelector('.comment-form') as HTMLElement
  if (form) {
    form.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleEdit = (comment: Comment) => {
  editingComment.value = comment
}

const handleUpdateComment = async (formData: CommentFormData) => {
  if (!editingComment.value) return
  
  try {
    updatingComment.value = true
    
    // Update comment content
    editingComment.value.content = formData.content
    editingComment.value.updatedAt = new Date().toISOString()
    
    emit('comment-updated', editingComment.value)
    success('Comment updated', 'Your comment has been updated successfully')
    cancelEdit()
  } catch (err) {
    error('Error updating comment', 'Please try again later')
    console.error('Error updating comment:', err)
  } finally {
    updatingComment.value = false
  }
}

const cancelEdit = () => {
  editingComment.value = null
}

const handleDelete = (comment: Comment) => {
  commentToDelete.value = comment
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  if (!commentToDelete.value) return
  
  try {
    const commentId = commentToDelete.value.id
    
    if (commentToDelete.value.parentId) {
      // Remove reply
      const parentComment = findCommentById(commentToDelete.value.parentId)
      if (parentComment && parentComment.replies) {
        parentComment.replies = parentComment.replies.filter(r => r.id !== commentId)
      }
    } else {
      // Remove top-level comment
      comments.value = comments.value.filter(c => c.id !== commentId)
    }
    
    emit('comment-deleted', commentId)
    success('Comment deleted', 'Comment has been deleted successfully')
  } catch (err) {
    error('Error deleting comment', 'Please try again later')
    console.error('Error deleting comment:', err)
  } finally {
    commentToDelete.value = null
  }
}

const handleLike = async (comment: Comment) => {
  try {
    // Toggle like status
    comment.isLiked = !comment.isLiked
    comment.likes = (comment.likes || 0) + (comment.isLiked ? 1 : -1)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200))
  } catch (err) {
    // Revert on error
    comment.isLiked = !comment.isLiked
    comment.likes = (comment.likes || 0) + (comment.isLiked ? 1 : -1)
    error('Error updating like', 'Please try again later')
  }
}

const loadReplies = async (commentId: string) => {
  // Simulate loading more replies
  console.log('Loading replies for comment:', commentId)
}

const getCommentReplies = (commentId: string): Comment[] => {
  const comment = findCommentById(commentId)
  return comment?.replies || []
}

const findCommentById = (id: string): Comment | null => {
  for (const comment of comments.value) {
    if (comment.id === id) return comment
    if (comment.replies) {
      for (const reply of comment.replies) {
        if (reply.id === id) return reply
      }
    }
  }
  return null
}

// Watch for sort changes
watch(sortBy, () => {
  currentPage.value = 1
})

onMounted(() => {
  loadComments()
})
</script>