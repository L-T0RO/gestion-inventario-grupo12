import { MOVIMIENTOS_MOCK } from '../mocks/movimientos.mock';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true' || !API_BASE_URL;

let mockData = MOVIMIENTOS_MOCK.map((item) => ({ ...item }));
let nextMockId = mockData.length + 1;

function filtrarYOrdenarMock({ search = '', tipo = '', sortBy = 'id', order = 'asc', page = 1, limit = 10 }) {
let resultado = [...mockData];

if (search.trim()) {
    const term = search.trim().toLowerCase();
    resultado = resultado.filter(
    (m) =>
        m.productoNombre.toLowerCase().includes(term) ||
        m.usuarioNombre.toLowerCase().includes(term) ||
        (m.observacion || '').toLowerCase().includes(term)
    );
}

if (tipo.trim()) {
    resultado = resultado.filter((m) => m.tipo === tipo.toUpperCase());
}

const dir = order === 'desc' ? -1 : 1;
resultado.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * dir;
    }
    return String(valA ?? '').localeCompare(String(valB ?? ''), 'es') * dir;
});

const total = resultado.length;
const totalPages = Math.max(1, Math.ceil(total / limit));
  const inicio = (page - 1) * limit;
const items = resultado.slice(inicio, inicio + limit);

return {
    msg: 'Ok',
    code: 200,
    data: {
    items,
    pagination: { total, page, limit, totalPages },
    },
};
}

export async function getMovimientos(params = {}) {
if (USE_MOCKS) {
    return filtrarYOrdenarMock(params);
}

const query = new URLSearchParams();
Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
    query.append(key, value);
    }
});

const res = await fetch(`${API_BASE_URL}/api/v1/movimientos?${query.toString()}`);
return res.json();
}

export async function getMovimientoById(id) {
if (USE_MOCKS) {
    const encontrado = mockData.find((m) => m.id === Number(id)) || null;
    return { msg: encontrado ? 'Ok' : 'No encontrado', code: encontrado ? 200 : 404, data: encontrado };
}

const res = await fetch(`${API_BASE_URL}/api/v1/movimientos/${id}`);
return res.json();
}

export async function createMovimiento(payload) {
if (USE_MOCKS) {
    const nuevo = {
    ...payload,
    id: nextMockId++,
    productoId: Number(payload.productoId),
    cantidad: Number(payload.cantidad),
    usuarioId: Number(payload.usuarioId),
    fechaHora: payload.fechaHora || new Date().toISOString(),
    stockActual: payload.stockActual ?? 12,
    stockMinimo: payload.stockMinimo ?? 5,
    precioUnitario: payload.precioUnitario ?? 1500,
    };
    mockData.unshift(nuevo);
    return { msg: 'Movimiento registrado correctamente', code: 201, data: nuevo };
}

const res = await fetch(`${API_BASE_URL}/api/v1/movimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
});
return res.json();
}

export async function updateMovimiento(id, payload) {
if (USE_MOCKS) {
    const idx = mockData.findIndex((m) => m.id === Number(id));
    if (idx === -1) return { msg: 'No encontrado', code: 404, data: null };
    mockData[idx] = { ...mockData[idx], ...payload };
    return { msg: 'Movimiento actualizado correctamente', code: 200, data: mockData[idx] };
}

const res = await fetch(`${API_BASE_URL}/api/v1/movimientos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
});
return res.json();
}

export async function deleteMovimiento(id) {
if (USE_MOCKS) {
    mockData = mockData.filter((m) => m.id !== Number(id));
    return { msg: 'Movimiento eliminado correctamente', code: 200, data: { id: Number(id) } };
}

const res = await fetch(`${API_BASE_URL}/api/v1/movimientos/${id}`, {
    method: 'DELETE',
});
return res.json();
}

export async function getResumenAlertas() {
if (USE_MOCKS) {
    const alertasStockBajo = mockData.filter((m) => m.stockActual <= m.stockMinimo);
    const totalIngresos = mockData
    .filter((m) => m.tipo === 'INGRESO')
    .reduce((acc, m) => acc + Number(m.cantidad), 0);
    const totalEgresos = mockData
    .filter((m) => m.tipo === 'EGRESO')
    .reduce((acc, m) => acc + Number(m.cantidad), 0);
    const valorizacionTotal = mockData.reduce(
      (acc, m) => acc + Number(m.stockActual || 0) * Number(m.precioUnitario || 0),
    0
    );

    return {
    msg: 'Ok',
    code: 200,
    data: {
        totalMovimientos: mockData.length,
        totalIngresos,
        totalEgresos,
        valorizacionTotal,
        alertasStockBajo,
        ultimosMovimientos: mockData.slice(0, 5),
    },
    };
}

const res = await fetch(`${API_BASE_URL}/api/v1/movimientos/resumen/alertas`);
return res.json();
}