import { ROLES } from '../types/api.types';

export const USUARIOS_MOCK = [
  {
    id: 1,
    nombre: 'Maximo Martinez Moraes',
    email: 'admin@inventario.com',
    password: 'Admin123!',
    rol: ROLES.ADMIN,
    cargo: 'Administrador / Gerente',
    legajo: '22331',
    activo: true,
    ultimoAcceso: '2026-11-26T09:15:00Z',
  },
  {
    id: 2,
    nombre: 'Lucas Rojas',
    email: 'operario@inventario.com',
    password: 'Operario123!',
    rol: ROLES.OPERARIO,
    cargo: 'Operario / Depósito',
    legajo: '22269',
    activo: true,
    ultimoAcceso: '2026-11-26T08:40:00Z',
  },
  {
    id: 3,
    nombre: 'Tiago de Rosa Cajarabilla',
    email: 'vendedor@inventario.com',
    password: 'Vendedor123!',
    rol: ROLES.VENDEDOR,
    cargo: 'Vendedor',
    legajo: '22850',
    activo: true,
    ultimoAcceso: '2026-11-25T18:10:00Z',
  },
];