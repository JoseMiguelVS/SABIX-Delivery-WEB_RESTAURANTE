<template>
  <div class="container">
    <!-- Decorative Background -->
    <div class="decorative-blob blob-1"></div>
    <div class="decorative-blob blob-2"></div>

    <!-- Header Actions -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">Categorías</h1>
        <p class="page-subtitle">Gestiona las categorías de productos</p>
      </div>
      <div class="header-actions">
        <button class="btn-primary" @click="goToCreate">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Nueva Categoría
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
      <p>Cargando categorías...</p>
    </div>

    <!-- Table Container -->
    <div v-else class="table-container glass-panel">
      <div v-if="categorias.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h3>No hay categorías</h3>
        <p>Comienza creando tu primera categoría</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-id">#</th>
              <th class="col-name">Nombre</th>
              <th class="col-description">Descripción</th>
              <th class="col-status">Estado</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(categoria, index) in categorias" :key="categoria.id" @mouseenter="hoverRow = categoria.id"
              @mouseleave="hoverRow = null" :class="{ 'row-hover': hoverRow === categoria.id }">
              <td class="col-id">{{ index + 1 }}</td>
              <td class="col-name">{{ categoria.name }}</td>
              <td class="col-description">{{ categoria.description || '-' }}</td>
              <td class="col-status">
                <span class="badge" :class="categoria.is_active ? 'badge-active' : 'badge-inactive'">
                  <span class="badge-dot" :class="categoria.is_active ? 'dot-active' : 'dot-inactive'"></span>
                  {{ categoria.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="col-actions">
                <div class="action-group">
                  <!-- <button class="action-btn action-view" @click="goToDetail(categoria.id)" title="Ver">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button> -->
                  <button class="action-btn action-edit" @click="goToEdit(categoria.id)" title="Editar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button class="action-btn action-delete" @click="confirmDelete(categoria)" title="Eliminar">
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
            <span class="modal-emoji">{{ categoriaToDelete?.icon || '📦' }}</span>
            <h3>Confirmar Eliminación</h3>
          </div>
        </div>
        <div class="modal-body">
          <p>¿Estás seguro de que deseas eliminar la categoría <strong>{{ categoriaToDelete?.name }}</strong>?</p>
          <p class="modal-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
          <button class="btn-delete" @click="deleteCategoria" :disabled="isDeleting">
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCategorias } from '@/modules/categorias/composables/useCategorias';

defineOptions({ name: 'CategoriasPage' });

const {
  categorias,
  isLoading,
  isDeleting,
  error,
  success,
  showDeleteModal,
  categoriaToDelete,
  loadCategorias,
  confirmDelete,
  deleteCategoria,
  goToCreate,
  goToEdit,
} = useCategorias();

const hoverRow = ref(null);

onMounted(() => {
  loadCategorias();
});
</script>

<style scoped>
/* ============================================
   MESSAGES
   ============================================ */
.message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.message.success {
  background: var(--success-container);
  color: #166534;
  border: 1px solid #86efac;
}

.message.error {
  background: var(--error-container);
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.message-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
