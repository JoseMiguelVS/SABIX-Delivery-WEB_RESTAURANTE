import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import notificacionService from '../services/notificacionService'

export function useNotificaciones() {
  const router = useRouter()

  // Estados
  const notificaciones = ref([])
  const notificacion = ref(null)
  const isLoading = ref(false)
  const isUpdating = ref(false)
  const error = ref('')
  const success = ref('')
  const totalCount = ref(0)
  const unreadCount = ref(0)
  const showDeleteModal = ref(false)
  const notificacionToDelete = ref(null)
  const showUnreadOnly = ref(false)

  // Filtros
  const filters = reactive({
    type: '',
    page: 1,
    page_size: 20,
  })

  // Tipos de notificaciones
  const typeOptions = [
    { value: '', label: 'Todos' },
    { value: 'order_new', label: '🛎️ Nuevos pedidos' },
    { value: 'order_confirmed', label: '✅ Pedidos confirmados' },
    { value: 'order_rejected', label: '❌ Pedidos rechazados' },
    { value: 'order_in_delivery', label: '🚀 En camino' },
    { value: 'order_delivered', label: '📦 Entregados' },
    { value: 'order_cancelled', label: '❌ Cancelados' },
  ]

  // Computados
  const notificacionesNoLeidas = computed(() => {
    return notificaciones.value.filter((n) => !n.is_read)
  })

  const notificacionesLeidas = computed(() => {
    return notificaciones.value.filter((n) => n.is_read)
  })

  // Obtener icono según tipo
  const getTypeIcon = (type) => {
    const icons = {
      order_new: '🛎️',
      order_confirmed: '✅',
      order_rejected: '❌',
      order_in_delivery: '🚀',
      order_delivered: '📦',
      order_cancelled: '❌',
      order_ready: '📦',
    }
    return icons[type] || '📋'
  }

  // Obtener color según tipo
  const getTypeColor = (type) => {
    const colors = {
      order_new: '#f59e0b',
      order_confirmed: '#3b82f6',
      order_rejected: '#ef4444',
      order_in_delivery: '#8b5cf6',
      order_delivered: '#22c55e',
      order_cancelled: '#6b7280',
      order_ready: '#22c55e',
    }
    return colors[type] || '#6b7280'
  }

  // Obtener estado del pedido
  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'En Preparación',
      ready: 'Listo',
      rejected: 'Rechazado',
      cancelled: 'Cancelado',
      delivered: 'Entregado',
    }
    return labels[status] || status
  }

  // Cargar notificaciones
  // Cargar notificaciones
  const loadNotificaciones = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const params = {}
      if (filters.type) params.type = filters.type
      if (filters.page) params.page = filters.page
      if (filters.page_size) params.page_size = filters.page_size

      const result = await notificacionService.getNotificaciones(params)
      if (result.success) {
        notificaciones.value = result.data.results || []
        totalCount.value = result.data.count || 0
        unreadCount.value = result.data.unread_count || 0
        if (result.isTimeout) {
          error.value = 'El servidor no responde. Los datos pueden estar desactualizados.'
        }
      } else {
        error.value = result.message
      }
    } catch (err) {
      error.value = 'Error al cargar notificaciones'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  // Cargar contador de no leídas con manejo de errores
  const loadUnreadCount = async () => {
    try {
      const result = await notificacionService.getUnreadCount()
      if (result.success) {
        unreadCount.value = result.count || 0
      }
    } catch (err) {
      console.warn('⚠️ Error al cargar contador:', err)
    }
  }

  // Marcar como leída
  const marcarComoLeida = async (id) => {
    isUpdating.value = true
    try {
      const result = await notificacionService.marcarComoLeida(id)
      if (result.success) {
        // Actualizar localmente
        const index = notificaciones.value.findIndex((n) => n.id === id)
        if (index !== -1) {
          notificaciones.value[index].is_read = true
        }
        unreadCount.value = Math.max(0, unreadCount.value - 1)
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al marcar como leída'
      return false
    } finally {
      isUpdating.value = false
    }
  }

  // Marcar todas como leídas
  const marcarTodasComoLeidas = async () => {
    isUpdating.value = true
    try {
      const result = await notificacionService.marcarTodasComoLeidas()
      if (result.success) {
        notificaciones.value.forEach((n) => (n.is_read = true))
        unreadCount.value = 0
        success.value = 'Todas las notificaciones marcadas como leídas'
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al marcar todas como leídas'
      return false
    } finally {
      isUpdating.value = false
    }
  }

  // Eliminar notificación
  const confirmDelete = (notificacion) => {
    notificacionToDelete.value = notificacion
    showDeleteModal.value = true
  }

  const deleteNotificacion = async () => {
    if (!notificacionToDelete.value) return

    isUpdating.value = true
    try {
      const result = await notificacionService.eliminarNotificacion(notificacionToDelete.value.id)
      if (result.success) {
        notificaciones.value = notificaciones.value.filter(
          (n) => n.id !== notificacionToDelete.value.id,
        )
        totalCount.value = Math.max(0, totalCount.value - 1)
        if (!notificacionToDelete.value.is_read) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
        showDeleteModal.value = false
        notificacionToDelete.value = null
        success.value = 'Notificación eliminada'
        return true
      } else {
        error.value = result.message
        return false
      }
    } catch (error) {
      error.value = 'Error al eliminar notificación'
      return false
    } finally {
      isUpdating.value = false
    }
  }

  // Ir al detalle del pedido desde la notificación
  const goToOrderDetail = (notificacion) => {
    if (notificacion.action_url) {
      // Extraer ID del pedido de la URL
      const match = notificacion.action_url.match(/\/orders\/restaurant\/orders\/(\d+)\//)
      if (match) {
        router.push(`/pedidos/${match[1]}`)
        return
      }
    }
    // Si tiene order_id en los datos
    if (notificacion.data?.order_id) {
      router.push(`/pedidos/${notificacion.data.order_id}`)
      return
    }
    // Si tiene order directamente
    if (notificacion.order) {
      router.push(`/pedidos/${notificacion.order}`)
      return
    }
  }

  // Cambiar filtro
  const changeFilter = (type) => {
    filters.type = type
    filters.page = 1
    loadNotificaciones()
  }

  const changePage = (page) => {
    filters.page = page
    loadNotificaciones()
  }

  const toggleUnreadOnly = () => {
    showUnreadOnly.value = !showUnreadOnly.value
    loadNotificaciones()
  }

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

  // Inicializar
  onMounted(() => {
    loadNotificaciones()
    loadUnreadCount()
  })

  // Recargar contador periódicamente (cada 30 segundos)
  let intervalId = null
  onMounted(() => {
    intervalId = setInterval(() => {
      loadUnreadCount()
    }, 30000)
  })

  // Limpiar intervalo al desmontar

  return {
    // Estado
    notificaciones,
    notificacion,
    isLoading,
    isUpdating,
    error,
    success,
    totalCount,
    unreadCount,
    showDeleteModal,
    notificacionToDelete,
    filters,
    typeOptions,
    showUnreadOnly,

    // Computados
    notificacionesNoLeidas,
    notificacionesLeidas,

    // Métodos
    loadNotificaciones,
    loadUnreadCount,
    marcarComoLeida,
    marcarTodasComoLeidas,
    confirmDelete,
    deleteNotificacion,
    goToOrderDetail,
    changeFilter,
    changePage,
    toggleUnreadOnly,
    getTypeIcon,
    getTypeColor,
    getStatusLabel,
    formatDate,
  }
}
