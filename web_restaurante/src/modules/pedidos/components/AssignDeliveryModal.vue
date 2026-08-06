<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h3>Asignar Repartidor</h3>
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
        <div class="order-info-summary">
          <div class="order-info-item">
            <span class="order-info-label">Pedido</span>
            <span class="order-info-value">#{{ pedido?.id }}</span>
          </div>
          <div class="order-info-item">
            <span class="order-info-label">Cliente</span>
            <span class="order-info-value">{{ pedido?.client_name || 'Cliente' }}</span>
          </div>
          <div class="order-info-item">
            <span class="order-info-label">Total</span>
            <span class="order-info-value">${{ pedido?.total }}</span>
          </div>
        </div>

        <!-- Controles -->
        <div class="search-controls">
          <button @click="handleAutoAssign" class="btn-auto" :disabled="isAssigning">
            🤖 Asignar automáticamente
          </button>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 12px; color: #64748b;">o selecciona manualmente:</span>
          </div>
        </div>

        <!-- Mensajes -->
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>

        <!-- Lista de repartidores -->
        <div v-if="deliveryPeople.length > 0" class="delivery-people-list">
          <div class="delivery-people-header">
            {{ deliveryPeople.length }} repartidores disponibles
          </div>
          <div v-for="person in deliveryPeople" :key="person.id" class="delivery-person-item"
            :class="{ 'delivery-person-selected': selectedPerson?.id === person.id }" @click="selectPerson(person)">
            <div class="delivery-person-info">
              <div class="delivery-person-avatar">
                {{ person.full_name?.charAt(0) || person.username?.charAt(0) || 'D' }}
              </div>
              <div class="delivery-person-details">
                <div class="delivery-person-name">
                  {{ person.full_name || person.username }}
                  <span class="delivery-person-rating">⭐ {{ person.rating || 'N/A' }}</span>
                </div>
                <div class="delivery-person-meta">
                  <span>📞 {{ person.phone || 'Sin teléfono' }}</span>
                  <span>📦 {{ person.completed_deliveries || 0 }} entregas</span>
                  <span v-if="person.distance_km && person.distance_km !== 'N/A'">
                    📏 {{ person.distance_km }} km
                  </span>
                </div>
              </div>
            </div>
            <span class="delivery-person-status">✅ Disponible</span>
          </div>
        </div>

        <div v-if="noDeliveryPeopleFound" class="no-delivery-people">
          <span>🚫</span>
          <p>No hay repartidores disponibles en este momento</p>
          <p class="no-delivery-hint">Intenta más tarde o amplía el radio de búsqueda</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button @click="close" class="btn-cancel">Cancelar</button>
        <button @click="assign" class="btn-assign" :disabled="!selectedPerson || isAssigning">
          {{ isAssigning ? 'Asignando...' : '✅ Asignar repartidor' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { usePedidos } from '../composables/usePedidos'
import pedidoService from '@/services/pedidoService'

const props = defineProps({
  visible: Boolean,
  pedido: Object,
  deliveryPeople: { type: Array, default: () => [] },
  isSearching: Boolean,
  isAssigning: Boolean,
  selectedPerson: Object,
  error: String,
  success: String,
  noDeliveryPeopleFound: Boolean,
})

const emit = defineEmits([
  'close',
  'assign',
  'auto-assign',
  'select',
  'assignment-success'
])

const { loadPedidos } = usePedidos()

//  Estado local
const localError = ref('')
const localSuccess = ref('')
const isAssigningLocal = ref(false)

//  Watchers para sincronizar con props
watch(() => props.isAssigning, (val) => {
  isAssigningLocal.value = val
})

watch(() => props.error, (val) => {
  localError.value = val || ''
})

watch(() => props.success, (val) => {
  localSuccess.value = val || ''
})

//  Cerrar modal
const close = () => {
  if (isAssigningLocal.value) return
  localError.value = ''
  localSuccess.value = ''
  emit('close')
}

//  Asignar repartidor manualmente
const handleAssign = async () => {
  if (!props.selectedPerson) {
    localError.value = 'Selecciona un repartidor primero'
    return
  }

  if (!props.pedido) {
    localError.value = 'No hay pedido seleccionado'
    return
  }

  isAssigningLocal.value = true
  localError.value = ''
  localSuccess.value = ''

  try {
    emit('assign')

    const result = await pedidoService.assignDeliveryPerson({
      order_id: props.pedido.id,
      delivery_person_id: props.selectedPerson.id,
    })

    if (result.success) {
      localSuccess.value = result.data?.message || 'Repartidor asignado exitosamente'
      await loadPedidos()
      emit('assignment-success')

      setTimeout(() => {
        emit('close')
      }, 1500)
    } else {
      if (result.status === 500) {
        try {
          const verifyResult = await pedidoService.getPedidoById(props.pedido.id)
          if (verifyResult.success && verifyResult.data.delivery_person_name) {
            localSuccess.value = 'Repartidor asignado exitosamente (error 500 ignorado)'
            await loadPedidos()
            emit('assignment-success')

            setTimeout(() => {
              emit('close')
            }, 2000)
          } else {
            localError.value = result.message || 'Error al asignar repartidor'
          }
        } catch (verifyError) {
          localError.value = 'Error al verificar asignación. Por favor, revisa el pedido.'
        }
      } else {
        localError.value = result.message || 'Error al asignar repartidor'
      }
    }
  } catch (err) {
    localError.value = 'Error inesperado al asignar repartidor'
  } finally {
    isAssigningLocal.value = false
  }
}

//  Asignar automáticamente
const handleAutoAssign = async () => {
  if (!props.pedido) {
    localError.value = 'No hay pedido seleccionado'
    return
  }

  isAssigningLocal.value = true
  localError.value = ''
  localSuccess.value = ''

  try {
    emit('auto-assign')

    const result = await pedidoService.assignAutomaticDelivery(props.pedido.id)

    if (result.success) {
      localSuccess.value = result.data?.message || 'Repartidor asignado automáticamente'
      await loadPedidos()
      emit('assignment-success')

      setTimeout(() => {
        emit('close')
      }, 1500)
    } else {
      if (result.status === 500) {
        try {
          const verifyResult = await pedidoService.getPedidoById(props.pedido.id)
          if (verifyResult.success && verifyResult.data.delivery_person_name) {
            localSuccess.value = 'Repartidor asignado automáticamente (error 500 ignorado)'
            await loadPedidos()
            emit('assignment-success')

            setTimeout(() => {
              emit('close')
            }, 2000)
          } else {
            localError.value = result.message || 'Error al asignar repartidor automáticamente'
          }
        } catch (verifyError) {
          localError.value = 'Error al verificar asignación automática'
        }
      } else {
        localError.value = result.message || 'Error al asignar repartidor automáticamente'
      }
    }
  } catch (err) {
    localError.value = 'Error inesperado en asignación automática'
  } finally {
    isAssigningLocal.value = false
  }
}

//  Seleccionar repartidor
const selectPerson = (person) => {
  emit('select', person)
}

//  Limpiar errores al abrir el modal
watch(() => props.visible, (val) => {
  if (val) {
    localError.value = ''
    localSuccess.value = ''
    isAssigningLocal.value = false
  }
})
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

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 95%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
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
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1a1a1a;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.order-info-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.order-info-item {
  display: flex;
  flex-direction: column;
}

.order-info-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
}

.order-info-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.search-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-end;
}

.search-control {
  flex: 1;
  min-width: 80px;
}

.search-control label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
}

.search-control-input {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 4px 8px;
  background: white;
}

.search-control-input input {
  width: 50px;
  border: none;
  outline: none;
  padding: 4px 0;
  font-size: 14px;
}

.search-control-input span {
  font-size: 12px;
  color: #94a3b8;
}

.btn-search {
  padding: 8px 16px;
  background: #7e097e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
  height: 36px;
  white-space: nowrap;
}

.btn-search:hover:not(:disabled) {
  background: #6a086a;
}

.btn-search:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delivery-people-list {
  margin-top: 8px;
}

.delivery-people-header {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.no-delivery-people {
  text-align: center;
  padding: 30px 20px;
  color: #94a3b8;
}

.no-delivery-people span {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.no-delivery-people p {
  font-size: 14px;
  margin: 4px 0;
}

.no-delivery-hint {
  font-size: 12px;
  color: #cbd5e1;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  border: 1px solid #fca5a5;
  margin-bottom: 12px;
  font-size: 14px;
}

.error-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #dcfce7;
  color: #166534;
  border-radius: 8px;
  border: 1px solid #86efac;
  margin-bottom: 12px;
  font-size: 14px;
}

.success-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

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

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-assign {
  padding: 8px 20px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}

.btn-assign:hover:not(:disabled) {
  background: #16a34a;
}

.btn-assign:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .modal-content {
    margin: 8px;
    max-height: 95vh;
  }

  .order-info-summary {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 12px;
  }

  .search-controls {
    flex-direction: column;
  }

  .search-control {
    width: 100%;
  }

  .btn-search {
    width: 100%;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-assign {
    width: 100%;
    justify-content: center;
  }
}
</style>
