<template>
  <div class="notification-bell-container">
    <!-- Botón de la campanita -->
    <button class="notification-bell-btn" @click="toggleDropdown" :class="{ 'notification-bell-active': isOpen }">
      <svg class="notification-bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="notification-bell-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
    </button>

    <!-- Dropdown -->
    <div v-if="isOpen" class="notification-dropdown" ref="dropdown">
      <div class="notification-dropdown-header">
        <span class="notification-dropdown-title">Notificaciones</span>
        <div class="notification-dropdown-actions">
          <button v-if="unreadCount > 0" @click="handleMarkAllRead" class="notification-dropdown-action"
            :disabled="isUpdating">
            Marcar todas
          </button>
          <button @click="handleViewAll" class="notification-dropdown-action">
            Ver todas
          </button>
        </div>
      </div>

      <div class="notification-dropdown-body">
        <!-- Loading -->
        <div v-if="isLoading" class="notification-dropdown-loading">
          <div class="spinner-sm"></div>
          <span>Cargando...</span>
        </div>

        <!-- Sin notificaciones -->
        <div v-else-if="notificaciones.length === 0" class="notification-dropdown-empty">
          <span>🔔</span>
          <span>No hay notificaciones</span>
        </div>

        <!-- Lista -->
        <div v-else class="notification-dropdown-list">
          <NotificationItem v-for="notif in notificaciones.slice(0, 8)" :key="notif.id" :notificacion="notif"
            @click="handleNotificationClick" @mark-as-read="handleMarkAsRead" @delete="handleDelete" />

          <div v-if="notificaciones.length > 8" class="notification-dropdown-footer">
            <button @click="handleViewAll" class="notification-dropdown-view-all">
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="isOpen" class="notification-dropdown-overlay" @click="closeDropdown"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificaciones } from '@/modules/notificaciones/composables/useNotificaciones';
import NotificationItem from './NotificationItem.vue';

const router = useRouter();
const {
  notificaciones,
  unreadCount,
  isLoading,
  isUpdating,
  loadNotificaciones,
  loadUnreadCount,
  marcarComoLeida,
  marcarTodasComoLeidas,
  deleteNotificacion,
  goToOrderDetail,
} = useNotificaciones();

const isOpen = ref(false);

//  Cargar notificaciones al abrir el dropdown
const toggleDropdown = async () => {
  if (!isOpen.value) {
    await loadNotificaciones();
    await loadUnreadCount();
  }
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleViewAll = () => {
  isOpen.value = false;
  router.push('/notificaciones');
};

const handleMarkAsRead = async (notificacion) => {
  await marcarComoLeida(notificacion.id);
  await loadUnreadCount();
};

const handleMarkAllRead = async () => {
  await marcarTodasComoLeidas();
  await loadUnreadCount();
};

const handleDelete = async (notificacion) => {
  await deleteNotificacion(notificacion.id);
  await loadUnreadCount();
};

const handleNotificationClick = (notificacion) => {
  if (!notificacion.is_read) {
    marcarComoLeida(notificacion.id);
  }
  goToOrderDetail(notificacion);
  isOpen.value = false;
};

// Cargar contador al montar
onMounted(() => {
  loadUnreadCount();

  // Recargar contador cada 30 segundos
  const interval = setInterval(() => {
    loadUnreadCount();
  }, 30000);

  return () => clearInterval(interval);
});

const handleClickOutside = (event) => {
  const container = document.querySelector('.notification-bell-container');
  if (container && !container.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Contenedor */
.notification-bell-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* Botón */
.notification-bell-btn {
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.notification-bell-btn:hover {
  background: rgba(126, 9, 126, 0.08);
  color: #7e097e;
}

.notification-bell-active {
  background: rgba(126, 9, 126, 0.08);
  color: #7e097e;
}

.notification-bell-icon {
  width: 22px;
  height: 22px;
}

.notification-bell-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid white;
  line-height: 1;
}

/* Dropdown */
.notification-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: -8px;
  width: 400px;
  max-width: calc(100vw - 32px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  z-index: 1001;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  animation: slideDown 0.2s ease-out;
}

/* Dark mode */
.dark .notification-dropdown {
  background: #1a1a1a;
  border-color: #374151;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.notification-dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 8px;
}

.dark .notification-dropdown-header {
  border-color: #374151;
}

.notification-dropdown-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.dark .notification-dropdown-title {
  color: #f3f4f6;
}

.notification-dropdown-actions {
  display: flex;
  gap: 8px;
}

.notification-dropdown-action {
  background: transparent;
  border: none;
  color: #7e097e;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.15s;
}

.notification-dropdown-action:hover {
  background: #fa8bf5;
}

.notification-dropdown-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Body */
.notification-dropdown-body {
  flex: 1;
  overflow-y: auto;
  padding: 4px 8px;
  max-height: 380px;
}

.notification-dropdown-body::-webkit-scrollbar {
  width: 4px;
}

.notification-dropdown-body::-webkit-scrollbar-track {
  background: transparent;
}

.notification-dropdown-body::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

/* Loading */
.notification-dropdown-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  gap: 10px;
  color: #94a3b8;
}

.spinner-sm {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #7e097e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty */
.notification-dropdown-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  gap: 8px;
  color: #94a3b8;
  font-size: 14px;
}

.notification-dropdown-empty span:first-child {
  font-size: 32px;
}

/* Lista */
.notification-dropdown-list {
  display: flex;
  flex-direction: column;
}

/* Footer */
.notification-dropdown-footer {
  padding: 10px 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.dark .notification-dropdown-footer {
  border-color: #374151;
}

.notification-dropdown-view-all {
  background: transparent;
  border: none;
  color: #7e097e;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.15s;
  width: 100%;
}

.notification-dropdown-view-all:hover {
  background: #fa8bf5;
}

/* Overlay */
.notification-dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
}

/* Responsive */
@media (max-width: 640px) {
  .notification-dropdown {
    right: -80px;
    width: 100vw;
    max-width: calc(100vw - 16px);
    left: 50%;
    transform: translateX(-50%);
    max-height: 80vh;
  }

  .notification-dropdown-header {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }

  .notification-dropdown-actions {
    justify-content: flex-start;
  }
}
</style>
