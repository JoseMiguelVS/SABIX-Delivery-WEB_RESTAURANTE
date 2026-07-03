export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

export const getAvatarColor = (name) => {
  const colors = ['var(--primary-900)', 'var(--primary-700)', 'var(--primary-500)', 'var(--primary-300)'];
  return colors[name ? name.length % colors.length : 0];
};

export const getRoleLabel = (role) => {
  const labels = { admin: 'Administrador', user: 'Usuario', editor: 'Editor' };
  return labels[role] || role;
};

export const getStatusLabel = (status) => {
  const labels = { active: 'Activo', inactive: 'Inactivo' };
  return labels[status] || status;
};

export const formatDate = (date) => {
  if (!date) return '---';
  return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateFull = (date) => {
  if (!date) return '---';
  return new Date(date).toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};