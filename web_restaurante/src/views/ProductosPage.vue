<template>
  <div class="container">
    <!-- Decorative Background -->
    <div class="decorative-blob blob-1"></div>
    <div class="decorative-blob blob-2"></div>

    <!-- Header Actions -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Productos</h1>
        <p class="page-subtitle">Gestiona el catálogo de productos</p>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="goToCreate">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Nuevo Producto
        </button>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="success" class="message success">
      <svg class="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      {{ success }}
    </div>
    <div v-if="error" class="message error">
      <svg class="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando productos...</p>
    </div>

    <!-- Table Container -->
    <div v-else class="table-container glass-panel">
      <div v-if="productos.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h3>No hay productos</h3>
        <p>Comienza creando tu primer producto</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-id">#</th>
              <th class="col-product">Producto</th>
              <th class="col-product">Categoria</th>
              <th class="col-stock">Precio</th>
              <th class="col-status">Estado</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(producto, index) in productos" :key="producto.id" @mouseenter="hoverRow = producto.id"
              @mouseleave="hoverRow = null" :class="{ 'row-hover': hoverRow === producto.id }">
              <td class="col-id">{{ index + 1 }}</td>
              <td class="col-product">
                <div class="product-cell">

                  <div class="product-info">
                    <div class="product-name">{{ producto.name }}</div>
                    <div class="product-description">{{ producto.description || 'Sin descripción' }}</div>
                  </div>
                </div>
              </td>
              <td class="col-category">
                <span class="category-name">{{ producto.category_name || 'Sin categoría' }}</span>

              </td>
              <td class="col-price">
                <span class="price-current">${{ producto.price }}</span>
                <span v-if="producto.discount_price" class="price-discount">
                  ${{ producto.discount_price }}
                </span>
              </td>

              <td class="col-status">
                <span class="badge" :class="producto.is_available ? 'badge-active' : 'badge-inactive'">
                  <span class="badge-dot" :class="producto.is_available ? 'dot-active' : 'dot-inactive'"></span>
                  {{ producto.is_available ? 'Disponible' : 'No disponible' }}
                </span>
              </td>
              <td class="col-actions">
                <div class="action-group">
                  <button class="action-btn action-view" @click="goToDetail(producto.id)" title="Ver">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button class="action-btn action-edit" @click="goToEdit(producto.id)" title="Editar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button class="action-btn action-delete" @click="confirmDelete(producto)" title="Eliminar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <span class="modal-emoji">📦</span>
            <h3>Confirmar Eliminación</h3>
          </div>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar el producto <strong>{{ productoToDelete?.name }}</strong>?</p>
          <p class="modal-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
          <button class="btn-delete" @click="deleteProducto" :disabled="isDeleting">
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductos } from '@/modules/productos/composables/useProductos';

defineOptions({ name: 'ProductosPage' });

const {
  productos,
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

// Cargar productos al montar
onMounted(() => {
  loadProductos();
});
</script>

<style scoped>
.price-current {
  font-weight: 600;
  color: var(--text-primary);
}

.price-discount {
  font-size: 12px;
  color: var(--error);
  text-decoration: line-through;
  margin-left: 6px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
