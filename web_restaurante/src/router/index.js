import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import usuariosRoutes from '@/modules/usuarios/routes'
import categoriasRoutes from '@/modules/categorias/routes'
import productosRoutes from '@/modules/productos/routes'
import pedidosRoutes from '@/modules/pedidos/routes'
import notificacionesRoutes from '@/modules/notificaciones/routes';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { guest: true },
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: () => import('@/views/CategoriasPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/productos',
    name: 'Productos',
    component: () => import('@/views/ProductosPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: () => import('@/views/PedidosPage.vue'),
    meta: { requiresAuth: true },
  },

  // Módulo de usuarios
  ...usuariosRoutes,
  // Módulo de categorías (CRUD completo)
  ...categoriasRoutes,
  //Modulo de productos (CRUD completo)
  ...productosRoutes,
  // Módulo de pedidos (Notificaciones)
  ...pedidosRoutes,
  // Módulo de notificaciones
  ...notificacionesRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Si la ruta requiere autenticación y no está autenticado, redirigir a login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  // Si la ruta es para invitados (login/register) y está autenticado, redirigir a home
  if (to.meta.guest && isAuthenticated) {
    return '/'
  }
})

export default router
