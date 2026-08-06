<template>
  <div style="padding: 24px; max-width: 800px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">
          {{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h1>
        <p style="font-size: 14px; color: #666;">
          {{ isEdit ? 'Actualiza los datos de la categoría' : 'Crea una nueva categoría para tus productos' }}
        </p>
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

    <!-- Formulario -->
    <div
      style="background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px; border: 1px solid #e5e7eb;">
      <form @submit.prevent="handleSubmit">
        <!-- Icono -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">
            Icono <span style="color: #ef4444;">*</span>
          </label>
          <div
            style="display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb; min-height: 60px;">
            <button v-for="emoji in emojis" :key="emoji" type="button" @click="form.icon = emoji"
              style="width: 40px; height: 40px; font-size: 24px; border: 2px solid; border-radius: 8px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; background: white;"
              :style="form.icon === emoji ? { borderColor: '#7e097e', background: '#fa8bf5' } : { borderColor: '#e5e7eb' }">
              {{ emoji }}
            </button>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Selecciona un icono para la categoría</p>
        </div>

        <!-- Nombre -->
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">
            Nombre <span style="color: #ef4444;">*</span>
          </label>
          <input v-model="form.name" type="text" required
            style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; transition: all 0.15s;"
            :style="errors.name ? { borderColor: '#ef4444' } : {}" placeholder="Ej: Bebidas, Platos Principales..." />
          <span v-if="errors.name" style="display: block; margin-top: 4px; font-size: 13px; color: #ef4444;">{{
            errors.name }}</span>
        </div>

        <!-- Descripción -->
        <div style="margin-bottom: 16px;">
          <label
            style="display: block; font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 6px;">Descripción</label>
          <textarea v-model="form.description" rows="3"
            style="width: 100%; padding: 10px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; resize: vertical; font-family: inherit; transition: all 0.15s;"
            :style="errors.description ? { borderColor: '#ef4444' } : {}"
            placeholder="Descripción de la categoría (opcional)" />
          <span v-if="errors.description" style="display: block; margin-top: 4px; font-size: 13px; color: #ef4444;">{{
            errors.description }}</span>
        </div>

        <!-- Estado -->
        <div style="margin-bottom: 24px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input v-model="form.is_active" type="checkbox"
              style="width: 18px; height: 18px; accent-color: #7e097e; cursor: pointer;" />
            <span style="font-size: 14px; color: #1a1a1a;">Categoría activa</span>
          </label>
          <p style="font-size: 13px; color: #64748b; margin-top: 4px; margin-left: 26px;">
            Las categorías inactivas no se mostrarán en la aplicación
          </p>
        </div>

        <!-- Botones -->
        <div style="display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <button type="submit" :disabled="isSaving"
            style="padding: 10px 24px; background: #7e097e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;">
            {{ isSaving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
          <button type="button" @click="goToList"
            style="padding: 10px 24px; background: transparent; color: #64748b; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.15s;">
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
import { useCategorias } from '../composables/useCategorias';

defineOptions({ name: 'CategoriaForm' });

const route = useRoute();
const isEdit = computed(() => route.params.id && route.params.id !== 'nueva');
const categoriaId = computed(() => route.params.id);

const {
  form,
  isSaving,
  error,
  success,
  emojis,
  loadCategoria,
  createCategoria,
  updateCategoria,
  resetForm,
  goToList,
} = useCategorias();

const errors = ref({});

// Cargar datos si es edición
onMounted(async () => {
  resetForm();
  if (isEdit.value) {
    await loadCategoria(categoriaId.value);
  }
});

const handleSubmit = async () => {
  errors.value = {};

  // Validación
  if (!form.name || !form.name.trim()) {
    errors.value.name = 'El nombre es obligatorio';
    return;
  }

  if (!form.icon) {
    errors.value.icon = 'Selecciona un icono';
    return;
  }

  if (isEdit.value) {
    const success = await updateCategoria(categoriaId.value);
    if (success) {
      setTimeout(() => goToList(), 1500);
    }
  } else {
    const success = await createCategoria();
    if (success) {
      setTimeout(() => goToList(), 1500);
    }
  }
};
</script>
