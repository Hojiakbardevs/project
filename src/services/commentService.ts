import api from './api'
import type { Comment, CommentFormData } from '../types/comments'

export const commentService = {
  async getPostComments(postId: number): Promise<Comment[]> {
    return await api.get(`/posts/${postId}/comments`)
  },
  
  async createComment(postId: number, data: CommentFormData): Promise<Comment> {
    return await api.post(`/posts/${postId}/comments`, data)
  },
  
  async updateComment(commentId: string, data: Partial<CommentFormData>): Promise<Comment> {
    return await api.put(`/comments/${commentId}`, data)
  },
  
  async deleteComment(commentId: string): Promise<void> {
    return await api.delete(`/comments/${commentId}`)
  },
  
  async likeComment(commentId: string): Promise<void> {
    return await api.post(`/comments/${commentId}/like`)
  },
  
  async unlikeComment(commentId: string): Promise<void> {
    return await api.delete(`/comments/${commentId}/like`)
  },
  
  async getCommentReplies(commentId: string): Promise<Comment[]> {
    return await api.get(`/comments/${commentId}/replies`)
  },
  
  async reportComment(commentId: string, reason: string): Promise<void> {
    return await api.post(`/comments/${commentId}/report`, { reason })
  }
}