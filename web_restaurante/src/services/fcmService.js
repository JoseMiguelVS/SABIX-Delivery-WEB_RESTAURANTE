import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import api from './api'

const firebaseConfig = {
  apiKey: 'AIzaSyBOcr3mc_pO2GTpE9v-XxbozT56aqEhtiM',
  authDomain: 'sabixdelivery.firebaseapp.com',
  projectId: 'sabixdelivery',
  storageBucket: 'sabixdelivery.firebasestorage.app',
  messagingSenderId: '1097443656390',
  appId: '1:1097443656390:web:69bbcbfff3c10e1dd08dc7',
  vapidKey:
    'BH_PvyS0_ex0etKAcAbGOh77V9CadWf_4utk2fXQNXQZVSrKa8GinTww2weuzuhGsC_fgulWc8zbxsGlNhYeSXE',
}

class FcmService {
  constructor() {
    this.messaging = null
    this.isSupported = false
    this.isInitialized = false
    this.token = null
  }

  // En el método initialize
  initialize() {
    try {
      const app = initializeApp(firebaseConfig)
      this.messaging = getMessaging(app)
      this.isSupported = true
      this.isInitialized = true

      // ✅ Configurar listener de mensajes en primer plano
      this.setupMessageListener()

      console.log('✅ Firebase inicializado correctamente')
      return true
    } catch (error) {
      console.error('❌ Error al inicializar Firebase:', error)
      return false
    }
  }

  // ✅ Configurar listener de mensajes
  setupMessageListener() {
    if (!this.messaging) return

    try {
      onMessage(this.messaging, (payload) => {
        console.log('📨 Mensaje recibido en primer plano:', payload)

        // ✅ Mostrar notificación en el navegador
        if (Notification.permission === 'granted') {
          const title = payload.notification?.title || 'Nueva notificación'
          const options = {
            body: payload.notification?.body || '',
            icon: payload.notification?.icon || '/favicon.ico',
            data: payload.data || {},
          }

          try {
            const notification = new Notification(title, options)

            notification.onclick = () => {
              window.focus()
              if (payload.data?.url) {
                window.location.href = payload.data.url
              }
            }
          } catch (e) {
            console.warn('⚠️ Error al mostrar notificación:', e)
          }
        }

        // ✅ Emitir evento personalizado para que la app reaccione
        window.dispatchEvent(new CustomEvent('fcm-message', { detail: payload }))
      })
    } catch (error) {
      console.warn('⚠️ Error al configurar onMessage:', error)
    }
  }

  isBrowserSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
  }

  // ✅ Función para obtener nombre corto del dispositivo
  getDeviceName() {
    const ua = navigator.userAgent

    // Detectar navegador
    let name = 'Web'
    if (ua.includes('Chrome') && !ua.includes('Edg')) name = 'Chrome'
    else if (ua.includes('Firefox')) name = 'Firefox'
    else if (ua.includes('Safari') && !ua.includes('Chrome')) name = 'Safari'
    else if (ua.includes('Edg')) name = 'Edge'
    else if (ua.includes('Opera')) name = 'Opera'

    // Detectar SO
    if (ua.includes('Windows')) name += ' (Windows)'
    else if (ua.includes('Mac')) name += ' (Mac)'
    else if (ua.includes('Linux')) name += ' (Linux)'
    else if (ua.includes('Android')) name += ' (Android)'
    else if (ua.includes('iPhone') || ua.includes('iPad')) name += ' (iOS)'

    // Truncar si es necesario
    return name.length > 100 ? name.substring(0, 97) + '...' : name
  }

  async requestPermission() {
    if (!this.isBrowserSupported()) {
      console.warn('⚠️ El navegador no soporta notificaciones push')
      return null
    }

    if (!this.isInitialized) {
      console.warn('⚠️ Firebase no está inicializado')
      return null
    }

    try {
      // ✅ Registrar Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
          console.log('✅ Service Worker registrado:', registration)
          await navigator.serviceWorker.ready
        } catch (swError) {
          console.warn('⚠️ Error al registrar Service Worker:', swError)
        }
      }

      // ✅ Solicitar permiso
      if (Notification.permission === 'denied') {
        console.warn('⚠️ Permiso de notificaciones denegado')
        return null
      }

      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          console.warn('⚠️ Permiso de notificaciones denegado')
          return null
        }
      }

      console.log('✅ Permiso de notificaciones concedido')

      // ✅ Obtener token FCM
      try {
        this.token = await getToken(this.messaging, {
          vapidKey: firebaseConfig.vapidKey,
        })

        if (this.token) {
          console.log('✅ Token FCM obtenido')
          await this.registerDevice(this.token, 'web')
          return this.token
        }
        return null
      } catch (tokenError) {
        console.error('❌ Error al obtener token FCM:', tokenError)
        return null
      }
    } catch (error) {
      console.error('❌ Error general:', error)
      return null
    }
  }

  // ✅ Registrar dispositivo con nombre truncado
  async registerDevice(token, deviceType = 'web') {
    try {
      const deviceName = this.getDeviceName()

      const payload = {
        token: token,
        device_type: deviceType,
        device_name: deviceName,
      }

      console.log('📤 Registrando dispositivo:')
      console.log('  Token:', token.substring(0, 20) + '...')
      console.log('  Tipo:', deviceType)
      console.log('  Nombre:', deviceName)

      const response = await api.post('/v1/notifications/fcm/device/', payload)
      console.log('✅ Dispositivo registrado exitosamente')
      return response.data
    } catch (error) {
      console.error('❌ Error al registrar dispositivo:')
      console.error('  Status:', error.response?.status)
      console.error('  Data:', error.response?.data)
      return null
    }
  }

  // ✅ Desregistrar dispositivo
  async unregisterDevice(token) {
    try {
      await api.delete('/v1/notifications/fcm/device/', {
        data: { token: token },
      })
      console.log('✅ Dispositivo desregistrado')
      return true
    } catch (error) {
      console.warn('⚠️ Error al desregistrar dispositivo:', error)
      return false
    }
  }

  // ✅ Escuchar mensajes en primer plano
  onMessageReceived(callback) {
    if (!this.isSupported || !this.messaging) return

    try {
      onMessage(this.messaging, (payload) => {
        console.log('📨 Mensaje recibido en primer plano:', payload)
        callback(payload)
      })
    } catch (error) {
      console.warn('⚠️ Error al configurar onMessage:', error)
    }
  }

  getToken() {
    return this.token
  }
}

export default new FcmService()
