import { defineStore } from 'pinia'
import authService from '@/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    userFullName: (state) => state.user?.full_name || 'Usuario',
    userEmail: (state) => state.user?.email || '',
    userUsername: (state) => state.user?.username || '',
  },

  actions: {
    async login(username, password, password2) {
      this.isLoading = true
      this.error = null

      try {
        const result = await authService.login(username, password, password2)

        if (result.success) {
          this.user = result.user
          this.isLoading = false
          return { success: true }
        } else {
          this.error = result.message
          this.isLoading = false
          return { success: false, message: result.message }
        }
      } catch (error) {
        this.error = 'Error en la conexión'
        this.isLoading = false
        return { success: false, message: 'Error en la conexión' }
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null

      try {
        if (userData.password && !userData.password2) {
          userData.password2 = userData.password
        }
        const result = await authService.register(userData)

        if (result.success) {
          this.isLoading = false
          return { success: true, data: result.data }
        } else {
          this.error = result.message
          this.isLoading = false
          return { success: false, message: result.message, errors: result.errors }
        }
      } catch (error) {
        this.error = 'Error en la conexión'
        this.isLoading = false
        return { success: false, message: 'Error en la conexión' }
      }
    },

    async logout() {
      await authService.logout()
      this.user = null
      this.error = null
    },

    async loadProfile() {
      const result = await authService.getProfile()
      if (result.success) {
        this.user = result.user
        localStorage.setItem('user', JSON.stringify(this.user))
      }
      return result
    },

    async updateProfile(userData) {
      this.isLoading = true
      try {
        const result = await authService.updateProfile(userData)
        if (result.success) {
          this.user = result.user
          localStorage.setItem('user', JSON.stringify(this.user))
          this.isLoading = false
          return { success: true, user: result.user }
        }
        this.isLoading = false
        return { success: false, message: result.message }
      } catch (error) {
        this.isLoading = false
        return { success: false, message: 'Error al actualizar perfil' }
      }
    },

    async changePassword(oldPassword, newPassword) {
      this.isLoading = true
      try {
        const result = await authService.changePassword(oldPassword, newPassword)
        this.isLoading = false
        return result
      } catch (error) {
        this.isLoading = false
        return { success: false, message: 'Error al cambiar contraseña' }
      }
    },

    async refreshToken() {
      const result = await authService.refreshToken()
      return result
    },

    initialize() {
      const user = authService.getCurrentUser()
      if (user && authService.isAuthenticated()) {
        this.user = user
      }
    },
  },
})
