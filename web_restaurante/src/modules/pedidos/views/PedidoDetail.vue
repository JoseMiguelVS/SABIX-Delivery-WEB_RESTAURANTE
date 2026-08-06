<template>
  <div style="padding: 24px; max-width: 900px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">
          Pedido #{{ pedido?.id }}
        </h1>
        <p style="font-size: 14px; color: #666;">Detalle completo del pedido</p>
      </div>
      <button @click="goToList"
        style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.15s;">
        <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd" />
        </svg>
        Volver
      </button>
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

    <!-- Loading -->
    <div v-if="isLoading" style="text-align: center; padding: 60px 20px;">
      <div
        style="width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #7e097e; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;">
      </div>
      <p style="color: #64748b;">Cargando pedido...</p>
    </div>

    <div v-else-if="pedido">
      <!-- Info principal -->
      <div
        style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Estado</p>
            <span
              style="padding: 4px 14px; border-radius: 9999px; font-size: 14px; font-weight: 500; display: inline-block;"
              :style="{
                background: getStatusColor(pedido.status) + '20',
                color: getStatusColor(pedido.status)
              }">
              {{ getStatusLabel(pedido.status) }}
            </span>
          </div>
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Total</p>
            <p style="font-size: 18px; font-weight: 700; color: #1a1a1a;">${{ pedido.total }}</p>
          </div>
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Fecha</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ formatDateFull(pedido.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Cliente -->
      <div
        style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; margin-bottom: 16px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 12px;">👤 Información del Cliente
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Nombre</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ pedido.client_name || 'No especificado' }}</p>
          </div>
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Teléfono</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ pedido.client_phone || 'No especificado' }}</p>
          </div>
          <div style="grid-column: span 2;">
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Email</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ pedido.client_email || 'No especificado' }}</p>
          </div>
          <div style="grid-column: span 2;">
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Dirección de Entrega</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ pedido.delivery_address || 'No especificada' }}</p>
          </div>
          <div v-if="pedido.delivery_notes" style="grid-column: span 2;">
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Notas de Entrega</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ pedido.delivery_notes }}</p>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div
        style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; margin-bottom: 16px;">
        <h3 style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 12px;">📦 Productos</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead style="border-bottom: 1px solid #e5e7eb;">
            <tr>
              <th
                style="padding: 8px 12px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Producto</th>
              <th
                style="padding: 8px 12px; text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Cant.</th>
              <th
                style="padding: 8px 12px; text-align: right; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Precio</th>
              <th
                style="padding: 8px 12px; text-align: right; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pedido.items" :key="item.id" style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 12px;">
                <div style="font-weight: 500; color: #1a1a1a;">{{ item.product_name }}</div>
                <div v-if="item.selected_options && Object.keys(item.selected_options).length > 0"
                  style="font-size: 12px; color: #666;">
                  {{ formatOptions(item.selected_options) }}
                </div>
                <div v-if="item.notes" style="font-size: 12px; color: #8b5cf6;">📝 {{ item.notes }}</div>
              </td>
              <td style="padding: 8px 12px; text-align: center; color: #1a1a1a;">{{ item.quantity }}</td>
              <td style="padding: 8px 12px; text-align: right; color: #1a1a1a;">${{ item.product_price }}</td>
              <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #1a1a1a;">${{ item.total }}</td>
            </tr>
          </tbody>
          <tfoot style="border-top: 2px solid #e5e7eb;">
            <tr>
              <td colspan="3" style="padding: 8px 12px; text-align: right; font-weight: 600; color: #1a1a1a;">Subtotal
              </td>
              <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #1a1a1a;">${{ pedido.subtotal ||
                pedido.total }}</td>
            </tr>
            <tr v-if="pedido.delivery_fee">
              <td colspan="3" style="padding: 8px 12px; text-align: right; font-weight: 600; color: #1a1a1a;">Costo de
                envío</td>
              <td style="padding: 8px 12px; text-align: right; font-weight: 600; color: #1a1a1a;">${{
                pedido.delivery_fee }}</td>
            </tr>
            <tr>
              <td colspan="3"
                style="padding: 8px 12px; text-align: right; font-size: 16px; font-weight: 700; color: #1a1a1a;">Total
              </td>
              <td style="padding: 8px 12px; text-align: right; font-size: 16px; font-weight: 700; color: #1a1a1a;">${{
                pedido.total }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Info adicional -->
      <div
        style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Método de Pago</p>
            <p style="font-size: 14px; color: #1a1a1a;">
              {{ pedido.payment_method === 'cash' ? '💵 Efectivo' :
                pedido.payment_method === 'card' ? '💳 Tarjeta' :
                  pedido.payment_method || 'No especificado' }}
            </p>
          </div>
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Estado de Pago</p>
            <p style="font-size: 14px; color: #1a1a1a;">
              <span :style="pedido.is_paid ? { color: '#22c55e' } : { color: '#f59e0b' }">
                {{ pedido.is_paid ? '✅ Pagado' : '⏳ Pendiente' }}
              </span>
            </p>
          </div>
          <div v-if="pedido.delivery_person_name" style="grid-column: span 2;">
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              🚴 Repartidor</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ pedido.delivery_person_name }}</p>
          </div>
          <div v-if="pedido.notes" style="grid-column: span 2;">
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Notas adicionales</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ pedido.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button v-if="pedido.can_accept" @click="acceptPedido(pedido)"
          style="padding: 10px 24px; background: #22c55e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.15s;"
          @mouseenter="acceptHover = true" @mouseleave="acceptHover = false"
          :style="acceptHover ? { background: '#16a34a' } : {}">
          ✅ Aceptar Pedido
        </button>
        <button v-if="pedido.can_reject" @click="rejectPedido(pedido)"
          style="padding: 10px 24px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.15s;"
          @mouseenter="rejectHover = true" @mouseleave="rejectHover = false"
          :style="rejectHover ? { background: '#dc2626' } : {}">
          ❌ Rechazar Pedido
        </button>
        <button v-if="pedido.status === 'confirmed'" @click="preparePedido(pedido)"
          style="padding: 10px 24px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.15s;"
          @mouseenter="prepareHover = true" @mouseleave="prepareHover = false"
          :style="prepareHover ? { background: '#7c3aed' } : {}">
          🔪 Comenzar Preparación
        </button>
        <button v-if="pedido.status === 'preparing'" @click="readyPedido(pedido)"
          style="padding: 10px 24px; background: #22c55e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.15s;"
          @mouseenter="readyHover = true" @mouseleave="readyHover = false"
          :style="readyHover ? { background: '#16a34a' } : {}">
          📦 Marcar como Listo
        </button>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showStatusModal"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px);"
      @click="showStatusModal = false">
      <div
        style="background: white; border-radius: 16px; max-width: 450px; width: 90%; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);"
        @click.stop>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">
          {{ actionType === 'accept' ? '✅ Aceptar Pedido' :
            actionType === 'reject' ? '❌ Rechazar Pedido' :
              actionType === 'prepare' ? '🔪 Preparar Pedido' :
                '📦 Marcar como Listo' }}
        </h3>

        <p style="color: #666; margin-bottom: 4px;">
          Pedido #{{ selectedPedido?.id }}
        </p>

        <div v-if="actionType === 'reject'" style="margin-top: 12px;">
          <label style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px;">Motivo
            de rechazo (opcional)</label>
          <textarea v-model="rejectionReason" rows="3"
            style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; resize: vertical; font-family: inherit;"
            placeholder="Ej: Restaurante cerrado por mantenimiento..." />
        </div>

        <div
          style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <button @click="showStatusModal = false"
            style="padding: 8px 16px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px;">Cancelar</button>
          <button @click="confirmAction" :disabled="isUpdating"
            style="padding: 8px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.15s;"
            :style="actionType === 'accept' ? { background: '#22c55e', color: 'white' } :
              actionType === 'reject' ? { background: '#ef4444', color: 'white' } :
                { background: '#7e097e', color: 'white' }">
            {{ isUpdating ? 'Procesando...' :
              actionType === 'accept' ? 'Aceptar' :
                actionType === 'reject' ? 'Rechazar' :
                  actionType === 'prepare' ? 'Comenzar' : 'Marcar Listo' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePedidos } from '../composables/usePedidos';

defineOptions({ name: 'PedidoDetail' });

const route = useRoute();
const pedidoId = route.params.id;

const {
  pedido,
  isLoading,
  isUpdating,
  error,
  success,
  showStatusModal,
  selectedPedido,
  actionType,
  rejectionReason,
  loadPedido,
  acceptPedido,
  rejectPedido,
  preparePedido,
  readyPedido,
  confirmAction,
  goToList,
  getStatusColor,
  getStatusLabel,
  formatDate,
} = usePedidos();

const acceptHover = ref(false);
const rejectHover = ref(false);
const prepareHover = ref(false);
const readyHover = ref(false);

// Formatear fecha completa
const formatDateFull = (dateString) => {
  if (!dateString) return '---';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

// Formatear opciones del producto
const formatOptions = (options) => {
  if (!options) return '';
  return Object.entries(options)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

onMounted(() => {
  loadPedido(pedidoId);
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
