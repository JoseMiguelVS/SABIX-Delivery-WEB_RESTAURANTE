import { ref, watch, onMounted } from 'vue'

const THEME_KEY = 'app-theme'

export function useTheme() {
  const currentTheme = ref(localStorage.getItem(THEME_KEY) || 'system')

  // Aplicar tema
  const applyTheme = (theme) => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
      localStorage.removeItem(THEME_KEY)
    } else {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem(THEME_KEY, theme)
    }
    currentTheme.value = theme
  }

  // Cambiar tema
  const setTheme = (theme) => {
    applyTheme(theme)
  }

  // Alternar entre claro y oscuro
  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    applyTheme(newTheme)
  }

  // Inicializar
  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme) {
      applyTheme(savedTheme)
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark ? 'dark' : 'light')
    }
  })

  // Escuchar cambios en la preferencia del sistema
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  return {
    currentTheme,
    setTheme,
    toggleTheme,
    isDark: () => currentTheme.value === 'dark',
    isLight: () => currentTheme.value === 'light',
    isSystem: () => currentTheme.value === 'system',
  }
}
