<template>
  <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">Mis Productos</h1>
        <p style="font-size: 14px; color: #666;">Gestiona el menú de tu restaurante</p>
      </div>
      <button @click="goToCreate"
        style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
        <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Nuevo Producto
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
      <p style="color: #64748b;">Cargando productos...</p>
    </div>

    <!-- Tabla -->
    <div v-else
      style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e5e7eb;">
      <div v-if="productos.length === 0" style="text-align: center; padding: 60px 20px; color: #94a3b8;">
        <svg style="width: 48px; height: 48px; margin: 0 auto 16px; color: #cbd5e1;" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">No hay productos</h3>
        <p style="font-size: 14px;">Comienza agregando tu primer producto al menú</p>
      </div>

      <div v-else style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead style="background: #f8fafc; border-bottom: 1px solid #e5e7eb;">
            <tr>
              <th
                style="padding: 12px 20px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; width: 50px;">
                #</th>
              <th
                style="padding: 12px 20px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Producto</th>
              <th
                style="padding: 12px 20px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Categoría</th>
              <th
                style="padding: 12px 20px; text-align: right; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Precio</th>
              <th
                style="padding: 12px 20px; text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Stock</th>
              <th
                style="padding: 12px 20px; text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Estado</th>
              <th
                style="padding: 12px 20px; text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(producto, index) in productos" :key="producto.id"
              style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;"
              @mouseenter="hoverRow = producto.id" @mouseleave="hoverRow = null"
              :style="hoverRow === producto.id ? { background: '#f8fafc' } : {}">
              <td style="padding: 12px 20px; color: #64748b;">{{ index + 1 }}</td>
              <td style="padding: 12px 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div
                    style="width: 36px; height: 36px; border-radius: 8px; background: #fa8bf5; color: #7e097e; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 13px; flex-shrink: 0;">
                    {{ producto.name?.charAt(0) || '?' }}
                  </div>
                  <div>
                    <div style="font-weight: 500; color: #1a1a1a;">{{ producto.name }}</div>
                    <div style="font-size: 12px; color: #666;">{{ producto.description || 'Sin descripción' }}</div>
                  </div>
                </div>
              </td>
              <td style="padding: 12px 20px; color: #666;">
                {{ getCategoriaNombre(producto.category) || '-' }}
              </td>
              <td style="padding: 12px 20px; text-align: right; font-weight: 600; color: #1a1a1a;">
                ${{ producto.price }}
                <span v-if="producto.discount_price"
                  style="font-size: 12px; color: #ef4444; text-decoration: line-through; margin-left: 4px;">
                  ${{ producto.discount_price }}
                </span>
              </td>
              <td style="padding: 12px 20px; text-align: center;">
                <span
                  :style="producto.stock > 10 ? { color: '#22c55e', fontWeight: '600' } : producto.stock > 0 ? { color: '#f59e0b', fontWeight: '600' } : { color: '#ef4444', fontWeight: '600' }">
                  {{ producto.stock || 0 }}
                </span>
              </td>
              <td style="padding: 12px 20px; text-align: center;">
                <span
                  style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; font-size: 12px; font-weight: 500; border-radius: 9999px;"
                  :style="producto.is_available ? { background: '#dcfce7', color: '#166534' } : { background: '#fee2e2', color: '#991b1b' }">
                  <span style="width: 6px; height: 6px; border-radius: 50%; display: inline-block;"
                    :style="producto.is_available ? { background: '#22c55e' } : { background: '#ef4444' }"></span>
                  {{ producto.is_available ? 'Disponible' : 'No disponible' }}
                </span>
              </td>
              <td style="padding: 12px 20px; text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <button @click="goToDetail(producto.id)"
                    style="padding: 6px; border: none; background: transparent; border-radius: 8px; cursor: pointer; color: #94a3b8; transition: all 0.15s;"
                    @mouseenter="viewHover = producto.id" @mouseleave="viewHover = null"
                    :style="viewHover === producto.id ? { color: '#3b82f6', background: '#dbeafe' } : {}" title="Ver">
                    <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button @click="goToEdit(producto.id)"
                    style="padding: 6px; border: none; background: transparent; border-radius: 8px; cursor: pointer; color: #94a3b8; transition: all 0.15s;"
                    @mouseenter="editHover = producto.id" @mouseleave="editHover = null"
                    :style="editHover === producto.id ? { color: '#7e097e', background: '#fa8bf5' } : {}"
                    title="Editar">
                    <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(producto)"
                    style="padding: 6px; border: none; background: transparent; border-radius: 8px; cursor: pointer; color: #94a3b8; transition: all 0.15s;"
                    @mouseenter="deleteHover = producto.id" @mouseleave="deleteHover = null"
                    :style="deleteHover === producto.id ? { color: '#ef4444', background: '#fee2e2' } : {}"
                    title="Eliminar">
                    <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showDeleteModal"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px);"
      @click="showDeleteModal = false">
      <div
        style="background: white; border-radius: 16px; max-width: 400px; width: 90%; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);"
        @click.stop>
        <h3 style="font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px;">Confirmar Eliminación</h3>
        <p style="color: #666; margin-bottom: 4px;">
          ¿Estás seguro de que deseas eliminar el producto
          <strong style="color: #1a1a1a;">{{ productoToDelete?.name }}</strong>?
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
import { ref, onMounted } from 'vue';
import { useProductos } from '../composables/useProductos';

defineOptions({ name: 'ProductosList' });

const {
  productos,
  categorias,
  isLoading,
  isDeleting,
  error,
  success,
  showDeleteModal,
  productoToDelete,
  loadProductos,
  confirmDelete,
  deleteProducto,
  goToCreate,
  goToEdit,
  goToDetail,
} = useProductos();

const hoverRow = ref(null);
const viewHover = ref(null);
const editHover = ref(null);
const deleteHover = ref(null);

// Obtener nombre de categoría
const getCategoriaNombre = (categoryId) => {
  if (!categoryId) return null;
  const cat = categorias.value.find(c => c.id === categoryId);
  return cat?.name || null;
};

// Recargar productos al montar
onMounted(() => {
  loadProductos();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
