import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import authService from '@/services/auth'
import {
  validateLogin,
  validateRegister,
  validatePasswordMatch,
  // validateField as validateFieldValidator,
  validateUsername,
} from '@/validators/authValidators'
import { AUTH_MESSAGES } from '@/constants/authMessages'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Estado
  const isLoading = ref(false)
  const error = ref('')
  const success = ref('')
  const showPassword = ref(false)
  const rememberMe = ref(false)

  // Verificaciones en tiempo real
  const checkingUsername = ref(false)
  const checkingEmail = ref(false)
  const usernameAvailable = ref(null)
  const emailAvailable = ref(null)

  // Formulario de login
  const loginForm = reactive({
    username: '',
    password: '',
    password2: '',
  })

  // Formulario de registro
  const registerForm = reactive({
    full_name: '',
    username: '',
    address: '',
    bank_account: '',
    phone: '',
    email: '',
    schedule: '',
    password: '',
    confirm_password: '',
  })

  // Login
  const handleLogin = async () => {
    const validation = validateLogin(loginForm)
    if (!validation.isValid) {
      error.value = validation.message
      return
    }

    // Validar password y password2 si están presentes
    if (loginForm.password !== loginForm.password2) {
      error.value = 'Las contraseñas no coinciden';
      return;
    }


    isLoading.value = true;
    error.value = '';
    success.value = '';

    try {
      const result = await authStore.login(
        loginForm.username,
        loginForm.password,
        loginForm.password2
      )

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
    } catch (error) {
      error.value = AUTH_MESSAGES.CONNECTION_ERROR
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Verificar username en tiempo real
  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      usernameAvailable.value = null
      return
    }

    const validation = validateUsername(username)
    if (!validation.isValid) {
      usernameAvailable.value = false
      return
    }

    checkingUsername.value = true
    try {
      const result = await authService.checkUsername(username)
      usernameAvailable.value = result.available
    } catch (error) {
      usernameAvailable.value = false
    } finally {
      checkingUsername.value = false
    }
  }

  // Verificar email en tiempo real
  const checkEmail = async (email) => {
    if (!email || !email.includes('@')) {
      emailAvailable.value = null
      return
    }

    checkingEmail.value = true
    try {
      const result = await authService.checkEmail(email)
      emailAvailable.value = result.available
    } catch (error) {
      emailAvailable.value = false
    } finally {
      checkingEmail.value = false
    }
  }

  // Registro
  const handleRegister = async () => {
    // Validar formulario completo
    const validation = validateRegister(registerForm)
    if (!validation.isValid) {
      error.value = validation.message
      return
    }

    // Validar contraseñas
    const passwordValidation = validatePasswordMatch(
      registerForm.password,
      registerForm.confirm_password,
    )
    if (!passwordValidation.isValid) {
      error.value = passwordValidation.message
      return
    }

    // Verificar disponibilidad de username y email
    const usernameCheck = await authService.checkUsername(registerForm.username)
    if (usernameCheck.available === false) {
      error.value = AUTH_MESSAGES.USERNAME_TAKEN
      return
    }

    const emailCheck = await authService.checkEmail(registerForm.email)
    if (emailCheck.available === false) {
      error.value = AUTH_MESSAGES.EMAIL_TAKEN
      return
    }

    isLoading.value = true
    error.value = ''
    success.value = ''

    try {
      // Preparar datos para el registro
      const userData = {
        full_name: registerForm.full_name,
        username: registerForm.username,
        address: registerForm.address || '',
        bank_account: registerForm.bank_account || '',
        phone: registerForm.phone || '',
        email: registerForm.email,
        schedule: registerForm.schedule || '',
        password: registerForm.password,
        password2: registerForm.confirm_password,
      }

      const result = await authStore.register(userData)

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
    } catch (error) {
      error.value = AUTH_MESSAGES.CONNECTION_ERROR
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
  }

  // Resetear estados
  const resetAuthState = () => {
    error.value = ''
    success.value = ''
    isLoading.value = false
    usernameAvailable.value = null
    emailAvailable.value = null
  }

  // Limpiar formularios
  const clearForms = () => {
    loginForm.email = ''
    loginForm.password = ''
    registerForm.full_name = ''
    registerForm.username = ''
    registerForm.address = ''
    registerForm.bank_account = ''
    registerForm.phone = ''
    registerForm.email = ''
    registerForm.schedule = ''
    registerForm.password = ''
    registerForm.confirm_password = ''
    error.value = ''
    success.value = ''
    usernameAvailable.value = null
    emailAvailable.value = null
  }

  // Watch para verificaciones en tiempo real
  watch(
    () => registerForm.username,
    (newUsername) => {
      if (newUsername && newUsername.length >= 3) {
        checkUsername(newUsername)
      } else {
        usernameAvailable.value = null
      }
    },
  )

  watch(
    () => registerForm.email,
    (newEmail) => {
      if (newEmail && newEmail.includes('@')) {
        checkEmail(newEmail)
      } else {
        emailAvailable.value = null
      }
    },
  )

  return {
    // Estado
    isLoading,
    error,
    success,
    loginForm,
    registerForm,
    showPassword,
    rememberMe,
    checkingUsername,
    checkingEmail,
    usernameAvailable,
    emailAvailable,

    // Acciones
    handleLogin,
    handleRegister,
    handleLogout,
    resetAuthState,
    clearForms,
    checkUsername,
    checkEmail,

    // Getters
    isAuthenticated: () => authStore.isAuthenticated,
    user: () => authStore.user,
  }
}
