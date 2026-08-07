import { h } from 'vue'

// ============================================
// ICONOS DEL SIDEBAR
// ============================================

// Home
export const HomeIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
        h('polyline', { points: '9 22 9 12 15 12 15 22' }),
      ],
    )
  },
}

// Dashboard
export const DashboardIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('rect', { x: '3', y: '3', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '14', y: '3', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '3', y: '14', width: '7', height: '7', rx: '1' }),
        h('rect', { x: '14', y: '14', width: '7', height: '7', rx: '1' }),
      ],
    )
  },
}

// Pedidos / Orders
export const OrdersIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('polygon', { points: '23 7 16 12 23 17 23 7' }),
        h('rect', { x: '1', y: '5', width: '15', height: '14', rx: '2', ry: '2' }),
      ],
    )
  },
}

// Productos
export const ProductsIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' }),
        h('line', { x1: '3', y1: '6', x2: '21', y2: '6' }),
        h('path', { d: 'M16 10a4 4 0 0 1-8 0' }),
      ],
    )
  },
}

// Categorías
export const CategoriesIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M12 2v4' }),
        h('path', { d: 'M12 18v4' }),
        h('path', { d: 'M4 4l2 2' }),
        h('path', { d: 'M18 18l2 2' }),
        h('path', { d: 'M4 20l2-2' }),
        h('path', { d: 'M18 6l2-2' }),
        h('path', { d: 'M2 12h4' }),
        h('path', { d: 'M18 12h4' }),
        h('circle', { cx: '12', cy: '12', r: '3' }),
      ],
    )
  },
}

// Repartidores / Delivery
export const DeliveryIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
        h('circle', { cx: '9', cy: '7', r: '4' }),
        h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
        h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
      ],
    )
  },
}

// Notificaciones
export const NotificationsIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokelinejoin: 'round',
      },
      [
        h('path', { d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' }),
        h('path', { d: 'M13.73 21a2 2 0 0 1-3.46 0' }),
      ],
    )
  },
}

// Usuarios
export const UsersIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
        h('circle', { cx: '9', cy: '7', r: '4' }),
        h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
        h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }),
      ],
    )
  },
}

// Integraciones
export const IntegrationsIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('polygon', { points: '12 2 2 7 12 12 22 7 12 2' }),
        h('polyline', { points: '2 12 12 17 22 12' }),
        h('polyline', { points: '2 17 12 22 22 17' }),
      ],
    )
  },
}

// Configuración
export const SettingsIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('circle', { cx: '12', cy: '12', r: '3' }),
        h('path', {
          d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
        }),
      ],
    )
  },
}

// Reportes
export const ReportsIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '1.5',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M21 12v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3' }),
        h('path', { d: 'M21 6v3h-3' }),
        h('path', { d: 'M21 3l-9 9' }),
        h('path', { d: 'M12 12l-3 3' }),
      ],
    )
  },
}

// ============================================
// ICONOS DE ACCIONES (CRUD)
// ============================================

// Add / Crear
export const AddIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('line', { x1: '12', y1: '8', x2: '12', y2: '16' }),
        h('line', { x1: '8', y1: '12', x2: '16', y2: '12' }),
      ],
    )
  },
}

// Edit / Editar
export const EditIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M12 20h9' }),
        h('path', { d: 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' }),
      ],
    )
  },
}

// Delete / Eliminar
export const DeleteIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M3 6h18' }),
        h('path', {
          d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
        }),
      ],
    )
  },
}

// View / Ver
export const ViewIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' }),
        h('circle', { cx: '12', cy: '12', r: '3' }),
      ],
    )
  },
}

// ============================================
// ICONOS DE ACCIONES ADICIONALES
// ============================================

// Close / Cerrar
export const CloseIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
        h('line', { x1: '6', y1: '6', x2: '18', y2: '18' }),
      ],
    )
  },
}

// Search / Buscar
export const SearchIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('circle', { cx: '11', cy: '11', r: '8' }),
        h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' }),
      ],
    )
  },
}

// Filter / Filtrar
export const FilterIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [h('polygon', { points: '22 3 2 3 10 13 10 21 14 18 14 13 22 3' })],
    )
  },
}

// Refresh / Recargar
export const RefreshIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M23 4v6h-6' }),
        h('path', { d: 'M1 20v-6h6' }),
        h('path', { d: 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10' }),
        h('path', { d: 'M20.49 15a9 9 0 0 1-14.85 3.36L1 14' }),
      ],
    )
  },
}

// Logout / Cerrar Sesión
export const LogoutIcon = {
  render() {
    return h(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      [
        h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
        h('polyline', { points: '16 17 21 12 16 7' }),
        h('line', { x1: '21', y1: '12', x2: '9', y2: '12' }),
      ],
    )
  },
}

// ============================================
// MAPA DE ICONOS
// ============================================

export const Icons = {
  // Sidebar
  HomeIcon,
  DashboardIcon,
  OrdersIcon,
  ProductsIcon,
  CategoriesIcon,
  DeliveryIcon,
  NotificationsIcon,
  UsersIcon,
  IntegrationsIcon,
  SettingsIcon,
  ReportsIcon,

  // Actions
  AddIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  CloseIcon,
  SearchIcon,
  FilterIcon,
  RefreshIcon,
  LogoutIcon,
}

// Función para obtener icono por nombre
export const getIcon = (iconName) => {
  return Icons[iconName] || Icons.HomeIcon
}
