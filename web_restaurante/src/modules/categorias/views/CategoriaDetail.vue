<template>
  <div style="padding: 24px; max-width: 800px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">Detalle de Categoría</h1>
        <p style="font-size: 14px; color: #666;">Información de la categoría</p>
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
        <button @click="goToEdit(categoria.id)"
          style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;">
          <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Editar
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
      <p style="color: #64748b;">Cargando categoría...</p>
    </div>

    <!-- Detalle -->
    <div v-else-if="categoria"
      style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e5e7eb;">
      <!-- Header con icono y nombre -->
      <div style="padding: 24px; border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div>
            <h2 style="font-size: 22px; font-weight: 700; color: #1a1a1a;">{{ categoria.name }}</h2>
            <span
              style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; font-size: 12px; font-weight: 500; border-radius: 9999px; margin-top: 4px;"
              :style="categoria.is_active ? { background: '#dcfce7', color: '#166534' } : { background: '#fee2e2', color: '#991b1b' }">
              <span style="width: 6px; height: 6px; border-radius: 50%; display: inline-block;"
                :style="categoria.is_active ? { background: '#22c55e' } : { background: '#ef4444' }"></span>
              {{ categoria.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Información -->
      <div style="padding: 24px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <!-- Estado -->
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Estado</p>
            <span
              style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; font-size: 12px; font-weight: 500; border-radius: 9999px;"
              :style="categoria.is_active ? { background: '#dcfce7', color: '#166534' } : { background: '#fee2e2', color: '#991b1b' }">
              <span style="width: 6px; height: 6px; border-radius: 50%; display: inline-block;"
                :style="categoria.is_active ? { background: '#22c55e' } : { background: '#ef4444' }"></span>
              {{ categoria.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>

          <!-- Nombre -->
          <div style="grid-column: span 2;">
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Nombre</p>
            <p style="font-size: 16px; font-weight: 600; color: #1a1a1a;">{{ categoria.name }}</p>
          </div>

          <!-- Descripción -->
          <div style="grid-column: span 2;">
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Descripción</p>
            <p
              style="font-size: 14px; color: #1a1a1a; background: #f8fafc; padding: 12px; border-radius: 8px; min-height: 40px; border: 1px solid #e5e7eb;">
              {{ categoria.description || 'Sin descripción' }}
            </p>
          </div>

          <!-- Fecha de creación -->
          <div>
            <p
              style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">
              Creado</p>
            <p style="font-size: 13px; color: #64748b;">{{ formatDate(categoria.created_at) }}</p>
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
      <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px;">Categoría no encontrada</h3>
      <p style="font-size: 14px; color: #94a3b8;">La categoría que buscas no existe o ha sido eliminada</p>
      <button @click="goToList"
        style="margin-top: 16px; padding: 8px 24px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
        Volver al listado
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCategorias } from '../composables/useCategorias';

defineOptions({ name: 'CategoriaDetail' });

const route = useRoute();
const categoriaId = route.params.id;

const {
  categoria,
  isLoading,
  error,
  loadCategoria,
  goToList,
  goToEdit,
} = useCategorias();

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

// Cargar categoría al montar
onMounted(() => {
  loadCategoria(categoriaId);
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
