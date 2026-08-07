// Importar Firebase
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js')

// Configuración de Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBOcr3mc_pO2GTpE9v-XxbozT56aqEhtiM',
  authDomain: 'sabixdelivery.firebaseapp.com',
  projectId: 'sabixdelivery',
  storageBucket: 'sabixdelivery.firebasestorage.app',
  messagingSenderId: '1097443656390',
  appId: '1:1097443656390:web:69bbcbfff3c10e1dd08dc7',
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

// ✅ Manejar mensajes en segundo plano (cuando la app está cerrada)
messaging.onBackgroundMessage((payload) => {
  console.log('📨 Mensaje en segundo plano:', payload)

  const notificationTitle = payload.notification?.title || 'Nueva notificación'
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/favicon.ico',
    data: payload.data || {},
    badge: '/favicon.ico',
    tag: 'notification',
    requireInteraction: true,
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// ✅ Eventos del Service Worker
self.addEventListener('install', (event) => {
  console.log('✅ Service Worker instalado')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activado')
  event.waitUntil(clients.claim())
})

// ✅ Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('📨 Click en notificación:', event)
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
      return null
    }),
  )
})

// ✅ Manejar mensajes push (fallback)
self.addEventListener('push', (event) => {
  console.log('📨 Evento push recibido:', event)

  let data = {}
  if (event.data) {
    try {
      data = event.data.json()
      console.log('📦 Datos del push:', data)
    } catch (e) {
      console.log('📦 Datos del push (texto):', event.data.text())
    }
  }

  const title = data.notification?.title || data.title || 'Nueva notificación'
  const options = {
    body: data.notification?.body || data.body || '',
    icon: data.notification?.icon || '/favicon.ico',
    data: data.data || {},
    badge: '/favicon.ico',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
