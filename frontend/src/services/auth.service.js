import { USUARIOS_MOCK } from '../mocks/usuarios.mock';
import { createApiResponse, ROLES } from '../types/api.types';
import { httpRequest, IS_MOCK_MODE } from './httpClient';

const STORAGE_USER_KEY = 'inv_current_user';
const STORAGE_TOKEN_KEY = 'inv_token';
const STORAGE_USERS_LIST_KEY = 'inv_mock_users';

function getMockUsersStore() {
  const saved = localStorage.getItem(STORAGE_USERS_LIST_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...USUARIOS_MOCK];
    }
  }
  localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(USUARIOS_MOCK));
  return [...USUARIOS_MOCK];
}

function saveMockUsersStore(users) {
  localStorage.setItem(STORAGE_USERS_LIST_KEY, JSON.stringify(users));
}

function sanitizeUser(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

export const authService = {
  async login({ email, password }) {
    if (!IS_MOCK_MODE) {
      const res = await httpRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.data?.user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.data.user));
        localStorage.setItem(STORAGE_TOKEN_KEY, res.data.token || 'api-token');
      }
      return res;
    }

    const users = getMockUsersStore();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === String(email).trim().toLowerCase() &&
        u.password === password
    );

    if (!found) {
      const err = new Error('Credenciales inválidas. Verificá email y contraseña.');
      err.code = 401;
      throw err;
    }

    if (!found.activo) {
      const err = new Error('El usuario se encuentra inactivo.');
      err.code = 403;
      throw err;
    }

    const safeUser = sanitizeUser(found);
    const mockToken = `mock-jwt-user-${found.id}-${Date.now()}`;
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem(STORAGE_TOKEN_KEY, mockToken);

    return createApiResponse({
      msg: 'Inicio de sesión exitoso',
      code: 200,
      data: { user: safeUser, token: mockToken },
    });
  },

  async register({ nombre, email, password, rol = ROLES.OPERARIO }) {
    if (!IS_MOCK_MODE) {
      return httpRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password, rol }),
      });
    }

    const users = getMockUsersStore();
    const exists = users.some(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
    );

    if (exists) {
      const err = new Error('Ya existe un usuario registrado con ese correo.');
      err.code = 400;
      throw err;
    }

    const newUser = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password,
      rol,
      cargo:
        rol === ROLES.ADMIN
          ? 'Administrador / Gerente'
          : rol === ROLES.VENDEDOR
          ? 'Vendedor'
          : 'Operario / Depósito',
      legajo: 'S/N',
      activo: true,
      ultimoAcceso: new Date().toISOString(),
    };

    const updated = [...users, newUser];
    saveMockUsersStore(updated);

    return createApiResponse({
      msg: 'Usuario registrado correctamente (simulación prototipo)',
      code: 201,
      data: sanitizeUser(newUser),
    });
  },

  async forgotPassword({ email }) {
    if (!IS_MOCK_MODE) {
      return httpRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    }

    const users = getMockUsersStore();
    const exists = users.some(
      (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
    );

    if (!exists) {
      const err = new Error('No se encontró una cuenta asociada a ese correo.');
      err.code = 404;
      throw err;
    }

    return createApiResponse({
      msg: 'Se enviaron las instrucciones de recuperación de contraseña al correo indicado.',
      code: 200,
      data: { email },
    });
  },

  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async updateProfile(updates) {
    const current = this.getCurrentUser();
    if (!current) {
      const err = new Error('No hay sesión activa.');
      err.code = 401;
      throw err;
    }

    if (!IS_MOCK_MODE) {
      return httpRequest(`/auth/profile/${current.id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    }

    const users = getMockUsersStore();
    const updatedUsers = users.map((u) =>
      u.id === current.id
        ? {
            ...u,
            nombre: updates.nombre?.trim() || u.nombre,
            cargo: updates.cargo?.trim() || u.cargo,
          }
        : u
    );
    saveMockUsersStore(updatedUsers);

    const updatedCurrent = sanitizeUser(
      updatedUsers.find((u) => u.id === current.id)
    );
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedCurrent));

    return createApiResponse({
      msg: 'Perfil actualizado correctamente',
      code: 200,
      data: updatedCurrent,
    });
  },

  listUsersMock() {
    return getMockUsersStore().map(sanitizeUser);
  },

  updateUserRoleOrStatusMock(userId, changes) {
    const users = getMockUsersStore();
    const updated = users.map((u) =>
      u.id === userId ? { ...u, ...changes } : u
    );
    saveMockUsersStore(updated);
    return updated.map(sanitizeUser);
  },

  logout() {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  },
};