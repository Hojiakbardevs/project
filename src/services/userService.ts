import api from './api'
import type { User } from '../types'

export const userService = {
  async getAllUsers(): Promise<User[]> {
    return await api.get('/users')
  },
  
  async getUserById(id: number): Promise<User> {
    return await api.get(`/users/${id}`)
  },
  
  async getUserPosts(userId: number) {
    return await api.get(`/users/${userId}/posts`)
  },
  
  async getUserTodos(userId: number) {
    return await api.get(`/users/${userId}/todos`)
  },
  
  async getUserAlbums(userId: number) {
    return await api.get(`/users/${userId}/albums`)
  }
}