import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import pedidoService from '../services/pedidoService'

export function usePedidos() {
  const router = useRouter()

  // Estados
  const pedidos = ref([])
  const pedido = ref(null)
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const isAutoAssigning = ref(false)
  const error = ref('')
  const success = ref('')
  const totalCount = ref(0)
  const pendingCount = ref(0)
  const showStatusModal = ref(false)
  const selectedPedido = ref(null)
  const actionType = ref('') // 'accept', 'reject', 'prepare', 'ready'
  const rejectionReason = ref('')

  // Repartidores
  const showAssignModal = ref(false)
  const deliveryPeople = ref([])
  const isSearchingDelivery = ref(false)
  const isAssigningDelivery = ref(false)
  const selectedDeliveryPerson = ref(null)
  const searchRadius = ref(5)
  const searchLimit = ref(5)
  const noDeliveryPeopleFound = ref(false)

  // Filtros
  const filters = reactive({
    status: '',
    page: 1,
    page_size: 20,
  })

  // Estados disponibles
  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'confirmed', label: 'Confirmados' },
    { value: 'preparing', label: 'En Preparación' },
    { value: 'ready', label: 'Listos' },
    { value: 'rejected', label: 'Rechazados' },
    { value: 'cancelled', label: 'Cancelados' },
    { value: 'delivered', label: 'Entregados' },
  ]

  // Mapeo de transiciones válidas
  const validTransitions = {
    pending: ['confirmed', 'rejected'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['delivered', 'in_delivery'],
    in_delivery: ['delivered'],
    rejected: [],
    cancelled: [],
    delivered: [],
  }

  // Computados
  const pedidosPendientes = computed(() => {
    return pedidos.value.filter((p) => p.status === 'pending')
  })

  const pedidosConfirmados = computed(() => {
    return pedidos.value.filter((p) => p.status === 'confirmed')
  })

  const pedidosEnPreparacion = computed(() => {
    return pedidos.value.filter((p) => p.status === 'preparing')
  })

  const pedidosListos = computed(() => {
    return pedidos.value.filter((p) => p.status === 'ready')
  })

  const pedidosEnDelivery = computed(() => {
    return pedidos.value.filter((p) => p.status === 'in_delivery')
  })

  // Obtener color del estado
  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      preparing: '#8b5cf6',
      ready: '#22c55e',
      rejected: '#ef4444',
      cancelled: '#6b7280',
      delivered: '#10b981',
      in_delivery: '#8b5cf6',
    }
    return colors[status] || '#6b7280'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'En Preparación',
      ready: 'Listo',
      rejected: 'Rechazado',
      cancelled: 'Cancelado',
      delivered: 'Entregado',
      in_delivery: 'En Camino',
    }
    return labels[status] || status
  }

  // Verificar si una transición es válida
  const canTransition = (currentStatus, newStatus) => {
    return validTransitions[currentStatus]?.includes(newStatus) || false
  }

  // Obtener todos los repartidores disponibles
  const getAllAvailableDeliveryPeople = async () => {
    isSearchingDelivery.value = true
    error.value = ''
    noDeliveryPeopleFound.value = false

    try {
      const result = await pedidoService.getAllAvailableDeliveryPeople()

      if (result.success) {
        const people = result.data.results || []
        deliveryPeople.value = people.map((person) => ({
          id: person.id,
          username: person.username,
          full_name: person.full_name,
          phone: person.phone,
          is_available: person.is_available,
          current_location_lat: person.current_location_lat,
          current_location_lng: person.current_location_lng,
          rating: person.rating,
          completed_deliveries: person.completed_deliveries,
          distance_km: person.distance_km || 'N/A',
          estimated_time: person.estimated_time || 'N/A',
        }))

        if (deliveryPeople.value.length === 0) {
          noDeliveryPeopleFound.value = true
          error.value = 'No hay repartidores disponibles en este momento'
        }
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (err) {
      error.value = 'Error al obtener repartidores'
      console.error(err)
      return false
    } finally {
      isSearchingDelivery.value = false
    }
  }

  // Asignación automática de repartidor
  const assignAutomaticDelivery = async (orderId) => {
    isAutoAssigning.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await pedidoService.assignAutomaticDelivery(orderId)

      if (result.success) {
        success.value = result.data.message || 'Repartidor asignado automáticamente'
        await loadPedidos()
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (err) {
      error.value = 'Error en asignación automática'
      console.error(err)
      return false
    } finally {
      isAutoAssigning.value = false
    }
  }

  // Buscar repartidores cercanos
  const findNearestDeliveryPeople = async (orderId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const restaurantLat = user.restaurant_lat || 19.43
    const restaurantLng = user.restaurant_lng || -99.13

    isSearchingDelivery.value = true
    error.value = ''
    noDeliveryPeopleFound.value = false

    try {
      const result = await pedidoService.findNearestDeliveryPeople({
        order_id: orderId,
        restaurant_lat: restaurantLat,
        restaurant_lng: restaurantLng,
        radius_km: searchRadius.value,
        limit: searchLimit.value,
      })

      if (result.success) {
        deliveryPeople.value = result.data.available_delivery_people || []
        if (deliveryPeople.value.length === 0) {
          noDeliveryPeopleFound.value = true
          error.value =
            result.data.message || 'No hay repartidores disponibles en el radio de búsqueda'
        } else {
          noDeliveryPeopleFound.value = false
          selectedPedido.value = result.data.order
        }
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (err) {
      error.value = 'Error al buscar repartidores'
      console.error(err)
      return false
    } finally {
      isSearchingDelivery.value = false
    }
  }

  // Asignar repartidor manualmente
  const assignDeliveryPerson = async (orderId, deliveryPersonId) => {
    isAssigningDelivery.value = true
    error.value = ''
    success.value = ''

    try {
      const result = await pedidoService.assignDeliveryPerson({
        order_id: orderId,
        delivery_person_id: deliveryPersonId,
      })

      if (result.success) {
        success.value = result.data.message || 'Repartidor asignado exitosamente'
        await loadPedidos()
        showAssignModal.value = false
        deliveryPeople.value = []
        selectedDeliveryPerson.value = null
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (err) {
      error.value = 'Error al asignar repartidor'
      console.error(err)
      return false
    } finally {
      isAssigningDelivery.value = false
    }
  }

  // ✅ Abrir modal de asignación - carga todos los repartidores disponibles
  const openAssignModal = async (pedido) => {
    selectedPedido.value = pedido
    showAssignModal.value = true
    // Cargar todos los repartidores disponibles
    await getAllAvailableDeliveryPeople()
  }

  // Cerrar modal de asignación
  const closeAssignModal = () => {
    showAssignModal.value = false
    deliveryPeople.value = []
    selectedDeliveryPerson.value = null
    noDeliveryPeopleFound.value = false
    error.value = ''
  }

  // Seleccionar repartidor
  const selectDeliveryPerson = (person) => {
    selectedDeliveryPerson.value = person
  }

  // Confirmar asignación manual
  const confirmAssignment = async () => {
    if (!selectedDeliveryPerson.value || !selectedPedido.value) return

    const success = await assignDeliveryPerson(
      selectedPedido.value.id,
      selectedDeliveryPerson.value.id,
    )

    if (success) {
      showAssignModal.value = false
    }
  }

  // Cargar pedidos
  const loadPedidos = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const params = {}
      if (filters.status) params.status = filters.status
      if (filters.page) params.page = filters.page
      if (filters.page_size) params.page_size = filters.page_size

      const result = await pedidoService.getPedidos(params)

      if (result.success) {
        pedidos.value = result.data.results || []
        totalCount.value = result.data.count || 0
        pendingCount.value = result.data.pending_count || 0
      } else {
        error.value = result.message
      }
    } catch (err) {
      error.value = 'Error al cargar pedidos'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  // Cargar pedido específico
  const loadPedido = async (id) => {
    isLoading.value = true
    error.value = ''
    try {
      const result = await pedidoService.getPedidoById(id)
      if (result.success) {
        pedido.value = result.data
      } else {
        error.value = result.message
      }
    } catch (err) {
      error.value = 'Error al cargar pedido'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  // Actualizar estado del pedido con validaciones
  const updateStatus = async (id, status, reason = '') => {
    isUpdating.value = true
    error.value = ''
    success.value = ''

    try {
      const currentResult = await pedidoService.getPedidoById(id)

      if (currentResult.success) {
        const currentStatus = currentResult.data.status

        if (currentStatus === status) {
          success.value = `El pedido ya está en estado "${getStatusLabel(status)}"`
          showStatusModal.value = false
          isUpdating.value = false
          return true
        }

        if (!canTransition(currentStatus, status)) {
          error.value = `No se puede cambiar de "${getStatusLabel(currentStatus)}" a "${getStatusLabel(status)}"`
          isUpdating.value = false
          return false
        }
      }

      const data = { status }
      if (status === 'rejected' && reason) {
        data.rejection_reason = reason
      }

      const result = await pedidoService.updatePedidoStatus(id, data)

      if (result.success) {
        success.value = result.data?.message || 'Estado actualizado exitosamente'
        await loadPedidos()
        if (pedido.value?.id === id) {
          await loadPedido(id)
        }
        showStatusModal.value = false
        return true
      } else {
        // Si el error es 500, verificar si el estado cambió
        if (result.status === 500 || result.status === 400) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const verifyResult = await pedidoService.getPedidoById(id)
          if (verifyResult.success && verifyResult.data.status === status) {
            success.value = 'Estado actualizado exitosamente'
            await loadPedidos()
            if (pedido.value?.id === id) {
              await loadPedido(id)
            }
            showStatusModal.value = false

            // ✅ Si el estado es "ready", abrir modal de asignación automáticamente
            if (status === 'ready') {
              const updatedPedido = pedidos.value.find((p) => p.id === id)
              if (updatedPedido) {
                setTimeout(() => {
                  openAssignModal(updatedPedido)
                }, 500)
              }
            }
            return true
          }
          error.value =
            'El servidor respondió con un error, pero el estado puede haberse actualizado.'
          return false
        }

        error.value = result.message || 'Error al actualizar estado'
        return false
      }
    } catch (err) {
      console.error('❌ Error en updateStatus:', err)
      error.value = 'Error al actualizar estado'
      return false
    } finally {
      isUpdating.value = false
    }
  }

  // Acciones del pedido con validación
  const acceptPedido = async (pedido) => {
    if (!canTransition(pedido.status, 'confirmed')) {
      error.value = `No se puede aceptar un pedido en estado "${getStatusLabel(pedido.status)}"`
      return
    }
    actionType.value = 'accept'
    selectedPedido.value = pedido
    showStatusModal.value = true
  }

  const rejectPedido = async (pedido) => {
    if (!canTransition(pedido.status, 'rejected')) {
      error.value = `No se puede rechazar un pedido en estado "${getStatusLabel(pedido.status)}"`
      return
    }
    actionType.value = 'reject'
    selectedPedido.value = pedido
    showStatusModal.value = true
  }

  const preparePedido = async (pedido) => {
    if (!canTransition(pedido.status, 'preparing')) {
      error.value = `No se puede preparar un pedido en estado "${getStatusLabel(pedido.status)}"`
      return
    }
    actionType.value = 'prepare'
    selectedPedido.value = pedido
    showStatusModal.value = true
  }

  const readyPedido = async (pedido) => {
    if (!canTransition(pedido.status, 'ready')) {
      error.value = `No se puede marcar como listo un pedido en estado "${getStatusLabel(pedido.status)}"`
      return
    }
    actionType.value = 'ready'
    selectedPedido.value = pedido
    showStatusModal.value = true
  }

  const confirmAction = async () => {
    if (!selectedPedido.value) return

    let status = ''
    switch (actionType.value) {
      case 'accept':
        status = 'confirmed'
        break
      case 'reject':
        status = 'rejected'
        break
      case 'prepare':
        status = 'preparing'
        break
      case 'ready':
        status = 'ready'
        break
      default:
        return
    }

    await updateStatus(selectedPedido.value.id, status, rejectionReason.value)
    rejectionReason.value = ''
  }

  // Cambiar filtro
  const changeFilter = (status) => {
    filters.status = status
    filters.page = 1
    loadPedidos()
  }

  const changePage = (page) => {
    filters.page = page
    loadPedidos()
  }

  // Navegación
  const goToList = () => {
    router.push('/pedidos')
  }

  const goToDetail = (id) => {
    router.push(`/pedidos/${id}`)
  }

  // Watch para recargar cuando cambia el filtro
  watch(
    () => filters.status,
    () => {
      loadPedidos()
    },
  )

  // Inicializar
  onMounted(() => {
    loadPedidos()
  })

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '---'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMin = Math.floor(diffMs / 60000)
      const diffHour = Math.floor(diffMs / 3600000)
      const diffDay = Math.floor(diffMs / 86400000)

      if (diffMin < 1) return 'Hace un momento'
      if (diffMin < 60) return `Hace ${diffMin} minutos`
      if (diffHour < 24) return `Hace ${diffHour} horas`
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return {
    // Estado
    pedidos,
    pedido,
    isLoading,
    isUpdating,
    isAutoAssigning,
    error,
    success,
    totalCount,
    pendingCount,
    showStatusModal,
    selectedPedido,
    actionType,
    rejectionReason,
    filters,
    statusOptions,

    // Computados
    pedidosPendientes,
    pedidosConfirmados,
    pedidosEnPreparacion,
    pedidosListos,
    pedidosEnDelivery,

    // Métodos
    loadPedidos,
    loadPedido,
    updateStatus,
    acceptPedido,
    rejectPedido,
    preparePedido,
    readyPedido,
    confirmAction,
    changeFilter,
    changePage,
    goToList,
    goToDetail,
    getStatusColor,
    getStatusLabel,
    formatDate,

    // Repartidores
    showAssignModal,
    deliveryPeople,
    isSearchingDelivery,
    isAssigningDelivery,
    selectedDeliveryPerson,
    searchRadius,
    searchLimit,
    noDeliveryPeopleFound,
    getAllAvailableDeliveryPeople,
    findNearestDeliveryPeople,
    assignDeliveryPerson,
    assignAutomaticDelivery,
    openAssignModal,
    closeAssignModal,
    selectDeliveryPerson,
    confirmAssignment,
  }
}
