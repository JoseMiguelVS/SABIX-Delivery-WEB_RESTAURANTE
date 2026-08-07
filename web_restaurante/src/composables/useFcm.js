import { ref} from 'vue'
import fcmService from '@/services/fcmService'
import { useAuthStore } from '@/stores/authStore'
import { useNotificaciones } from '@/modules/notificaciones/composables/useNotificaciones'

export function useFcm() {
  const authStore = useAuthStore()
  const { loadUnreadCount } = useNotificaciones()

  const isSubscribed = ref(false)
  const token = ref(null)
  const error = ref(null)
  const isSupported = ref(false)

  // ✅ Suscribirse a notificaciones
  const subscribe = async () => {
    if (!fcmService.isBrowserSupported()) {
      error.value = 'El navegador no soporta notificaciones push'
      isSupported.value = false
      return false
    }

    if (!authStore.isAuthenticated) {
      error.value = 'Debes iniciar sesión primero'
      return false
    }

    try {
      const fcmToken = await fcmService.requestPermission()
      if (fcmToken) {
        token.value = fcmToken
        isSubscribed.value = true
        isSupported.value = true
        error.value = null
        console.log('✅ Notificaciones push activadas')

        // ✅ Recargar contador después de suscribirse
        await loadUnreadCount()

        return true
      } else {
        error.value = 'No se pudo obtener el token FCM'
        isSupported.value = false
        return false
      }
    } catch (err) {
      error.value = err.message || 'Error al suscribirse'
      isSupported.value = false
      return false
    }
  }

  // ✅ Desuscribirse
  const unsubscribe = async () => {
    if (!token.value) return true

    try {
      await fcmService.unregisterDevice(token.value)
      token.value = null
      isSubscribed.value = false
      console.log('✅ Notificaciones push desactivadas')
      return true
    } catch (err) {
      error.value = err.message || 'Error al desuscribirse'
      return false
    }
  }

  // ✅ Manejar mensaje recibido
  const handleMessage = (payload) => {
    console.log('📨 Notificación recibida:', payload)

    // Recargar contador de notificaciones
    loadUnreadCount()

    // Recargar pedidos si es una notificación de pedido
    if (payload.data?.type === 'order_new' || payload.data?.order_id) {
      // Emitir evento para recargar pedidos
      window.dispatchEvent(
        new CustomEvent('order-notification', {
          detail: payload.data,
        }),
      )
    }
  }

  // ✅ Inicializar
  const initialize = () => {
    const initialized = fcmService.initialize()

    if (initialized) {
      // Escuchar mensajes en primer plano
      fcmService.onMessageReceived(handleMessage)

      // ✅ Escuchar evento personalizado
      window.addEventListener('fcm-message', (event) => {
        handleMessage(event.detail)
      })

      isSupported.value = fcmService.isBrowserSupported()
    }

    return initialized
  }

  // ✅ Limpiar event listeners
  const cleanup = () => {
    window.removeEventListener('fcm-message', handleMessage)
    window.removeEventListener('order-notification', handleMessage)
  }

  return {
    isSubscribed,
    token,
    error,
    isSupported,
    subscribe,
    unsubscribe,
    initialize,
    cleanup,
    handleMessage,
  }
}
