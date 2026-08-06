export default [
  {
    path: '/productos',
    name: 'ProductosList',
    component: () => import('./views/ProductosList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/productos/nuevo',
    name: 'ProductoCreate',
    component: () => import('./views/ProductoForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/productos/:id',
    name: 'ProductoDetail',
    component: () => import('./views/ProductoDetail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/productos/:id/editar',
    name: 'ProductoEdit',
    component: () => import('./views/ProductoForm.vue'),
    meta: { requiresAuth: true },
  },
];
