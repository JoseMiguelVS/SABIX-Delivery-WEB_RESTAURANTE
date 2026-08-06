import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import categoriaService from '../services/categoriaService'

export function useCategorias() {
  const router = useRouter()

  // Estados
  const categorias = ref([])
  const categoria = ref(null)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const error = ref('')
  const success = ref('')
  const showDeleteModal = ref(false)
  const categoriaToDelete = ref(null)

  // Emojis disponibles
  const emojis = [
    '🍕',
    '🍔',
    '🌮',
    '🍣',
    '🥗',
    '🍜',
    '🍝',
    '🍛',
    '🥘',
    '🍲',
    '🥩',
    '🍗',
    '🧀',
    '🥚',
    '🍳',
    '🥓',
    '🍟',
    '🌭',
    '🧆',
    '🥙',
    '🌯',
    '🫓',
    '🥪',
    '🍄',
    '🥑',
    '🍆',
    '🌽',
    '🥕',
    '🧅',
    '🧄',
    '🥬',
    '🥦',
    '🍇',
    '🍉',
    '🍊',
    '🍋',
    '🍌',
    '🍍',
    '🥭',
    '🍎',
    '🍏',
    '🍐',
    '🍑',
    '🍒',
    '🍓',
    '🫐',
    '🍈',
    '🍑',
    '🍩',
    '🍪',
    '🍰',
    '🧁',
    '🍫',
    '🍬',
    '🍭',
    '🍮',
    '🥧',
    '🍦',
    '🍨',
    '🍧',
    '🧇',
    '🥞',
    '🥐',
    '🥖',
  ]

  // Formulario
  const form = reactive({
    name: '',
    description: '',
    icon: '🍕',
    is_active: true,
  })

  const _initialForm = {
    name: '',
    description: '',
    icon: '🍕',
    is_active: true,
  }

  // Computados
  const categoriasActivas = computed(() => {
    return categorias.value.filter((c) => c.is_active)
  })

  const categoriasInactivas = computed(() => {
    return categorias.value.filter((c) => !c.is_active)
  })

  // Métodos
  const resetForm = () => {
    form.name = ''
    form.description = ''
    form.icon = '🍕'
    form.is_active = true
    error.value = ''
    success.value = ''
  }

  const loadCategorias = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const result = await categoriaService.getCategorias()
      if (result.success) {
        categorias.value = result.data
      } else {
        error.value = result.message
      }
    } catch (error) {
      error.value = 'Error al cargar categorías'
    } finally {
      isLoading.value = false
    }
  }

  const loadCategoria = async (id) => {
    isLoading.value = true
    error.value = ''
    try {
      const result = await categoriaService.getCategoriaById(id)
      if (result.success) {
        categoria.value = result.data
        // Llenar formulario con datos
        form.name = result.data.name || ''
        form.description = result.data.description || ''
        form.icon = result.data.icon || '🍕'
        form.is_active = result.data.is_active ?? true
      } else {
        error.value = result.message
      }
    } catch (error) {
      error.value = 'Error al cargar categoría'
    } finally {
      isLoading.value = false
    }
  }

  const createCategoria = async () => {
    if (!form.name || !form.name.trim()) {
      error.value = 'El nombre es obligatorio'
      return false
    }

    isSaving.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await categoriaService.createCategoria({
        name: form.name.trim(),
        description: form.description?.trim() || '',
        icon: form.icon || '🍕',
        is_active: form.is_active,
      })

      if (result.success) {
        success.value = 'Categoría creada exitosamente'
        resetForm()
        await loadCategorias()
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al crear categoría'
      return false
    } finally {
      isSaving.value = false
    }
  }

  const updateCategoria = async (id) => {
    if (!form.name || !form.name.trim()) {
      error.value = 'El nombre es obligatorio'
      return false
    }

    isSaving.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await categoriaService.updateCategoria(id, {
        name: form.name.trim(),
        description: form.description?.trim() || '',
        icon: form.icon || '🍕',
        is_active: form.is_active,
      })

      if (result.success) {
        success.value = 'Categoría actualizada exitosamente'
        resetForm()
        await loadCategorias()
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al actualizar categoría'
      return false
    } finally {
      isSaving.value = false
    }
  }

  const confirmDelete = (categoria) => {
    categoriaToDelete.value = categoria
    showDeleteModal.value = true
  }

  const deleteCategoria = async () => {
    if (!categoriaToDelete.value) return

    isDeleting.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await categoriaService.deleteCategoria(categoriaToDelete.value.id)
      if (result.success) {
        success.value = 'Categoría eliminada exitosamente'
        showDeleteModal.value = false
        categoriaToDelete.value = null
        await loadCategorias()
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al eliminar categoría'
      return false
    } finally {
      isDeleting.value = false
    }
  }

  const goToList = () => {
    router.push('/categorias')
  }

  const goToCreate = () => {
    resetForm()
    router.push('/categorias/nueva')
  }

  const goToEdit = (id) => {
    router.push(`/categorias/${id}/editar`)
  }

  const goToDetail = (id) => {
    router.push(`/categorias/${id}`)
  }

  // Inicializar
  onMounted(() => {
    loadCategorias()
  })

  return {
    // Estado
    categorias,
    categoria,
    isLoading,
    isSaving,
    isDeleting,
    error,
    success,
    showDeleteModal,
    categoriaToDelete,
    form,
    emojis,
    categoriasActivas,
    categoriasInactivas,

    // Métodos
    loadCategorias,
    loadCategoria,
    createCategoria,
    updateCategoria,
    confirmDelete,
    deleteCategoria,
    resetForm,
    goToList,
    goToCreate,
    goToEdit,
    goToDetail,
  }
}
