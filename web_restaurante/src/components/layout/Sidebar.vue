<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- Logo y Toggle -->
    <div class="sidebar-header">
      <div class="logo-container" @click="toggleSidebar">
        <div class="logo-mark">
          <img v-if="!isCollapsed" src="@/assets/icons/logo.jpeg" alt="Logo" class="logo-image" />
          <span v-else class="logo-monogram">S</span>
        </div>
        <span v-if="!isCollapsed" class="logo-text">Sabix</span>
      </div>
      <button class="toggle-btn" @click="toggleSidebar" :title="isCollapsed ? 'Expandir' : 'Colapsar'">
        <svg class="toggle-icon" viewBox="0 0 20 20" fill="currentColor"
          :style="{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }">
          <path fill-rule="evenodd"
            d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Menú de navegación -->
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li v-for="item in menuItemsWithBadge" :key="item.id">
          <router-link :to="item.route" class="sidebar-link"
            :class="currentRoute === item.route ? 'sidebar-link-active' : ''" :title="isCollapsed ? item.title : ''">
            <span class="sidebar-link-icon">
              <component :is="getIcon(item.icon)" class="sidebar-icon" />
            </span>
            <span v-if="!isCollapsed" class="sidebar-link-text">{{ item.title }}</span>
            <span v-if="!isCollapsed && item.badge" class="sidebar-link-badge">
              {{ item.badge }}
            </span>
            <span v-else-if="isCollapsed && item.badge" class="sidebar-link-dot"></span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer del sidebar (cerrar sesión) -->
    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout" :title="isCollapsed ? 'Cerrar Sesión' : ''">
        <span class="sidebar-link-icon">
          <component :is="LogoutIcon" class="sidebar-icon" />
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
import { getIcon, LogoutIcon } from '@/assets/icons';
import { useNotificaciones } from '@/modules/notificaciones/composables/useNotificaciones';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isCollapsed = ref(false);
const menuItems = getMenuItems();

// ✅ Usar el composable de notificaciones para el badge
const { unreadCount, loadUnreadCount } = useNotificaciones();

const currentRoute = computed(() => route.path);

// ✅ Actualizar badge de notificaciones en el menú
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

// Toggle sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Logout
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

// ✅ Cargar contador al montar
onMounted(() => {
  loadUnreadCount();
  // Actualizar cada 30 segundos
  const interval = setInterval(() => {
    loadUnreadCount();
  }, 30000);
  return () => clearInterval(interval);
});
</script>

<style scoped>
/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 264px;
  background: linear-gradient(180deg, var(--primary-900), color-mix(in srgb, var(--primary-900) 80%, black));
  color: var(--text-light);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-slow);
  z-index: 1000;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.sidebar-collapsed {
  width: 76px;
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-4) var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid color-mix(in srgb, var(--text-light) 12%, transparent);
  min-height: 72px;
  position: relative;
}

.sidebar-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: var(--spacing-5);
  right: var(--spacing-4);
  height: 1px;
  background: linear-gradient(90deg, var(--primary-300), transparent 70%);
  opacity: 0.6;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  cursor: pointer;
  min-width: 0;
}

.logo-mark {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
  box-shadow: var(--shadow-md);
}

.logo-image {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.logo-monogram {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-light);
  line-height: 1;
}

.logo-text {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.3px;
  white-space: nowrap;
  background: linear-gradient(90deg, var(--text-light), var(--primary-100));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.toggle-btn {
  background: color-mix(in srgb, var(--text-light) 10%, transparent);
  border: none;
  color: color-mix(in srgb, var(--text-light) 85%, transparent);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast), color var(--transition-fast);
  flex-shrink: 0;
}

.toggle-btn:hover {
  background: var(--primary-500);
  color: var(--text-light);
}

.toggle-icon {
  width: 17px;
  height: 17px;
  transition: transform var(--transition-normal);
}

/* Navegación */
.sidebar-nav {
  flex: 1;
  padding: var(--spacing-4) var(--spacing-3);
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  color: color-mix(in srgb, var(--text-light) 65%, transparent);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}

.sidebar-link:hover {
  background: color-mix(in srgb, var(--text-light) 8%, transparent);
  color: var(--text-light);
  transform: translateX(2px);
}

.sidebar-link-active {
  background: linear-gradient(90deg, color-mix(in srgb, var(--primary-500) 35%, transparent), transparent);
  color: var(--text-light);
}

.sidebar-link-active::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 22px;
  background: var(--primary-300);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.sidebar-link-active .sidebar-icon {
  color: var(--primary-100);
}

.sidebar-link-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.sidebar-icon {
  width: 19px;
  height: 19px;
  transition: color var(--transition-fast);
}

.sidebar-link-text {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.sidebar-link-badge {
  background: var(--primary-700);
  color: var(--text-light);
  font-size: 11px;
  font-weight: 700;
  padding: 2px var(--spacing-2);
  border-radius: 20px;
  min-width: 19px;
  text-align: center;
}

.sidebar-link-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-100);
  box-shadow: 0 0 0 2px var(--primary-900);
}

/* Estado colapsado */
.sidebar-collapsed .sidebar-nav {
  padding: var(--spacing-4);
}

.sidebar-collapsed .sidebar-link {
  padding: var(--spacing-3);
  justify-content: center;
}

.sidebar-collapsed .sidebar-link-text,
.sidebar-collapsed .sidebar-link-badge {
  display: none;
}

.sidebar-collapsed .sidebar-link-active::before {
  left: -14px;
  height: 28px;
}

/* Footer */
.sidebar-footer {
  padding: var(--spacing-3);
  border-top: 1px solid color-mix(in srgb, var(--text-light) 12%, transparent);
}

.logout-btn {
  width: 100%;
  background: none;
  border: none;
  color: color-mix(in srgb, var(--text-light) 60%, transparent);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast), color var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.logout-btn:hover {
  background: rgba(248, 113, 113, 0.14);
  color: #f87171;
}

.sidebar-collapsed .logout-btn {
  justify-content: center;
  padding: var(--spacing-3);
}

.sidebar-collapsed .nav-text {
  display: none;
}

/* Scrollbar personalizada */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--text-light) 18%, transparent);
  border-radius: var(--radius-sm);
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: var(--primary-500);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 76px;
  }

  .sidebar:not(.sidebar-collapsed) {
    width: 264px;
  }

  .sidebar:not(.sidebar-collapsed) .sidebar-link-text {
    display: inline;
  }
}

@media (prefers-reduced-motion: reduce) {

  .sidebar,
  .toggle-icon,
  .sidebar-link {
    transition: none;
  }
}
</style>
