export default [
  {
    path: '/categorias',
    component: () => import('./views/CategoriasList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categorias/nueva',
    component: () => import('./views/CategoriaForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categorias/:id',
    component: () => import('./views/CategoriaDetail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categorias/:id/editar',
    component: () => import('./views/CategoriaForm.vue'),
    meta: { requiresAuth: true },
  },
]
