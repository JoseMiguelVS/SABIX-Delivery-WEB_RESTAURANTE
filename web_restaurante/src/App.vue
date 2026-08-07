<template>
  <div id="app" class="app-container">
    <div class="decorative-blob blob-1"></div>
    <div class="decorative-blob blob-2"></div>
    <!-- Solo mostrar sidebar si está autenticado Y NO está en login/register -->
    <Sidebar v-if="authStore.isAuthenticated && !isAuthPage" />
    <div
      class="main-content"
      :class="{
        'main-content-expanded': authStore.isAuthenticated && !isAuthPage,
        'main-content-full': !authStore.isAuthenticated || isAuthPage
      }"
    >
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/layout/Sidebar.vue';

const route = useRoute();
const authStore = useAuthStore();

//  Detectar si estamos en página de autenticación
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});

onMounted(() => {
  authStore.initialize();
});
</script>

<style>
/*  Reset global sin fondo blanco */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
}

#app {
  min-height: 100vh;
  background: transparent;
  font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background: transparent;
}

/*  Contenido principal */
.main-content {
  flex: 1;
  margin-left: 264px;
  transition: margin-left 0.3s ease;
  background: transparent;
  min-height: 100vh;
}

.main-content-expanded {
  margin-left: 76px;
}

/* Cuando no hay sidebar (login/register), ocupar todo */
.main-content-full {
  margin-left: 0 !important;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 76px;
  }

  .main-content-full {
    margin-left: 0 !important;
  }
}
</style>
