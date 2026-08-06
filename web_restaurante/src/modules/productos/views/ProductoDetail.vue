<template>
  <div style="padding: 24px; max-width: 800px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">Detalle de Producto</h1>
        <p style="font-size: 14px; color: #666;">Información del producto</p>
      </div>
      <div style="display: flex; gap: 12px;">
        <button @click="goToList"
          style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.15s;">
          <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd" />
          </svg>
          Volver
        </button>
        <button @click="goToEdit(producto.id)"
          style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;">
          <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Editar
        </button>
        <button @click="confirmDelete(producto)"
          style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;">
          <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd" />
          </svg>
          Eliminar
        </button>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="error"
      style="margin-bottom: 16px; padding: 12px 16px; background: #fee2e2; color: #991b1b; border-radius: 8px; border: 1px solid #fca5a5;">
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" style="text-align: center; padding: 60px 20px;">
      <div
        style="width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #7e097e; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px;">
      </div>
      <p style="color: #64748b;">Cargando producto...</p>
    </div>

    <!-- Detalle -->
    <div v-else-if="producto"
      style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e5e7eb;">
      <!-- Header con imagen y nombre -->
      <div style="display: flex; align-items: stretch; border-bottom: 1px solid #e5e7eb;">
        <!-- Imagen -->
        <div
          style="width: 160px; min-height: 160px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border-right: 1px solid #e5e7eb;">
          <div
            style="width: 80px; height: 80px; border-radius: 12px; background: #fa8bf5; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            🍕
          </div>
        </div>
        <!-- Info principal -->
        <div style="padding: 24px; flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px;">
            <h2 style="font-size: 22px; font-weight: 700; color: #1a1a1a;">{{ producto.name }}</h2>
            <span
              style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; font-size: 12px; font-weight: 500; border-radius: 9999px;"
              :style="producto.is_available ? { background: '#dcfce7', color: '#166534' } : { background: '#fee2e2', color: '#991b1b' }">
              <span style="width: 6px; height: 6px; border-radius: 50%; display: inline-block;"
                :style="producto.is_available ? { background: '#22c55e' } : { background: '#ef4444' }"></span>
              {{ producto.is_available ? 'Disponible' : 'No disponible' }}
            </span>
            <span v-if="producto.is_featured"
              style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; font-size: 12px; font-weight: 500; border-radius: 9999px; background: #fef3c7; color: #92400e;">
              ⭐ Destacado
            </span>
          </div>
          <p style="color: #666; font-size: 14px; margin-bottom: 8px;">{{ producto.description || 'Sin descripción' }}
          </p>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span style="font-size: 20px; font-weight: 700; color: #1a1a1a;">${{ producto.price }}</span>
            <span v-if="producto.discount_price"
              style="font-size: 14px; color: #ef4444; text-decoration: line-through;">${{ producto.discount_price
              }}</span>
          </div>
        </div>
      </div>

      <!-- Información detallada -->
      <div style="padding: 24px;">
        <div
          style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
          <!-- Categoría -->
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Categoría</p>
            <p style="font-size: 14px; color: #1a1a1a;">
              {{ getCategoriaNombre(producto.category) || 'Sin categoría' }}
            </p>
          </div>
          <!-- Stock -->
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Stock</p>
            <p style="font-size: 14px; color: #1a1a1a;">
              <span
                :style="producto.stock > 10 ? { color: '#22c55e', fontWeight: '600' } : producto.stock > 0 ? { color: '#f59e0b', fontWeight: '600' } : { color: '#ef4444', fontWeight: '600' }">
                {{ producto.stock || 0 }} unidades
              </span>
            </p>
          </div>
          <!-- Tiempo preparación -->
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Tiempo de preparación</p>
            <p style="font-size: 14px; color: #1a1a1a;">{{ producto.preparation_time || 15 }} minutos</p>
          </div>
        </div>

        <!-- Características -->
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
          <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 12px;">
            Características</p>
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <span v-if="producto.is_vegetarian"
              style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #dcfce7; color: #166534; border-radius: 9999px; font-size: 13px; font-weight: 500;">
              🌱 Vegetariano
            </span>
            <span v-if="producto.is_vegan"
              style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #dcfce7; color: #166534; border-radius: 9999px; font-size: 13px; font-weight: 500;">
              🌿 Vegano
            </span>
            <span v-if="producto.is_gluten_free"
              style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #fef3c7; color: #92400e; border-radius: 9999px; font-size: 13px; font-weight: 500;">
              🚫 Sin Gluten
            </span>
            <span v-if="!producto.is_vegetarian && !producto.is_vegan && !producto.is_gluten_free"
              style="color: #94a3b8; font-size: 14px;">
              Sin características especiales
            </span>
          </div>
        </div>

        <!-- Metadatos -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              ID</p>
            <p style="font-size: 13px; color: #64748b;">#{{ producto.id }}</p>
          </div>
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Orden</p>
            <p style="font-size: 13px; color: #64748b;">{{ producto.order || 0 }}</p>
          </div>
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Creado</p>
            <p style="font-size: 13px; color: #64748b;">{{ formatDate(producto.created_at) }}</p>
          </div>
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Última actualización</p>
            <p style="font-size: 13px; color: #64748b;">{{ formatDate(producto.updated_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- No encontrado -->
    <div v-else
      style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
      <svg style="width: 48px; height: 48px; margin: 0 auto 16px; color: #cbd5e1;" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">Producto no encontrado</h3>
      <p style="font-size: 14px; color: #94a3b8;">El producto que buscas no existe o ha sido eliminado</p>
      <button @click="goToList"
        style="margin-top: 16px; padding: 8px 24px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
        Volver al listado
      </button>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px);"
      @click="showDeleteModal = false">
      <div
        style="background: white; border-radius: 16px; max-width: 400px; width: 90%; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);"
        @click.stop>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">Confirmar Eliminación</h3>
        <p style="color: #666; margin-bottom: 4px;">
          ¿Estás seguro de que deseas eliminar el producto
          <strong style="color: #1a1a1a;">{{ producto?.name }}</strong>?
        </p>
        <p style="color: #991b1b; font-size: 14px; margin-top: 4px;">Esta acción no se puede deshacer.</p>

        <div
          style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <button @click="showDeleteModal = false"
            style="padding: 8px 16px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px;">Cancelar</button>
          <button @click="deleteProducto" :disabled="isDeleting"
            style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductos } from '../composables/useProductos';

defineOptions({ name: 'ProductoDetail' });

const route = useRoute();
const productoId = route.params.id;

const {
  producto,
  categorias,
  isLoading,
  isDeleting,
  error,
  showDeleteModal,
  loadProducto,
  confirmDelete,
  deleteProducto,
  goToList,
  goToEdit,
} = useProductos();

// const hoverRow = ref(null);

// Obtener nombre de categoría
const getCategoriaNombre = (categoryId) => {
  if (!categoryId) return null;
  const cat = categorias.value.find(c => c.id === categoryId);
  return cat?.name || null;
};

// Formatear fecha
const formatDate = (dateString) => {
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

// Cargar producto al montar
onMounted(() => {
  loadProducto(productoId);
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
