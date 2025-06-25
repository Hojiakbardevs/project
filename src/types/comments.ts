export interface Comment {
  id: string
  postId: number
  parentId?: string | null
  userId: number
  username: string
  userAvatar: string
  content: string
  createdAt: string
  updatedAt: string
  likes?: number
  isLiked?: boolean
  replies?: Comment[]
  replyCount?: number
}

export interface CommentFormData {
  content: string
  parentId?: string | null
}

export interface CommentSortOption {
  value: 'newest' | 'oldest' | 'most-liked'
  label: string
}

export interface CommentStats {
  total: number
  pending: number
  approved: number
}