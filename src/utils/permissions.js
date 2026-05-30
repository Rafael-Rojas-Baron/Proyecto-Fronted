export const ROLES = {
  ADMIN: 'admin',
  EMPLEADO: 'empleado',
  CLIENTE: 'cliente',
  PUBLICO: 'publico',
};

export function getRole(user) {
  return user?.rol ?? ROLES.PUBLICO;
}

export function canManageIngredientes(role) {
  return role === ROLES.ADMIN || role === ROLES.EMPLEADO;
}

export function canSeeRentabilidad(role) {
  return role === ROLES.ADMIN;
}

export function canSell(role) {
  return [ROLES.ADMIN, ROLES.EMPLEADO, ROLES.CLIENTE].includes(role);
}

export function canSeeCalorias(role) {
  return role !== ROLES.PUBLICO;
}

export function canSeeCostos(role) {
  return role === ROLES.ADMIN || role === ROLES.EMPLEADO;
}

export function canSeeVentasPanel(role) {
  return role === ROLES.ADMIN || role === ROLES.EMPLEADO;
}
