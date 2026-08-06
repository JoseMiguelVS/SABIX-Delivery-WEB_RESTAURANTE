<template>
  <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">Pedidos</h1>
        <p style="font-size: 14px; color: #666;">Gestiona los pedidos de tu restaurante</p>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <button @click="loadPedidos"
          style="padding: 6px 12px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500;">
          🔄 Recargar
        </button>
        <span v-if="pendingCount > 0"
          style="padding: 6px 12px; background: #fee2e2; color: #991b1b; border-radius: 9999px; font-size: 14px; font-weight: 500;">
          🔔 {{ pendingCount }} pendientes
        </span>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="success"
      style="margin-bottom: 16px; padding: 12px 16px; background: #dcfce7; color: #166534; border-radius: 8px; border: 1px solid #86efac;">
      {{ success }}
    </div>
    <div v-if="error"
      style="margin-bottom: 16px; padding: 12px 16px; background: #fee2e2; color: #991b1b; border-radius: 8px; border: 1px solid #fca5a5;">
      {{ error }}
    </div>

    <!-- Filtros -->
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
      <button v-for="option in statusOptions" :key="option.value" @click="changeFilter(option.value)"
        style="padding: 6px 16px; border-radius: 9999px; border: 1px solid #e5e7eb; background: white; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;"
        :style="filters.status === option.value ? { background: '#7e097e', color: 'white', borderColor: '#7e097e' } : { background: 'white', color: '#1a1a1a' }">
        {{ option.label }}
        <span v-if="option.value === '' && totalCount > 0" style="margin-left: 4px; font-size: 11px; opacity: 0.7;">({{
          totalCount }})</span>
        <span v-else-if="option.value === 'pending' && pendingCount > 0"
          style="margin-left: 4px; font-size: 11px; opacity: 0.7;">({{ pendingCount }})</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" style="text-align: center; padding: 60px 20px;">
      <div
        style="width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #7e097e; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;">
      </div>
      <p style="color: #64748b;">Cargando pedidos...</p>
    </div>

    <!-- Lista de pedidos -->
    <div v-else style="display: flex; flex-direction: column; gap: 12px;">
      <!-- Sin pedidos -->
      <div v-if="pedidos.length === 0"
        style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; color: #94a3b8;">
        <svg style="width: 48px; height: 48px; margin: 0 auto 16px; color: #cbd5e1;" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">No hay pedidos</h3>
        <p style="font-size: 14px;">Aún no has recibido pedidos</p>
        <p v-if="filters.status" style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
          Filtro: {{ getStatusLabel(filters.status) }}
        </p>
      </div>

      <!-- Tarjeta de pedido -->
      <div v-for="pedido in pedidos" :key="pedido.id" @click="goToDetail(pedido.id)" class="order-card" :style="{
        borderLeft: pedido.status === 'pending' ? '4px solid #f59e0b' : '4px solid transparent',
        background: pedido.status === 'pending' ? '#fffbeb' : 'white',
        boxShadow: hoverPedido === pedido.id ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
        transform: hoverPedido === pedido.id ? 'translateY(-2px)' : 'none'
      }" @mouseenter="hoverPedido = pedido.id" @mouseleave="hoverPedido = null">
        <div
          style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="display: flex; flex-direction: column; align-items: center; min-width: 60px;">
              <span style="font-size: 20px; font-weight: 700; color: #1a1a1a;">#{{ pedido.id }}</span>
              <span style="padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 500;" :style="{
                background: getStatusColor(pedido.status) + '20',
                color: getStatusColor(pedido.status)
              }">
                {{ getStatusLabel(pedido.status) }}
              </span>
            </div>
            <div>
              <div style="font-weight: 600; color: #1a1a1a;">{{ pedido.client_name || 'Cliente' }}</div>
              <div style="font-size: 13px; color: #666;">{{ pedido.client_phone || 'Sin teléfono' }}</div>
              <div style="font-size: 13px; color: #666; margin-top: 4px;">
                {{ pedido.items?.length || 0 }} productos
                <span v-if="pedido.delivery_person_name" style="margin-left: 8px;">🚴 {{ pedido.delivery_person_name
                  }}</span>
              </div>
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${{ pedido.total }}</div>
            <div style="font-size: 12px; color: #64748b;">{{ formatDate(pedido.created_at) }}</div>
            <div v-if="pedido.is_paid" style="font-size: 12px; color: #22c55e;">✅ Pagado</div>
            <div v-else style="font-size: 12px; color: #f59e0b;">⏳ Pendiente de pago</div>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div
          style="display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; flex-wrap: wrap;">
          <!-- Pendiente -->
          <template v-if="pedido.status === 'pending'">
            <button @click.stop="acceptPedido(pedido)"
              style="padding: 6px 16px; background: #22c55e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;"
              @mouseenter="acceptHover = true" @mouseleave="acceptHover = false"
              :style="acceptHover ? { background: '#16a34a' } : {}">
              ✅ Aceptar
            </button>
            <button @click.stop="rejectPedido(pedido)"
              style="padding: 6px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;"
              @mouseenter="rejectHover = true" @mouseleave="rejectHover = false"
              :style="rejectHover ? { background: '#dc2626' } : {}">
              ❌ Rechazar
            </button>
          </template>

          <!-- Confirmado -->
          <template v-if="pedido.status === 'confirmed'">
            <button @click.stop="preparePedido(pedido)"
              style="padding: 6px 16px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;"
              @mouseenter="prepareHover = true" @mouseleave="prepareHover = false"
              :style="prepareHover ? { background: '#7c3aed' } : {}">
              🔪 Comenzar Preparación
            </button>
          </template>

          <!-- Preparando -->
          <template v-if="pedido.status === 'preparing'">
            <button @click.stop="readyPedido(pedido)"
              style="padding: 6px 16px; background: #22c55e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;"
              @mouseenter="readyHover = true" @mouseleave="readyHover = false"
              :style="readyHover ? { background: '#16a34a' } : {}">
              📦 Marcar como Listo
            </button>
          </template>

          <!-- ✅ Listo - Botón para asignar repartidor -->
          <template v-if="pedido.status === 'ready'">
            <button @click.stop="openAssignModal(pedido)"
              style="padding: 6px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.15s;"
              @mouseenter="assignHover = true" @mouseleave="assignHover = false"
              :style="assignHover ? { background: '#2563eb' } : {}">
              🚴 Asignar Repartidor
            </button>
            <span v-if="pedido.delivery_person_name"
              style="padding: 6px 16px; background: #dbeafe; color: #1e40af; border-radius: 8px; font-size: 13px; font-weight: 500;">
              🚴 {{ pedido.delivery_person_name }}
            </span>
          </template>

          <!-- En camino -->
          <template v-if="pedido.status === 'in_delivery'">
            <span
              style="padding: 6px 16px; background: #dbeafe; color: #1e40af; border-radius: 8px; font-size: 13px; font-weight: 500;">
              🚀 En camino con {{ pedido.delivery_person_name || 'repartidor' }}
            </span>
          </template>

          <!-- Entregado -->
          <template v-if="pedido.status === 'delivered'">
            <span
              style="padding: 6px 16px; background: #dcfce7; color: #16a34a; border-radius: 8px; font-size: 13px; font-weight: 500;">
              ✅ Entregado
            </span>
          </template>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalCount > 20"
        style="display: flex; justify-content: center; gap: 8px; margin-top: 16px; padding: 16px 0;">
        <button @click="changePage(filters.page - 1)" :disabled="filters.page <= 1"
          style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 14px; transition: all 0.15s;"
          :style="filters.page <= 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}">
          Anterior
        </button>
        <span style="display: flex; align-items: center; padding: 8px 16px; font-size: 14px; color: #1a1a1a;">
          Página {{ filters.page }}
        </span>
        <button @click="changePage(filters.page + 1)" :disabled="filters.page * filters.page_size >= totalCount"
          style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 14px; transition: all 0.15s;"
          :style="filters.page * filters.page_size >= totalCount ? { opacity: 0.5, cursor: 'not-allowed' } : {}">
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal de asignación de repartidor -->
    <AssignDeliveryModal :visible="showAssignModal" :pedido="selectedPedido" :delivery-people="deliveryPeople"
      :is-searching="isSearchingDelivery" :is-assigning="isAssigningDelivery || isAutoAssigning"
      :selected-person="selectedDeliveryPerson" :error="error" :success="success"
      :no-delivery-people-found="noDeliveryPeopleFound" @close="closeAssignModal" @select="selectDeliveryPerson"
      @assign="confirmAssignment" @auto-assign="handleAutoAssign" />

    <!-- Modal de confirmación de estado -->
    <PedidoStatusModal :visible="showStatusModal" :pedido="selectedPedido" :action-type="actionType"
      :is-loading="isUpdating" :error="error" :success="success" @close="showStatusModal = false"
      @confirm="handleModalConfirm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePedidos } from '@/modules/pedidos/composables/usePedidos';
import PedidoStatusModal from '@/modules/pedidos/views/PedidoStatusModal.vue';
import AssignDeliveryModal from '@/modules/pedidos/components/AssignDeliveryModal.vue';

defineOptions({ name: 'PedidosPage' });

const {
  pedidos,
  isLoading,
  isUpdating,
  isAutoAssigning,
  error,
  success,
  totalCount,
  pendingCount,
  showStatusModal,
  showAssignModal,
  selectedPedido,
  actionType,
  filters,
  statusOptions,
  deliveryPeople,
  isSearchingDelivery,
  isAssigningDelivery,
  selectedDeliveryPerson,
  noDeliveryPeopleFound,
  loadPedidos,
  acceptPedido,
  rejectPedido,
  preparePedido,
  readyPedido,
  changeFilter,
  changePage,
  goToDetail,
  getStatusColor,
  getStatusLabel,
  formatDate,
  updateStatus,
  openAssignModal,
  closeAssignModal,
  selectDeliveryPerson,
  confirmAssignment,
  assignAutomaticDelivery,
} = usePedidos();

const hoverPedido = ref(null);
const acceptHover = ref(false);
const rejectHover = ref(false);
const prepareHover = ref(false);
const readyHover = ref(false);
const assignHover = ref(false);

// Manejar confirmación del modal de estado
const handleModalConfirm = async (data) => {
  if (!selectedPedido.value) return;

  let status = '';
  switch (data.action) {
    case 'accept':
      status = 'confirmed';
      break;
    case 'reject':
      status = 'rejected';
      break;
    case 'prepare':
      status = 'preparing';
      break;
    case 'ready':
      status = 'ready';
      break;
    default:
      return;
  }

  const successResult = await updateStatus(selectedPedido.value.id, status, data.rejectionReason);
  if (successResult) {
    showStatusModal.value = false;
    loadPedidos();
  }
};

// Asignación automática
const handleAutoAssign = async () => {
  if (!selectedPedido.value) return;

  const success = await assignAutomaticDelivery(selectedPedido.value.id);
  if (success) {
    showAssignModal.value = false;
    loadPedidos();
  }
};

// Cargar pedidos al montar
onMounted(() => {
  loadPedidos();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.15s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .order-card {
    padding: 12px 16px;
  }
}
</style>
