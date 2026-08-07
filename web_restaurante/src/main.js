import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

//  Importar FCM
import { useFcm } from '@/composables/useFcm'
import { useAuthStore } from '@/stores/authStore'  //  Importar correctamente

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

//  Montar la app
app.mount('#app')

//  Inicializar notificaciones push después de montar
// Usar setTimeout para asegurar que todo está cargado
setTimeout(() => {
  try {
    const fcm = useFcm()
    fcm.initialize()

    // Si el usuario está autenticado, suscribirse automáticamente
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) {
      fcm.subscribe()
    }
  } catch (error) {
    }
}, 1000)
