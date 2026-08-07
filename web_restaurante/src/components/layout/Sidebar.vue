<template>
  <aside class="sidebar glass-sidebar" :class="{ 'sidebar-collapsed': isCollapsed }"
    :style="{ width: isCollapsed ? '76px' : '288px' }">
    <!-- Decorative background -->
    <div class="sidebar-glow"></div>

    <!-- Toggle Button -->
    <button class="toggle-btn-absolute" @click="toggleSidebar" :title="isCollapsed ? 'Expandir' : 'Colapsar'">
      <svg fill="none" height="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        viewBox="0 0 24 24" width="16">
        <path d="m15 18-6-6 6-6"></path>
      </svg>
    </button>

    <!-- Header -->
    <div class="sidebar-header">
      <div class="logo-container" @click="toggleSidebar">
        <div class="logo-mark">
          <img v-if="!isCollapsed" src="@/assets/icons/logo.jpeg" alt="Logo" class="logo-image" />
          <span v-else class="logo-monogram">S</span>
        </div>
        <span v-if="!isCollapsed" class="logo-text">Sabix</span>
      </div>
    </div>

    <!-- Divider -->
    <div class="sidebar-divider"></div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <!-- Primary Nav -->
      <ul class="nav-group">
        <li v-for="item in menuItemsWithBadge" :key="item.id">
          <router-link :to="item.route" class="nav-link" :class="{ 'nav-link-active': currentRoute === item.route }"
            :title="isCollapsed ? item.title : ''">
            <span class="nav-icon">
              <component :is="getIcon(item.icon)" class="icon-svg" />
            </span>
            <span v-if="!isCollapsed" class="nav-text">{{ item.title }}</span>
            <span v-if="!isCollapsed && item.badge" class="nav-badge">
              {{ item.badge }}
            </span>
            <span v-else-if="isCollapsed && item.badge" class="nav-dot"></span>
          </router-link>
        </li>
      </ul>

    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout" :title="isCollapsed ? 'Cerrar Sesión' : ''">
        <span class="nav-icon">
          <svg class="icon-svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
            stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </span>
        <span v-if="!isCollapsed" class="nav-text">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { getMenuItems } from '@/constants/menuItems';
import { getIcon } from '@/assets/icons/index.js';
import { useNotificaciones } from '@/modules/notificaciones/composables/useNotificaciones';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isCollapsed = ref(false);
const menuItems = getMenuItems();
const { unreadCount, loadUnreadCount } = useNotificaciones();

const currentRoute = computed(() => route.path);

const menuItemsWithBadge = computed(() => {
  return menuItems.map(item => {
    if (item.id === 'notificaciones') {
      return {
        ...item,
        badge: unreadCount.value > 0 ? unreadCount.value : null,
      };
    }
    return item;
  });
});

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

onMounted(() => {
  loadUnreadCount();
  const interval = setInterval(() => {
    loadUnreadCount();
  }, 30000);
  return () => clearInterval(interval);
});
</script>
