<template>
  <div class="notificacion-item" :class="{
    'notificacion-item-unread': !notificacion.is_read,
    'notificacion-item-read': notificacion.is_read
  }" @click="handleClick">
    <div class="notificacion-item-content">
      <!-- Icono -->
      <div class="notificacion-item-icon" :style="{ background: getTypeColor(notificacion.type) + '20' }">
        <span style="font-size: 20px;">{{ getTypeIcon(notificacion.type) }}</span>
      </div>

      <!-- Contenido -->
      <div class="notificacion-item-body">
        <div class="notificacion-item-header">
          <div class="notificacion-item-title">
            <span class="notificacion-item-title-text">{{ notificacion.title || notificacion.type_display }}</span>
            <span v-if="!notificacion.is_read" class="notificacion-item-badge">● Nuevo</span>
            <span v-else class="notificacion-item-read-badge">✓ Leída</span>
          </div>
          <span class="notificacion-item-time">{{ formatDate(notificacion.created_at) }}</span>
        </div>

        <p class="notificacion-item-message">{{ notificacion.message }}</p>

        <div class="notificacion-item-footer">
          <!-- Estado del pedido -->
          <span v-if="notificacion.order_status" class="notificacion-item-status" :style="{
            background: getStatusColor(notificacion.order_status) + '20',
            color: getStatusColor(notificacion.order_status)
          }">
            {{ getStatusLabel(notificacion.order_status) }}
          </span>

          <!-- Total -->
          <span v-if="notificacion.total" class="notificacion-item-total">
            💰 ${{ notificacion.total }}
          </span>

          <!-- Información adicional -->
          <span v-if="notificacion.data?.client_name" class="notificacion-item-client">
            👤 {{ notificacion.data.client_name }}
          </span>

          <!-- Tiempo estimado -->
          <span v-if="notificacion.data?.estimated_prep_time" class="notificacion-item-time-estimate">
            ⏱️ {{ notificacion.data.estimated_prep_time }} min
          </span>

          <!-- Repartidor (para notificaciones de delivery) -->
          <span v-if="notificacion.data?.delivery_person_name" class="notificacion-item-delivery">
            🚴 {{ notificacion.data.delivery_person_name }}
          </span>
        </div>
      </div>

      <!-- Acciones -->
      <div class="notificacion-item-actions">
        <button v-if="!notificacion.is_read" @click.stop="handleMarkAsRead" class="notificacion-item-btn-read"
          title="Marcar como leída">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <button @click.stop="handleDelete" class="notificacion-item-btn-delete" title="Eliminar">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  notificacion: {
    type: Object,
    required: true,
  },
  showActions: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['click', 'mark-as-read', 'delete']);

// Computados para estilos
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

const getTypeColor = (type) => {
  const colors = {
    'order_new': '#f59e0b',
    'order_confirmed': '#3b82f6',
    'order_rejected': '#ef4444',
    'order_in_delivery': '#8b5cf6',
    'order_delivered': '#22c55e',
    'order_cancelled': '#6b7280',
    'order_ready': '#22c55e',
  };
  return colors[type] || '#6b7280';
};

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

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'En Preparación',
    ready: 'Listo',
    rejected: 'Rechazado',
    cancelled: 'Cancelado',
    delivered: 'Entregado',
  };
  return labels[status] || status;
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} minutos`;
    if (diffHour < 24) return `Hace ${diffHour} horas`;
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

// Manejar eventos
const handleClick = () => {
  emit('click', props.notificacion);
};

const handleMarkAsRead = (event) => {
  event.stopPropagation();
  emit('mark-as-read', props.notificacion);
};

const handleDelete = (event) => {
  event.stopPropagation();
  emit('delete', props.notificacion);
};
</script>

<style scoped>
.notificacion-item {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 8px;
}

.notificacion-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.notificacion-item-unread {
  background: #f8fafc;
  border-left: 4px solid #7e097e;
}

.notificacion-item-read {
  background: white;
  border-left: 4px solid transparent;
}

.notificacion-item-content {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
}

.notificacion-item-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notificacion-item-body {
  flex: 1;
  min-width: 0;
}

.notificacion-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.notificacion-item-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.notificacion-item-title-text {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
}

.notificacion-item-badge {
  font-size: 11px;
  color: #7e097e;
  font-weight: 600;
}

.notificacion-item-read-badge {
  font-size: 11px;
  color: #94a3b8;
}

.notificacion-item-time {
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
}

.notificacion-item-message {
  font-size: 14px;
  color: #1a1a1a;
  margin: 4px 0;
  line-height: 1.4;
}

.notificacion-item-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
  font-size: 12px;
}

.notificacion-item-status {
  padding: 2px 10px;
  border-radius: 9999px;
  font-weight: 500;
}

.notificacion-item-total {
  color: #1a1a1a;
  font-weight: 500;
}

.notificacion-item-client {
  color: #64748b;
}

.notificacion-item-time-estimate {
  color: #64748b;
}

.notificacion-item-delivery {
  color: #8b5cf6;
  font-weight: 500;
}

.notificacion-item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.notificacion-item-btn-read {
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  border-radius: 6px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notificacion-item-btn-read svg {
  width: 18px;
  height: 18px;
}

.notificacion-item-btn-read:hover {
  background: #dcfce7;
  color: #22c55e;
}

.notificacion-item-btn-delete {
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  border-radius: 6px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notificacion-item-btn-delete svg {
  width: 18px;
  height: 18px;
}

.notificacion-item-btn-delete:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* Responsive */
@media (max-width: 640px) {
  .notificacion-item {
    padding: 12px 16px;
  }

  .notificacion-item-content {
    gap: 10px;
  }

  .notificacion-item-icon {
    width: 36px;
    height: 36px;
  }

  .notificacion-item-title-text {
    font-size: 14px;
  }

  .notificacion-item-message {
    font-size: 13px;
  }

  .notificacion-item-footer {
    gap: 8px;
    font-size: 11px;
  }

  .notificacion-item-actions {
    gap: 2px;
  }
}
</style>
