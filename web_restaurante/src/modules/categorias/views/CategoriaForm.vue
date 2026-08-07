<template>
  <div class="category-form-wrapper">
    <!-- Header -->
    <div class="category-form-header">
      <div>
        <h1>{{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}</h1>
        <p>{{ isEdit ? 'Actualiza los datos de la categoría' : 'Crea una nueva categoría para tus productos' }}</p>
      </div>
      <button @click="goToList" class="btn-back">
        <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd" />
        </svg>
        Volver
      </button>
    </div>

    <!-- Mensajes -->
    <div v-if="success" class="message-success">{{ success }}</div>
    <div v-if="error" class="message-error">{{ error }}</div>

    <!-- Formulario -->
    <div class="category-form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-grid-2">
          <!-- Nombre -->
          <div class="form-group">
            <label>Nombre <span class="required">*</span></label>
            <input v-model="form.name" type="text" required class="form-input" :class="{ error: errors.name }"
              placeholder="Ej: Bebidas, Platos Principales..." />
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </div>
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="form.description" rows="3" class="form-textarea" :class="{ error: errors.description }"
            placeholder="Descripción de la categoría (opcional)" />
          <span v-if="errors.description" class="field-error">{{ errors.description }}</span>
        </div>

        <!-- Estado -->
        <div class="form-group">
          <label class="form-checkbox-wrapper">
            <input v-model="form.is_active" type="checkbox" />
            <span>Categoría activa</span>
          </label>
          <p class="form-checkbox-hint">
            Las categorías inactivas no se mostrarán en la aplicación
          </p>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button type="submit" :disabled="isSaving" class="btn-primary">
            {{ isSaving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
          <button type="button" @click="goToList" class="btn-secondary">
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
