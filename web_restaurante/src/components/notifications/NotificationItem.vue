<template>
  <div class="notification-item" :class="{ 'notification-item-unread': !notificacion.is_read }" @click="handleClick">
    <div class="notification-item-content">
      <div class="notification-item-icon">
        <span>{{ getTypeIcon(notificacion.type) }}</span>
      </div>

      <div class="notification-item-body">
        <div class="notification-item-header">
          <span class="notification-item-title">{{ notificacion.title || notificacion.type_display }}</span>
          <span class="notification-item-time">{{ formatDate(notificacion.created_at) }}</span>
        </div>
        <p class="notification-item-message">{{ notificacion.message }}</p>
        <div class="notification-item-footer">
          <span v-if="notificacion.total" class="notification-item-total">
            ${{ notificacion.total }}
          </span>
          <span v-if="!notificacion.is_read" class="notification-item-badge">Nuevo</span>
        </div>
      </div>

      <div class="notification-item-actions">
        <button v-if="!notificacion.is_read" @click.stop="handleMarkAsRead" class="notification-item-btn"
          title="Marcar como leída">
          ✓
        </button>
        <button @click.stop="handleDelete" class="notification-item-btn notification-item-btn-delete" title="Eliminar">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  notificacion: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click', 'mark-as-read', 'delete']);

// Obtener icono según tipo
const getTypeIcon = (type) => {
  const icons = {
    'order_new': '🛎️',
    'order_confirmed': '✅',
    'order_rejected': '❌',
    'order_in_delivery': '🚀',
    'order_delivered': '📦',
    'order_cancelled': '❌',
    'order_ready': '📦',
  };
  return icons[type] || '📋';
};

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return '---';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMin = Math.floor((now - date) / 60000);
    if (diffMin < 1) return 'Ahora';
    if (diffMin < 60) return `Hace ${diffMin}m`;
    if (diffMin < 1440) return `Hace ${Math.floor(diffMin / 60)}h`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  } catch {
    return dateString;
  }
};

// Manejar eventos
const handleClick = () => emit('click', props.notificacion);
const handleMarkAsRead = (e) => {
  e.stopPropagation();
  emit('mark-as-read', props.notificacion);
};
const handleDelete = (e) => {
  e.stopPropagation();
  emit('delete', props.notificacion);
};
</script>

<style scoped>
.notification-item {
  display: flex;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid #f1f5f9;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item-unread {
  background: #f8fafc;
  border-left: 3px solid #7e097e;
}

.notification-item-content {
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: flex-start;
}

.notification-item-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-item-body {
  flex: 1;
  min-width: 0;
}

.notification-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.notification-item-title {
  font-weight: 600;
  font-size: 13px;
  color: #1a1a1a;
}

.notification-item-time {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
}

.notification-item-message {
  font-size: 13px;
  color: #64748b;
  margin: 2px 0 0 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-item-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
}

.notification-item-total {
  font-weight: 600;
  color: #1a1a1a;
}

.notification-item-badge {
  font-size: 10px;
  font-weight: 600;
  color: #7e097e;
  background: #fa8bf5;
  padding: 1px 8px;
  border-radius: 9999px;
}

.notification-item-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.notification-item-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 14px;
  color: #94a3b8;
  transition: all 0.15s;
}

.notification-item-btn:hover {
  background: #f1f5f9;
  color: #22c55e;
}

.notification-item-btn-delete:hover {
  background: #fee2e2;
  color: #ef4444;
}
</style>
