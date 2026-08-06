export default [
  {
    path: '/notificaciones',
    name: 'NotificacionesList',
    component: () => import('./views/NotificacionesList.vue'),
    meta: { requiresAuth: true },
  },
];
