<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-title">
          <span class="modal-icon">{{ modalIcon }}</span>
          <h3>{{ modalTitle }}</h3>
        </div>
        <button @click="close" class="modal-close">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Información del pedido -->
        <div class="order-info">
          <p>
            <strong>Pedido #{{ pedido?.id }}</strong>
            <span v-if="pedido?.client_name"> - {{ pedido.client_name }}</span>
          </p>
          <p v-if="pedido?.total" class="order-total">
            Total: <strong>${{ pedido.total }}</strong>
          </p>
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="success-message">
          <svg style="width: 18px; height: 18px; flex-shrink: 0;" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="error-message">
          <svg style="width: 18px; height: 18px; flex-shrink: 0;" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <p class="modal-description">{{ modalDescription }}</p>

        <!-- Motivo de rechazo (solo para rechazar) -->
        <div v-if="actionType === 'reject'" class="reject-reason">
          <label for="rejectionReason">Motivo de rechazo (opcional)</label>
          <textarea id="rejectionReason" v-model="localRejectionReason" rows="3"
            placeholder="Ej: Restaurante cerrado por mantenimiento, no tenemos los ingredientes..." />
          <span class="hint">El cliente recibirá este motivo si se proporciona</span>
        </div>

        <!-- Confirmación adicional (solo para rechazar) -->
        <div v-if="actionType === 'reject'" class="confirmation-check">
          <label>
            <input type="checkbox" v-model="confirmed" />
            Confirmo que deseo rechazar este pedido
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button @click="close" class="btn-cancel" :disabled="isLoading">
          Cancelar
        </button>
        <button @click="handleConfirm" :disabled="isLoading || (actionType === 'reject' && !confirmed)"
          class="btn-confirm" :class="{
            'btn-confirm-accept': actionType === 'accept',
            'btn-confirm-reject': actionType === 'reject',
            'btn-confirm-prepare': actionType === 'prepare',
            'btn-confirm-ready': actionType === 'ready',
            'btn-confirm-loading': isLoading
          }">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>{{ confirmButtonText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  pedido: {
    type: Object,
    default: null,
  },
  actionType: {
    type: String,
    default: '',
    validator: (value) => ['accept', 'reject', 'prepare', 'ready'].includes(value),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  success: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'confirm']);

// Estado local
const localRejectionReason = ref('');
const confirmed = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Resetear estado cuando se abre el modal
watch(() => props.visible, (newVal) => {
  if (newVal) {
    localRejectionReason.value = '';
    confirmed.value = false;
    errorMessage.value = '';
    successMessage.value = '';
  }
});

// ✅ Cuando el error cambia desde el padre, mostrarlo
watch(() => props.error, (newVal) => {
  if (newVal) {
    errorMessage.value = newVal;
    successMessage.value = '';
  }
});

// ✅ Cuando el éxito cambia desde el padre, mostrarlo
watch(() => props.success, (newVal) => {
  if (newVal) {
    successMessage.value = newVal;
    errorMessage.value = '';
  }
});

// Computados para el modal
const modalTitle = computed(() => {
  const titles = {
    accept: 'Aceptar Pedido',
    reject: 'Rechazar Pedido',
    prepare: 'Comenzar Preparación',
    ready: 'Marcar como Listo',
  };
  return titles[props.actionType] || 'Confirmar Acción';
});

const modalIcon = computed(() => {
  const icons = {
    accept: '✅',
    reject: '❌',
    prepare: '🔪',
    ready: '📦',
  };
  return icons[props.actionType] || '📋';
});

const modalDescription = computed(() => {
  const descriptions = {
    accept: '¿Estás seguro de que deseas aceptar este pedido? El cliente será notificado.',
    reject: '¿Estás seguro de que deseas rechazar este pedido? El cliente será notificado y podrá buscar otras opciones.',
    prepare: '¿Estás seguro de que deseas comenzar la preparación de este pedido?',
    ready: '¿Estás seguro de que deseas marcar este pedido como listo? Los repartidores podrán verlo.',
  };
  return descriptions[props.actionType] || '¿Confirmas esta acción?';
});

const confirmButtonText = computed(() => {
  const texts = {
    accept: 'Aceptar Pedido',
    reject: 'Rechazar Pedido',
    prepare: 'Comenzar Preparación',
    ready: 'Marcar como Listo',
  };
  return texts[props.actionType] || 'Confirmar';
});

// Cerrar modal
const close = () => {
  if (!props.isLoading) {
    errorMessage.value = '';
    successMessage.value = '';
    emit('close');
  }
};

// Confirmar acción
const handleConfirm = () => {
  if (props.isLoading) return;

  // Validar confirmación para rechazo
  if (props.actionType === 'reject' && !confirmed.value) {
    errorMessage.value = 'Debes confirmar el rechazo del pedido';
    successMessage.value = '';
    return;
  }

  // Limpiar errores antes de enviar
  errorMessage.value = '';
  successMessage.value = '';

  const data = {
    action: props.actionType,
    rejectionReason: props.actionType === 'reject' ? localRejectionReason.value : '',
  };

  emit('confirm', data);
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  font-size: 24px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.modal-close {
  padding: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  border-radius: 8px;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1a1a1a;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

/* Body */
.modal-body {
  padding: 24px;
}

.order-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.order-info p {
  margin: 0;
  font-size: 14px;
  color: #1a1a1a;
}

.order-total {
  font-size: 16px !important;
}

.order-total strong {
  color: #7e097e;
}

/* Success Message */
.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #dcfce7;
  color: #166534;
  border-radius: 8px;
  border: 1px solid #86efac;
  margin-bottom: 12px;
  font-size: 14px;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  border: 1px solid #fca5a5;
  margin-bottom: 12px;
  font-size: 14px;
}

.modal-description {
  font-size: 15px;
  color: #1a1a1a;
  margin-bottom: 16px;
  line-height: 1.5;
}

/* Reject Reason */
.reject-reason {
  margin-top: 16px;
}

.reject-reason label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.reject-reason textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.15s;
  min-height: 80px;
}

.reject-reason textarea:focus {
  outline: none;
  border-color: #7e097e;
  box-shadow: 0 0 0 3px rgba(126, 9, 126, 0.1);
}

.reject-reason .hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #94a3b8;
}

/* Confirmation Check */
.confirmation-check {
  margin-top: 16px;
  padding: 12px 16px;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fca5a5;
}

.confirmation-check label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
}

.confirmation-check input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #dc2626;
  cursor: pointer;
  flex-shrink: 0;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.btn-cancel {
  padding: 8px 16px;
  background: transparent;
  color: #64748b;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}

.btn-cancel:hover:not(:disabled) {
  background: #f1f5f9;
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-confirm {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  color: white;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-confirm-accept {
  background: #22c55e;
}

.btn-confirm-accept:hover:not(:disabled) {
  background: #16a34a;
}

.btn-confirm-reject {
  background: #ef4444;
}

.btn-confirm-reject:hover:not(:disabled) {
  background: #dc2626;
}

.btn-confirm-prepare {
  background: #8b5cf6;
}

.btn-confirm-prepare:hover:not(:disabled) {
  background: #7c3aed;
}

.btn-confirm-ready {
  background: #22c55e;
}

.btn-confirm-ready:hover:not(:disabled) {
  background: #16a34a;
}

.btn-confirm-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .modal-content {
    margin: 16px;
    max-width: 100%;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 12px 20px;
    flex-direction: column-reverse;
  }

  .btn-confirm,
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }

  .order-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
