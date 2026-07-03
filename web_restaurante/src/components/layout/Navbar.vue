<template>
  <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-800 dark:text-white">Mi App</h1>
        </div>
        
        <div class="flex items-center space-x-4">
          <ThemeToggle />
          
          <span v-if="authStore.user" class="text-sm text-gray-700 dark:text-gray-300">
            {{ authStore.user.name }}
          </span>
          
          <button
            v-if="authStore.isAuthenticated"
            @click="handleLogout"
            class="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>