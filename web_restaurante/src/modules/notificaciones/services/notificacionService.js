import api from '@/services/api'

class NotificacionService {
  // GET /v1/notifications/
  async getNotificaciones(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.type) queryParams.append('type', params.type)
      if (params.page) queryParams.append('page', params.page)
      if (params.page_size) queryParams.append('page_size', params.page_size)

      const url = `/v1/notifications/${queryParams.toString() ? '?' + queryParams.toString() : ''}`

      const response = await api.get(url)

      if (Array.isArray(response.data)) {
        const unreadCount = response.data.filter((n) => !n.is_read).length
        return {
          success: true,
          data: {
            results: response.data,
            count: response.data.length,
            unread_count: unreadCount,
          },
        }
      }

      // Si la respuesta ya tiene la estructura esperada
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al cargar notificaciones',
        status: error.response?.status,
      }
    }
  }

  // GET /api/v1/notifications/unread/count/
  async getUnreadCount() {
    try {
      const response = await api.get('/v1/notifications/unread/count/')

      // Si la respuesta es un objeto con count
      if (response.data && typeof response.data === 'object') {
        return { success: true, count: response.data.count || 0 }
      }

      // Si la respuesta es un número directamente
      if (typeof response.data === 'number') {
        return { success: true, count: response.data }
      }

      return { success: true, count: 0 }
    } catch (error) {
      return { success: false, count: 0 }
    }
  }

  // POST /api/v1/notifications/{id}/read/
  async marcarComoLeida(id) {
    try {
      const response = await api.post(`/v1/notifications/${id}/read/`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al marcar como leída',
      }
    }
  }

  // POST /api/v1/notifications/read-all/
  async marcarTodasComoLeidas() {
    try {
      const response = await api.post('/v1/notifications/read-all/')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al marcar todas como leídas',
      }
    }
  }

  // DELETE /api/v1/notifications/{id}/
  async eliminarNotificacion(id) {
    try {
      await api.delete(`/v1/notifications/${id}/`)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar notificación',
      }
    }
  }

  // GET /api/v1/notifications/{id}/
  async getNotificacionById(id) {
    try {
      const response = await api.get(`/v1/notifications/${id}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cargar notificación',
      }
    }
  }
  //  Registro de dispositivo FCM
  async registerFcmDevice(token, deviceType = 'web', deviceName = '') {
    try {
      const response = await api.post('/api/v1/notifications/fcm/device/', {
        token: token,
        device_type: deviceType,
        device_name: deviceName || navigator.userAgent || 'Web Browser',
      })
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar dispositivo',
      }
    }
  }

  //  Desregistrar dispositivo FCM
  async unregisterFcmDevice(token) {
    try {
      await api.delete('/api/v1/notifications/fcm/device/', {
        data: { token: token },
      })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al desregistrar dispositivo',
      }
    }
  }

  //  Listar dispositivos FCM
  async getFcmDevices() {
    try {
      const response = await api.get('/api/v1/notifications/fcm/devices/')
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener dispositivos',
      }
    }
  }

  //  Eliminar dispositivo FCM por ID
  async deleteFcmDevice(id) {
    try {
      await api.delete(`/api/v1/notifications/fcm/devices/${id}/`)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar dispositivo',
      }
    }
  }
}

export default new NotificacionService()
