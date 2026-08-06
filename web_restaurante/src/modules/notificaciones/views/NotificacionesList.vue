<template>
  <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">Notificaciones</h1>
        <p style="font-size: 14px; color: #666;">Historial de notificaciones de pedidos</p>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <span v-if="unreadCount > 0" style="padding: 6px 12px; background: #fee2e2; color: #991b1b; border-radius: 9999px; font-size: 14px; font-weight: 500;">
          🔔 {{ unreadCount }} nuevas
        </span>
        <button
          v-if="unreadCount > 0"
          @click="marcarTodasComoLeidas"
          style="padding: 8px 16px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;"
          @mouseenter="markAllHover = true" @mouseleave="markAllHover = false"
          :style="markAllHover ? { background: '#6a086a' } : {}"
        >
          Marcar todas como leídas
        </button>
        <button
          @click="toggleUnreadOnly"
          style="padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s; border: 1px solid #e5e7eb;"
          :style="showUnreadOnly ? { background: '#7e097e', color: 'white', borderColor: '#7e097e' } : { background: 'white', color: '#1a1a1a' }"
        >
          {{ showUnreadOnly ? '📖 Todas' : '🔔 No leídas' }}
        </button>
        <button
          @click="loadNotificaciones"
          style="padding: 8px 12px; background: #f1f5f9; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 13px;"
        >
          🔄
        </button>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="success" style="margin-bottom: 16px; padding: 12px 16px; background: #dcfce7; color: #166534; border-radius: 8px; border: 1px solid #86efac;">
      {{ success }}
    </div>
    <div v-if="error" style="margin-bottom: 16px; padding: 12px 16px; background: #fee2e2; color: #991b1b; border-radius: 8px; border: 1px solid #fca5a5;">
      {{ error }}
    </div>

    <!-- Filtros -->
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
      <button
        v-for="option in typeOptions"
        :key="option.value"
        @click="changeFilter(option.value)"
        style="padding: 6px 16px; border-radius: 9999px; border: 1px solid #e5e7eb; background: white; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;"
        :style="filters.type === option.value ? { background: '#7e097e', color: 'white', borderColor: '#7e097e' } : { background: 'white', color: '#1a1a1a' }"
      >
        {{ option.label }}
        <span v-if="option.value === '' && totalCount > 0" style="margin-left: 4px; font-size: 11px; opacity: 0.7;">({{ totalCount }})</span>
        <span v-else-if="option.value && unreadCount > 0 && option.value === 'order_new'" style="margin-left: 4px; font-size: 11px; opacity: 0.7;">({{ unreadCount }})</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" style="text-align: center; padding: 60px 20px;">
      <div style="width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #7e097e; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;"></div>
      <p style="color: #64748b;">Cargando notificaciones...</p>
    </div>

    <!-- Lista de notificaciones -->
    <div v-else style="display: flex; flex-direction: column; gap: 8px;">
      <div v-if="notificaciones.length === 0" style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; color: #94a3b8;">
        <svg style="width: 48px; height: 48px; margin: 0 auto 16px; color: #cbd5e1;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">No hay notificaciones</h3>
        <p style="font-size: 14px;">Aún no has recibido notificaciones</p>
        <p v-if="filters.type" style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
          Filtro: {{ typeOptions.find(t => t.value === filters.type)?.label || filters.type }}
        </p>
      </div>

      <!-- Tarjeta de notificación -->
      <div
        v-for="notificacion in notificaciones"
        :key="notificacion.id"
        class="notificacion-card"
        :style="{
          background: !notificacion.is_read ? '#f8fafc' : 'white',
          borderLeft: !notificacion.is_read ? '4px solid #7e097e' : '4px solid transparent'
        }"
        @mouseenter="hoverNotificacion = notificacion.id"
        @mouseleave="hoverNotificacion = null"
        @click="goToOrderDetail(notificacion)"
      >
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; width: 100%;">
          <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
            <span style="font-size: 24px; flex-shrink: 0; margin-top: 4px;">
              {{ getTypeIcon(notificacion.type) }}
            </span>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span style="font-weight: 600; color: #1a1a1a;">{{ notificacion.title || notificacion.type_display }}</span>
                <span
                  v-if="notificacion.order_status"
                  style="padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 500;"
                  :style="{
                    background: getStatusColor(notificacion.order_status) + '20',
                    color: getStatusColor(notificacion.order_status)
                  }"
                >
                  {{ getStatusLabel(notificacion.order_status) }}
                </span>
                <span v-if="notificacion.is_read" style="font-size: 11px; color: #94a3b8;">✓ Leída</span>
                <span v-else style="font-size: 11px; color: #7e097e; font-weight: 600;">● Nuevo</span>
              </div>
              <p style="font-size: 14px; color: #1a1a1a; margin: 4px 0;">{{ notificacion.message }}</p>
              <div style="display: flex; align-items: center; gap: 12px; font-size: 12px; color: #94a3b8; margin-top: 4px; flex-wrap: wrap;">
                <span>🕐 {{ formatDate(notificacion.created_at) }}</span>
                <span v-if="notificacion.total">💰 ${{ notificacion.total }}</span>
                <span v-if="notificacion.data?.client_name">👤 {{ notificacion.data.client_name }}</span>
                <span v-if="notificacion.data?.estimated_prep_time">⏱️ {{ notificacion.data.estimated_prep_time }} min</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <button
              v-if="!notificacion.is_read"
              @click.stop="marcarComoLeida(notificacion.id)"
              style="padding: 4px 12px; background: #7e097e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;"
            >
              Marcar leída
            </button>
            <button
              @click.stop="confirmDelete(notificacion)"
              style="padding: 4px 8px; background: transparent; color: #94a3b8; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalCount > 20" style="display: flex; justify-content: center; gap: 8px; margin-top: 16px; padding: 16px 0;">
        <button
          @click="changePage(filters.page - 1)"
          :disabled="filters.page <= 1"
          style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 14px; transition: all 0.15s;"
          :style="filters.page <= 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}"
        >
          Anterior
        </button>
        <span style="display: flex; align-items: center; padding: 8px 16px; font-size: 14px; color: #1a1a1a;">
          Página {{ filters.page }}
        </span>
        <button
          @click="changePage(filters.page + 1)"
          :disabled="filters.page * filters.page_size >= totalCount"
          style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 14px; transition: all 0.15s;"
          :style="filters.page * filters.page_size >= totalCount ? { opacity: 0.5, cursor: 'not-allowed' } : {}"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px);" @click="showDeleteModal = false">
      <div style="background: white; border-radius: 16px; max-width: 400px; width: 90%; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);" @click.stop>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">Eliminar notificación</h3>
        <p style="color: #666;">¿Estás seguro de que deseas eliminar esta notificación?</p>
        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <button @click="showDeleteModal = false" style="padding: 8px 16px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px;">
            Cancelar
          </button>
          <button @click="deleteNotificacion" :disabled="isUpdating" style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
            {{ isUpdating ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNotificaciones } from '../composables/useNotificaciones';

defineOptions({ name: 'NotificacionesList' });

const {
  notificaciones,
  isLoading,
  isUpdating,
  error,
  success,
  totalCount,
  unreadCount,
  showDeleteModal,
  filters,
  typeOptions,
  showUnreadOnly,
  loadNotificaciones,
  loadUnreadCount,
  marcarComoLeida,
  marcarTodasComoLeidas,
  confirmDelete,
  deleteNotificacion,
  goToOrderDetail,
  changeFilter,
  changePage,
  toggleUnreadOnly,
  getTypeIcon,
  getStatusLabel,
  formatDate,
} = useNotificaciones();

const hoverNotificacion = ref(null);
const markAllHover = ref(false);

// Obtener color del estado (para el badge de estado del pedido)
const getStatusColor = (status) => {
  const colors = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    preparing: '#8b5cf6',
    ready: '#22c55e',
    rejected: '#ef4444',
    cancelled: '#6b7280',
    delivered: '#10b981',
  };
  return colors[status] || '#6b7280';
};

onMounted(() => {
  loadNotificaciones();
  loadUnreadCount();

  // Recargar contador cada 30 segundos
  const interval = setInterval(() => {
    loadUnreadCount();
  }, 30000);

  // Limpiar intervalo al desmontar
  return () => clearInterval(interval);
});
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.notificacion-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.15s ease;
}

.notificacion-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
</style>
