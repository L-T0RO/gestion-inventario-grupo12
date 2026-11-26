const INITIAL_USERS = [
  {
    id: 1,
    nombre: 'Máximo Martinez Moraes',
    email: 'admin@inventario.com',
    password: 'Admin123!',
    rol: 'ADMINISTRADOR',
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
    rol: 'OPERARIO',
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
    rol: 'VENDEDOR',
    cargo: 'Vendedor',
    legajo: '22850',
    activo: true,
    ultimoAcceso: '2026-11-25T18:10:00Z',
  },
];

let usersStore = [...INITIAL_USERS];

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sanitizeUser(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

export const authService = {
  login({ email, password }) {
    if (!email || !password) {
      throw createHttpError('Debe ingresar correo electrónico y contraseña.', 400);
    }

    const found = usersStore.find(
      (u) =>
        u.email.toLowerCase() === String(email).trim().toLowerCase() &&
        u.password === password
    );

    if (!found) {
      throw createHttpError('Credenciales inválidas. Verificá email y contraseña.', 401);
    }

    if (!found.activo) {
      throw createHttpError('El usuario se encuentra inactivo.', 403);
    }

    found.ultimoAcceso = new Date().toISOString();
    const safeUser = sanitizeUser(found);
    const token = `mock-jwt-user-${found.id}-${Date.now()}`;

    return {
      user: safeUser,
      token,
    };
  },

  register({ nombre, email, password, rol = 'OPERARIO' }) {
    if (!nombre || !email || !password) {
      throw createHttpError('Nombre, correo y contraseña son obligatorios.', 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const exists = usersStore.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      throw createHttpError('Ya existe un usuario registrado con ese correo.', 400);
    }

    const validRoles = ['ADMINISTRADOR', 'OPERARIO', 'VENDEDOR'];
    const assignedRole = validRoles.includes(rol) ? rol : 'OPERARIO';
    const cargoMap = {
      ADMINISTRADOR: 'Administrador / Gerente',
      OPERARIO: 'Operario / Depósito',
      VENDEDOR: 'Vendedor',
    };

    const newUser = {
      id: usersStore.length ? Math.max(...usersStore.map((u) => u.id)) + 1 : 1,
      nombre: String(nombre).trim(),
      email: normalizedEmail,
      password,
      rol: assignedRole,
      cargo: cargoMap[assignedRole],
      legajo: 'S/N',
      activo: true,
      ultimoAcceso: new Date().toISOString(),
    };

    usersStore = [...usersStore, newUser];
    return sanitizeUser(newUser);
  },

  forgotPassword({ email }) {
    if (!email) {
      throw createHttpError('Debe indicar un correo electrónico.', 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const exists = usersStore.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (!exists) {
      throw createHttpError('No se encontró una cuenta asociada a ese correo.', 404);
    }

    return { email: normalizedEmail };
  },

  updateProfile(id, { nombre, cargo }) {
    const index = usersStore.findIndex((u) => Number(u.id) === Number(id));
    if (index === -1) {
      throw createHttpError(`No se encontró el usuario con ID ${id}.`, 404);
    }

    usersStore[index] = {
      ...usersStore[index],
      nombre: nombre !== undefined && String(nombre).trim() ? String(nombre).trim() : usersStore[index].nombre,
      cargo: cargo !== undefined && String(cargo).trim() ? String(cargo).trim() : usersStore[index].cargo,
    };

    return sanitizeUser(usersStore[index]);
  },

  listUsers() {
    return usersStore.map(sanitizeUser);
  },

  updateUserAdmin(id, { rol, activo }) {
    const index = usersStore.findIndex((u) => Number(u.id) === Number(id));
    if (index === -1) {
      throw createHttpError(`No se encontró el usuario con ID ${id}.`, 404);
    }

    const cargoMap = {
      ADMINISTRADOR: 'Administrador / Gerente',
      OPERARIO: 'Operario / Depósito',
      VENDEDOR: 'Vendedor',
    };

    const nextRol = rol || usersStore[index].rol;
    usersStore[index] = {
      ...usersStore[index],
      rol: nextRol,
      cargo: rol ? cargoMap[nextRol] || usersStore[index].cargo : usersStore[index].cargo,
      activo: activo !== undefined ? Boolean(activo) : usersStore[index].activo,
    };

    return sanitizeUser(usersStore[index]);
  },
};