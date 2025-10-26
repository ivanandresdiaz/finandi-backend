import { Roles } from './roles.enum';

export const NIVEL_PERMISOS: Record<Roles, Roles[]> = {
  [Roles.ADMIN]: [
    Roles.POTENCIAL,
    Roles.CLIENTE,
    Roles.EJECUTIVO,
    Roles.LIDER,
    Roles.ADMIN,
  ],
  [Roles.LIDER]: [Roles.POTENCIAL, Roles.CLIENTE, Roles.EJECUTIVO, Roles.LIDER],
  [Roles.EJECUTIVO]: [Roles.POTENCIAL, Roles.CLIENTE, Roles.EJECUTIVO],
  [Roles.CLIENTE_DESTACADO]: [
    Roles.POTENCIAL,
    Roles.CLIENTE,
    Roles.CLIENTE_DESTACADO,
  ],
  [Roles.CLIENTE]: [Roles.POTENCIAL, Roles.CLIENTE],
  [Roles.POTENCIAL]: [Roles.POTENCIAL],
};
