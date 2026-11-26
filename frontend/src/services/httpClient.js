const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const IS_MOCK_MODE =
  String(import.meta.env.VITE_USE_MOCK ?? 'true').toLowerCase() === 'true';

export async function httpRequest(endpoint, options = {}) {
  const token = localStorage.getItem('inv_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = {
      msg: response.statusText || 'Error de comunicación con el servidor',
      code: response.status,
      data: null,
    };
  }

  if (!response.ok || (payload.code && payload.code >= 400)) {
    const error = new Error(payload.msg || 'Error inesperado en la solicitud');
    error.code = payload.code || response.status;
    error.data = payload.data || null;
    throw error;
  }

  return payload;
}