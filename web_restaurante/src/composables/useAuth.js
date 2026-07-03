import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import authService from '@/services/auth'
import { validateLogin, validateRegister, validatePasswordMatch } from '@/validators/authValidators'
import { AUTH_MESSAGES } from '@/constants/authMessages'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Estado compartido
  const isLoading = ref(false)
  const error = ref('')
  const success = ref('')

  // Datos del login
  const loginForm = reactive({
    email: '',
    password: '',
  })

  // Datos del registro
  const registerForm = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Estado UI
  const showPassword = ref(false)
  const rememberMe = ref(false)

  /**
   * Iniciar sesión
   */
  const handleLogin = async () => {
    // Validar formulario
    const validation = validateLogin(loginForm)
    if (!validation.isValid) {
      error.value = validation.message
      return
    }

    isLoading.value = true
    error.value = ''

    try {
      const result = await authStore.login(loginForm.email, loginForm.password)

      if (result.success) {
        if (rememberMe.value) {
          localStorage.setItem('remember_me', 'true')
        }
        router.push('/')
        return { success: true }
      } else {
        error.value = result.message || AUTH_MESSAGES.LOGIN_ERROR
        return { success: false, message: error.value }
      }
    } catch (err) {
      error.value = AUTH_MESSAGES.CONNECTION_ERROR
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registrar usuario
   */
  const handleRegister = async () => {
    // Validar formulario
    const validation = validateRegister(registerForm)
    if (!validation.isValid) {
      error.value = validation.message
      return
    }

    // Validar contraseñas
    const passwordValidation = validatePasswordMatch(
      registerForm.password,
      registerForm.confirmPassword,
    )
    if (!passwordValidation.isValid) {
      error.value = passwordValidation.message
      return
    }

    isLoading.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await authService.register(registerForm)

      if (result.success) {
        success.value = AUTH_MESSAGES.REGISTER_SUCCESS
        setTimeout(() => {
          router.push('/login')
        }, 2000)
        return { success: true }
      } else {
        error.value = result.message || AUTH_MESSAGES.REGISTER_ERROR
        return { success: false, message: error.value }
      }
    } catch (err) {
      error.value = AUTH_MESSAGES.CONNECTION_ERROR
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cerrar sesión
   */
  const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
  }

  /**
   * Resetear estados
   */
  const resetAuthState = () => {
    error.value = ''
    success.value = ''
    isLoading.value = false
  }

  /**
   * Limpiar formularios
   */
  const clearForms = () => {
    loginForm.email = ''
    loginForm.password = ''
    registerForm.name = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    error.value = ''
    success.value = ''
  }

  return {
    // Estado
    isLoading,
    error,
    success,
    loginForm,
    registerForm,
    showPassword,
    rememberMe,

    // Acciones
    handleLogin,
    handleRegister,
    handleLogout,
    resetAuthState,
    clearForms,

    // Getters
    isAuthenticated: () => authStore.isAuthenticated,
    user: () => authStore.user,
  }
}
