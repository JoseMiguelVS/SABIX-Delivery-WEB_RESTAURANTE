export const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'HomeIcon',
    route: '/',
    active: true,
  },
  {
    id: 'categorias',
    title: 'Categorías',
    icon: 'CategoriesIcon',
    route: '/categorias',
    active: true,
  },
  {
    id: 'productos',
    title: 'Productos',
    icon: 'ProductsIcon',
    route: '/productos',
    active: true,
  },
   {
    id: 'notificaciones',
    title: 'Notificaciones',
    icon: 'NotificationsIcon',
    route: '/notificaciones',
    active: true,
  },
  {
    id: 'pedidos',
    title: 'Pedidos',
    icon: 'OrdersIcon',
    route: '/pedidos',
    active: true,
  },
  // {
  //   id: 'reportes',
  //   title: 'Reportes',
  //   icon: 'ReportsIcon',
  //   route: '/reportes',
  //   active: true,
  // },
];

export const getMenuItems = () => {
  return menuItems.filter(item => item.active);
};
