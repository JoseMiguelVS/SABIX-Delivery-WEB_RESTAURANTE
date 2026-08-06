import api from '@/services/api'

class PedidoService {
  // GET /api/v1/orders/restaurant/orders/
  async getPedidos(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.status) {
        queryParams.append('status', params.status)
      }
      if (params.page) {
        queryParams.append('page', params.page)
      }
      if (params.page_size) {
        queryParams.append('page_size', params.page_size)
      }

      const url = `/v1/orders/restaurant/orders/${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await api.get(url)
      if (Array.isArray(response.data)) {
        // Contar pendientes
        const pendingCount = response.data.filter((p) => p.status === 'pending').length

        return {
          success: true,
          data: {
            results: response.data,
            count: response.data.length,
            pending_count: pendingCount,
          },
        }
      }

      // Si la respuesta ya tiene la estructura esperada
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar pedidos',
      }
    }
  }

  // GET /api/v1/orders/restaurant/orders/{id}/
  async getPedidoById(id) {
    try {
      const response = await api.get(`/v1/orders/restaurant/orders/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar pedido',
      }
    }
  }

  // PUT /api/v1/orders/restaurant/orders/{id}/
  async updatePedidoStatus(id, data) {
    try {
      const response = await api.put(`/v1/orders/restaurant/orders/${id}/`, data)
      return { success: true, data: response.data }
    } catch (error) {
      if (error.response?.status === 500) {
        return {
          success: false,
          message: 'Error interno del servidor',
          status: 500,
        }
      }

      let errorMessage = 'Error al actualizar pedido'
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(', ')
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        }
      }

      return {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors || null,
        status: error.response?.status,
      }
    }
  }

  // Buscar repartidor
  async findNearestDeliveryPeople(data) {
    try {
      const response = await api.post('/v1/orders/delivery/find-nearest/', data)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Error al buscar repartidores',
        status: error.response?.status,
        data: error.response?.data,
      }
    }
  }

  //  POST /api/v1/orders/delivery/assign/
  async assignDeliveryPerson(data) {
    try {
      const response = await api.post('/v1/orders/delivery/assign/', data)
      return { success: true, data: response.data }
    } catch (error) {
      //  Si es error 500, verificar si el pedido cambió
      if (error.response?.status === 500) {
        // Obtener el order_id del data que se envió
        const orderId = data.order_id

        try {
          // Esperar un momento para que el servidor procese
          await new Promise((resolve) => setTimeout(resolve, 1500))

          //  Verificar el estado del pedido
          const verifyResult = await this.getPedidoById(orderId)

          //  Si el pedido tiene repartidor asignado, considerar éxito
          if (verifyResult.success && verifyResult.data.delivery_person_name) {
            return {
              success: true,
              data: {
                message: 'Repartidor asignado exitosamente',
                order: verifyResult.data,
                assignment: { status: 'accepted', assigned_by: 'manual' },
                notifications: {
                  repartidor: 'Enviada',
                  cliente: 'Enviada',
                  restaurante: 'Enviada',
                },
              },
            }
          }
        } catch (verifyError) {
          // Si ocurre un error al verificar, devolver error
          return {
            success: false,
            message:
              'Error interno del servidor. Por favor, verifica si el repartidor fue asignado.',
            status: 500,
            data: verifyError.response?.data,
          }
        }

        // Si no se pudo verificar, devolver error
        return {
          success: false,
          message: 'Error interno del servidor. Por favor, verifica si el repartidor fue asignado.',
          status: 500,
          data: error.response?.data,
        }
      }

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Error al asignar repartidor',
        status: error.response?.status,
        data: error.response?.data,
      }
    }
  }
  // POST /api/v1/orders/delivery/assign-automatic/
  async assignAutomaticDelivery(orderId) {
    try {
      const response = await api.post(`/v1/orders/delivery/assign-automatic/`, {
        order_id: orderId,
      })
      response.data.message = response.data.message || 'Repartidor asignado automáticamente'
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Error en asignación automática',
        status: error.response?.status,
        data: error.response?.data,
      }
    }
  }

  // GET /api/v1/orders/delivery/all-available/
  async getAllAvailableDeliveryPeople() {
    try {
      const response = await api.get('/v1/orders/delivery/all-available/')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener repartidores disponibles',
        status: error.response?.status,
      }
    }
  }
}

export default new PedidoService()
