import { ref } from 'vue'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random().toString()
    const newToast = {
      id,
      duration: 5000,
      ...toast
    }
    
    toasts.value.push(newToast)
    
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (title: string, message?: string) => {
    addToast({ type: 'success', title, message })
  }
  
  const error = (title: string, message?: string) => {
    addToast({ type: 'error', title, message })
  }
  
  const warning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message })
  }
  
  const info = (title: string, message?: string) => {
    addToast({ type: 'info', title, message })
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}