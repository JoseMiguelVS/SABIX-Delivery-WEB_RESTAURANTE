import api from './api'

class AuthService {
  async login(username, password, password2) {
    try {
      const response = await api.post('/v1/users/login/restaurant/', {
        username,
        password,
        password2,
      })
      const { access, refresh, user } = response.data

      // Guardar tokens y datos del usuario
      localStorage.setItem('auth_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify(user))

      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
      }
    }
  }

  async register(userData) {
    try {
      // Asegurar que user_type y password2 esté presente
      if (userData.password && !userData.password2 && !userData.user_type) {
        userData.password2 = userData.password
        userData.user_type = 'restaurant'
      }
      const response = await api.post('/v1/users/register/', userData)
      return {
        success: true,
        data: response.data,
        message: 'Usuario registrado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario',
        errors: error.response?.data?.errors || null,
      }
    }
  }

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await api.post('/v1/users/logout/', { refresh: refreshToken })
      }
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/v1/users/profile/')
      return { success: true, user: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener perfil',
      }
    }
  }

  async updateProfile(userData) {
    try {
      const response = await api.put('/v1/users/profile/', userData)
      return { success: true, user: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar perfil',
      }
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      await api.post('/v1/users/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      })
      return { success: true, message: 'Contraseña actualizada exitosamente' }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cambiar contraseña',
      }
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) throw new Error('No refresh token')

      const response = await api.post('/v1/auth/token/refresh/', {
        refresh: refreshToken,
      })

      const { access } = response.data
      localStorage.setItem('auth_token', access)
      return { success: true, token: access }
    } catch (error) {
      return {
        success: false,
        message: 'Error al refrescar token',
      }
    }
  }

  async checkUsername(username) {
    try {
      const response = await api.get(`/v1/users/check-username/?username=${username}`)
      return {
        success: true,
        available: response.data.available,
        message: response.data.message,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al verificar usuario',
      }
    }
  }

  async checkEmail(email) {
    try {
      const response = await api.get(`/v1/users/check-email/?email=${email}`)
      return {
        success: true,
        available: response.data.available,
        message: response.data.message,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al verificar email',
      }
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }

  isAuthenticated() {
    return !!this.getToken()
  }
}

export default new AuthService()
