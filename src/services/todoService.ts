import api from './api'
import type { Todo } from '../types'

export const todoService = {
  async getAllTodos(): Promise<Todo[]> {
    return await api.get('/todos')
  },
  
  async getTodoById(id: number): Promise<Todo> {
    return await api.get(`/todos/${id}`)
  },
  
  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    return await api.post('/todos', todo)
  },
  
  async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    return await api.put(`/todos/${id}`, todo)
  },
  
  async deleteTodo(id: number): Promise<void> {
    return await api.delete(`/todos/${id}`)
  },
  
  async toggleComplete(id: number, completed: boolean): Promise<Todo> {
    return await api.patch(`/todos/${id}`, { completed })
  }
}