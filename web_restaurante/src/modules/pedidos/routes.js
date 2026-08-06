export default [
  {
    path: '/pedidos',
    name: 'PedidosList',
    component: () => import('./views/PedidosList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/pedidos/:id',
    name: 'PedidoDetail',
    component: () => import('./views/PedidoDetail.vue'),
    meta: { requiresAuth: true },
  },
];
