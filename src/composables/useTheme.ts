import { ref, computed } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const theme = computed(() => isDark.value ? 'dark' : 'light')
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
  }
  
  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
  
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
    updateTheme()
  }
  
  return {
    isDark,
    theme,
    toggleTheme,
    initTheme
  }
}