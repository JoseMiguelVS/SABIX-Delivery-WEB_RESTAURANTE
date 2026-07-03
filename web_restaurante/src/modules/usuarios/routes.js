export default [
  {
    path: '/usuarios',
    component: () => import('./views/UserList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios/:id',
    component: () => import('./views/UserDetail.vue'),
    meta: { requiresAuth: true }
  }
];