import { defineStore } from 'pinia';
import authService from '@/services/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
  },
  
  actions: {
    async login(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const result = await authService.login(email, password);
        
        if (result.success) {
          this.user = result.user;
          this.isLoading = false;
          return { success: true };
        } else {
          this.error = result.message;
          this.isLoading = false;
          return { success: false, message: result.message };
        }
      } catch (error) {
        this.error = 'Error en la conexión';
        this.isLoading = false;
        return { success: false, message: 'Error en la conexión' };
      }
    },
    
    async logout() {
      await authService.logout();
      this.user = null;
      this.error = null;
    },
    
    initialize() {
      const user = authService.getCurrentUser();
      if (user && authService.isAuthenticated()) {
        this.user = user;
      }
    },
  },
});