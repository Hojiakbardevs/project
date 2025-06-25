import api from './api'
import type { Post, Comment } from '../types'

export const postService = {
  async getAllPosts(): Promise<Post[]> {
    return await api.get('/posts')
  },
  
  async getPostById(id: number): Promise<Post> {
    return await api.get(`/posts/${id}`)
  },
  
  async getPostComments(postId: number): Promise<Comment[]> {
    return await api.get(`/posts/${postId}/comments`)
  },
  
  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    return await api.post('/posts', post)
  },
  
  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    return await api.put(`/posts/${id}`, post)
  },
  
  async deletePost(id: number): Promise<void> {
    return await api.delete(`/posts/${id}`)
  }
}