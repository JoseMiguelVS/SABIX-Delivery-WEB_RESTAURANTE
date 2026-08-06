<template>
  <div class="app-container">
    <!-- Sidebar -->
    <Sidebar v-if="authStore.isAuthenticated" />

    <!-- Contenido principal -->
    <div class="main-content" :class="{ 'main-content-collapsed': isSidebarCollapsed }">
      <!-- Navbar -->
      <Navbar v-if="authStore.isAuthenticated" @toggle-sidebar="toggleSidebar" />

      <!-- Contenido de la página -->
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Sidebar from '@/components/layout/Sidebar.vue';
import Navbar from '@/components/layout/Navbar.vue';

const authStore = useAuthStore();
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

onMounted(() => {
  authStore.initialize();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background: #f8f5f9;
}

/* ✅ Contenido principal con margen para el sidebar */
.main-content {
  flex: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ✅ Cuando el sidebar está colapsado */
.main-content-collapsed {
  margin-left: 70px;
}

/* ✅ Contenido de la página */
.page-content {
  flex: 1;
  padding: 24px;
  background: #f8f5f9;
}

/* ✅ Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 70px;
  }

  .page-content {
    padding: 16px;
  }
}
</style>
