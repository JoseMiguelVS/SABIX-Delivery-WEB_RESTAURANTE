<template>
  <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">Categorías</h1>
        <p style="font-size: 14px; color: #666;">Gestiona las categorías de productos</p>
      </div>
      <button @click="goToCreate"
        style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
        <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Nueva Categoría
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
      <p style="color: #64748b;">Cargando categorías...</p>
    </div>

    <!-- Tabla -->
    <div v-else
      style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e5e7eb;">
      <div v-if="categorias.length === 0" style="text-align: center; padding: 60px 20px; color: #94a3b8;">
        <svg style="width: 48px; height: 48px; margin: 0 auto 16px; color: #cbd5e1;" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">No hay categorías</h3>
        <p style="font-size: 14px;">Comienza creando tu primera categoría</p>
      </div>

      <div v-else style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead style="background: #f8fafc; border-bottom: 1px solid #e5e7eb;">
            <tr>
              <th
                style="padding: 12px 20px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; width: 50px;">
                #</th>
              <th
                style="padding: 12px 20px; text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; width: 60px;">
                Icono</th>
              <th
                style="padding: 12px 20px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Nombre</th>
              <th
                style="padding: 12px 20px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Descripción</th>
              <th
                style="padding: 12px 20px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Estado</th>
              <th
                style="padding: 12px 20px; text-align: center; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b;">
                Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(categoria, index) in categorias" :key="categoria.id"
              style="border-bottom: 1px solid #f1f5f9; transition: background 0.15s;"
              @mouseenter="hoverRow = categoria.id" @mouseleave="hoverRow = null"
              :style="hoverRow === categoria.id ? { background: '#f8fafc' } : {}">
              <td style="padding: 12px 20px; color: #64748b;">{{ index + 1 }}</td>
              <td style="padding: 12px 20px; text-align: center; font-size: 24px;">{{ categoria.icon || '📦' }}</td>
              <td style="padding: 12px 20px; font-weight: 500; color: #1a1a1a;">{{ categoria.name }}</td>
              <td style="padding: 12px 20px; color: #666;">{{ categoria.description || '-' }}</td>
              <td style="padding: 12px 20px;">
                <span
                  style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; font-size: 12px; font-weight: 500; border-radius: 9999px;"
                  :style="categoria.is_active ? { background: '#dcfce7', color: '#166534' } : { background: '#fee2e2', color: '#991b1b' }">
                  <span style="width: 6px; height: 6px; border-radius: 50%; display: inline-block;"
                    :style="categoria.is_active ? { background: '#22c55e' } : { background: '#ef4444' }"></span>
                  {{ categoria.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td style="padding: 12px 20px; text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                  <button @click="goToDetail(categoria.id)"
                    style="padding: 6px; border: none; background: transparent; border-radius: 8px; cursor: pointer; color: #94a3b8; transition: all 0.15s;"
                    @mouseenter="viewHover = categoria.id" @mouseleave="viewHover = null"
                    :style="viewHover === categoria.id ? { color: '#3b82f6', background: '#dbeafe' } : {}" title="Ver">
                    <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button @click="goToEdit(categoria.id)"
                    style="padding: 6px; border: none; background: transparent; border-radius: 8px; cursor: pointer; color: #94a3b8; transition: all 0.15s;"
                    @mouseenter="editHover = categoria.id" @mouseleave="editHover = null"
                    :style="editHover === categoria.id ? { color: '#7e097e', background: '#fa8bf5' } : {}"
                    title="Editar">
                    <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(categoria)"
                    style="padding: 6px; border: none; background: transparent; border-radius: 8px; cursor: pointer; color: #94a3b8; transition: all 0.15s;"
                    @mouseenter="deleteHover = categoria.id" @mouseleave="deleteHover = null"
                    :style="deleteHover === categoria.id ? { color: '#ef4444', background: '#fee2e2' } : {}"
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

    <!-- Modal -->
    <div v-if="showDeleteModal"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px);"
      @click="showDeleteModal = false">
      <div
        style="background: white; border-radius: 16px; max-width: 400px; width: 90%; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);"
        @click.stop>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 32px;">{{ categoriaToDelete?.icon || '📦' }}</span>
          <h3 style="font-size: 18px; font-weight: 600; color: #1a1a1a;">Confirmar Eliminación</h3>
        </div>
        <p style="color: #666; margin-bottom: 4px;">
          ¿Estás seguro de que deseas eliminar la categoría
          <strong style="color: #1a1a1a;">{{ categoriaToDelete?.name }}</strong>?
        </p>
        <p style="color: #991b1b; font-size: 14px; margin-top: 4px;">Esta acción no se puede deshacer.</p>

        <div
          style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <button @click="showDeleteModal = false"
            style="padding: 8px 16px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px;">Cancelar</button>
          <button @click="deleteCategoria" :disabled="isDeleting"
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
  goToDetail,
} = useCategorias();

const hoverRow = ref(null);
const viewHover = ref(null);
const editHover = ref(null);
const deleteHover = ref(null);

onMounted(() => {
  loadCategorias();
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
