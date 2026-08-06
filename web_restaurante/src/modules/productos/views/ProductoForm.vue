<template>
  <div style="padding: 24px; max-width: 800px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">
          {{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}
        </h1>
        <p style="font-size: 14px; color: #666;">
          {{ isEdit ? 'Actualiza los datos del producto' : 'Agrega un nuevo producto al menú' }}
        </p>
      </div>
      <button @click="goToList"
        style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px;">
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

    <!-- Formulario -->
    <div
      style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px; border: 1px solid #e5e7eb;">
      <form @submit.prevent="handleSubmit">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <!-- Nombre -->
          <div style="grid-column: span 2;">
            <label style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">
              Nombre <span style="color: #ef4444;">*</span>
            </label>
            <input v-model="form.name" type="text" required
              style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; transition: all 0.15s;"
              :style="errors.name ? { borderColor: '#ef4444' } : {}" placeholder="Ej: Pizza Margarita" />
            <span v-if="errors.name" style="display: block; margin-top: 4px; font-size: 13px; color: #ef4444;">{{
              errors.name }}</span>
          </div>

          <!-- Descripción -->
          <div style="grid-column: span 2;">
            <label
              style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">Descripción</label>
            <textarea v-model="form.description" rows="3"
              style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; resize: vertical; font-family: inherit;"
              placeholder="Descripción del producto (opcional)" />
          </div>

          <!-- Precio -->
          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">
              Precio <span style="color: #ef4444;">*</span>
            </label>
            <input v-model="form.price" type="number" step="0.01" min="0.01" required
              style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;"
              :style="errors.price ? { borderColor: '#ef4444' } : {}" placeholder="12.99" />
            <span v-if="errors.price" style="display: block; margin-top: 4px; font-size: 13px; color: #ef4444;">{{
              errors.price }}</span>
          </div>

          <!-- Precio Descuento -->
          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">Precio
              Descuento</label>
            <input v-model="form.discount_price" type="number" step="0.01" min="0"
              style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;"
              placeholder="10.99" />
          </div>

          <!-- Categoría -->
          <div>
            <label
              style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">Categoría</label>
            <select v-model="form.category"
              style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; background: white;">
              <option value="">Sin categoría</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.icon || '📦' }} {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Stock -->
          <div>
            <label
              style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">Stock</label>
            <input v-model="form.stock" type="number" min="0"
              style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;"
              placeholder="0" />
          </div>

          <!-- Tiempo Preparación -->
          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">Tiempo
              Preparación (min)</label>
            <input v-model="form.preparation_time" type="number" min="1"
              style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;"
              placeholder="15" />
          </div>

          <!-- Orden -->
          <div>
            <label
              style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">Orden</label>
            <input v-model="form.order" type="number" min="0"
              style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;"
              placeholder="0" />
          </div>
        </div>

        <!-- Checkboxes -->
        <div
          style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
            <input v-model="form.is_available" type="checkbox"
              style="width: 18px; height: 18px; accent-color: #7e097e;" />
            Disponible
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
            <input v-model="form.is_featured" type="checkbox"
              style="width: 18px; height: 18px; accent-color: #7e097e;" />
            Destacado
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
            <input v-model="form.is_vegetarian" type="checkbox"
              style="width: 18px; height: 18px; accent-color: #7e097e;" />
            Vegetariano
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
            <input v-model="form.is_vegan" type="checkbox" style="width: 18px; height: 18px; accent-color: #7e097e;" />
            Vegano
          </label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
            <input v-model="form.is_gluten_free" type="checkbox"
              style="width: 18px; height: 18px; accent-color: #7e097e;" />
            Sin Gluten
          </label>
        </div>

        <!-- Botones -->
        <div style="display: flex; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <button type="submit" :disabled="isSaving"
            style="padding: 10px 24px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;">
            {{ isSaving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
          <button type="button" @click="goToList"
            style="padding: 10px 24px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px;">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductos } from '../composables/useProductos';

defineOptions({ name: 'ProductoForm' });

const route = useRoute();
const isEdit = computed(() => route.params.id && route.params.id !== 'nueva');
const productoId = computed(() => route.params.id);

const {
  form,
  categorias,
  isSaving,
  error,
  success,
  loadProducto,
  createProducto,
  updateProducto,
  resetForm,
  goToList,
  loadCategorias,
} = useProductos();

const errors = ref({});

// Cargar datos si es edición
onMounted(async () => {
  resetForm();
  await loadCategorias();
  if (isEdit.value) {
    await loadProducto(productoId.value);
  }
});

const handleSubmit = async () => {
  errors.value = {};

  // Validaciones
  if (!form.name || !form.name.trim()) {
    errors.value.name = 'El nombre es obligatorio';
    return;
  }

  if (!form.price || parseFloat(form.price) <= 0) {
    errors.value.price = 'El precio debe ser mayor a 0';
    return;
  }

  if (isEdit.value) {
    const success = await updateProducto(productoId.value);
    if (success) {
      setTimeout(() => goToList(), 1500);
    }
  } else {
    const success = await createProducto();
    if (success) {
      setTimeout(() => goToList(), 1500);
    }
  }
};
</script>
