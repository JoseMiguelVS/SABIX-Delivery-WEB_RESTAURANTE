import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import productoService from '../services/productoService'

export function useProductos() {
  const router = useRouter()

  // Estados
  const productos = ref([])
  const producto = ref(null)
  const categorias = ref([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const error = ref('')
  const success = ref('')
  const showDeleteModal = ref(false)
  const productoToDelete = ref(null)

  // Formulario
  const form = reactive({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    category: '',
    global_category: '',
    is_available: true,
    is_featured: false,
    stock: 0,
    preparation_time: 15,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    image: null,
    order: 0,
  })

  // Computados
  const productosDisponibles = computed(() => {
    return productos.value.filter((p) => p.is_available)
  })

  const productosNoDisponibles = computed(() => {
    return productos.value.filter((p) => !p.is_available)
  })

  // Resetear formulario
  const resetForm = () => {
    form.name = ''
    form.description = ''
    form.price = ''
    form.discount_price = ''
    form.category = ''
    form.global_category = ''
    form.is_available = true
    form.is_featured = false
    form.stock = 0
    form.preparation_time = 15
    form.is_vegetarian = false
    form.is_vegan = false
    form.is_gluten_free = false
    form.image = null
    form.order = 0
    error.value = ''
    success.value = ''
  }

  // Cargar productos
  const loadProductos = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const result = await productoService.getProductos()
      if (result.success) {
        productos.value = result.data
      } else {
        error.value = result.message
      }
    } catch (error) {
      error.value = 'Error al cargar productos'
    } finally {
      isLoading.value = false
    }
  }

  // Cargar categorías
  const loadCategorias = async () => {
    try {
      const result = await productoService.getCategorias()
      if (result.success) {
        categorias.value = result.data
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    }
  }

  // Cargar un producto
  const loadProducto = async (id) => {
    isLoading.value = true
    error.value = ''
    try {
      const result = await productoService.getProductoById(id)
      if (result.success) {
        producto.value = result.data
        // Llenar formulario
        form.name = result.data.name || ''
        form.description = result.data.description || ''
        form.price = result.data.price || ''
        form.discount_price = result.data.discount_price || ''
        form.category = result.data.category || ''
        form.global_category = result.data.global_category || ''
        form.is_available = result.data.is_available ?? true
        form.is_featured = result.data.is_featured ?? false
        form.stock = result.data.stock || 0
        form.preparation_time = result.data.preparation_time || 15
        form.is_vegetarian = result.data.is_vegetarian || false
        form.is_vegan = result.data.is_vegan || false
        form.is_gluten_free = result.data.is_gluten_free || false
        form.order = result.data.order || 0
      } else {
        error.value = result.message
      }
    } catch (error) {
      error.value = 'Error al cargar producto'
    } finally {
      isLoading.value = false
    }
  }

  // Crear producto
  const createProducto = async () => {
    // Validaciones
    if (!form.name || !form.name.trim()) {
      error.value = 'El nombre es obligatorio'
      return false
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      error.value = 'El precio debe ser mayor a 0'
      return false
    }

    if (form.category && !form.category) {
      error.value = 'La categoría seleccionada no es válida'
      return false
    }

    isSaving.value = true
    error.value = ''
    success.value = ''

    try {
      // Preparar datos
      const data = {
        name: form.name.trim(),
        description: form.description?.trim() || '',
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        category: form.category || null,
        global_category: form.global_category || null,
        is_available: form.is_available,
        is_featured: form.is_featured,
        stock: parseInt(form.stock) || 0,
        preparation_time: parseInt(form.preparation_time) || 15,
        is_vegetarian: form.is_vegetarian,
        is_vegan: form.is_vegan,
        is_gluten_free: form.is_gluten_free,
        order: parseInt(form.order) || 0,
      }

      const result = await productoService.createProducto(data)
      if (result.success) {
        success.value = 'Producto creado exitosamente'
        resetForm()
        await loadProductos()
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al crear producto'
      return false
    } finally {
      isSaving.value = false
    }
  }

  // Actualizar producto
  const updateProducto = async (id) => {
    if (!form.name || !form.name.trim()) {
      error.value = 'El nombre es obligatorio'
      return false
    }

    if (!form.price || parseFloat(form.price) <= 0) {
      error.value = 'El precio debe ser mayor a 0'
      return false
    }

    isSaving.value = true
    error.value = ''
    success.value = ''

    try {
      const data = {
        name: form.name.trim(),
        description: form.description?.trim() || '',
        price: parseFloat(form.price),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        category: form.category || null,
        global_category: form.global_category || null,
        is_available: form.is_available,
        is_featured: form.is_featured,
        stock: parseInt(form.stock) || 0,
        preparation_time: parseInt(form.preparation_time) || 15,
        is_vegetarian: form.is_vegetarian,
        is_vegan: form.is_vegan,
        is_gluten_free: form.is_gluten_free,
        order: parseInt(form.order) || 0,
      }

      const result = await productoService.updateProducto(id, data)
      if (result.success) {
        success.value = 'Producto actualizado exitosamente'
        resetForm()
        await loadProductos()
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al actualizar producto'
      return false
    } finally {
      isSaving.value = false
    }
  }

  // Confirmar eliminación
  const confirmDelete = (producto) => {
    productoToDelete.value = producto
    showDeleteModal.value = true
  }

  // Eliminar producto
  const deleteProducto = async () => {
    if (!productoToDelete.value) return

    isDeleting.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await productoService.deleteProducto(productoToDelete.value.id)
      if (result.success) {
        success.value = 'Producto eliminado exitosamente'
        showDeleteModal.value = false
        productoToDelete.value = null
        await loadProductos()
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al eliminar producto'
      return false
    } finally {
      isDeleting.value = false
    }
  }

  // Navegación
  const goToList = () => {
    router.push('/productos')
  }

  const goToCreate = () => {
    resetForm()
    router.push('/productos/nuevo')
  }

  const goToEdit = (id) => {
    router.push(`/productos/${id}/editar`)
  }

  const goToDetail = (id) => {
    router.push(`/productos/${id}`)
  }

  // Inicializar
  onMounted(() => {
    loadProductos()
    loadCategorias()
  })

  return {
    // Estado
    productos,
    producto,
    categorias,
    isLoading,
    isSaving,
    isDeleting,
    error,
    success,
    showDeleteModal,
    productoToDelete,
    form,
    productosDisponibles,
    productosNoDisponibles,

    // Métodos
    loadProductos,
    loadCategorias,
    loadProducto,
    createProducto,
    updateProducto,
    confirmDelete,
    deleteProducto,
    resetForm,
    goToList,
    goToCreate,
    goToEdit,
    goToDetail,
  }
}
