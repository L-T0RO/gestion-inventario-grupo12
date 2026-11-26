const movimientosIniciales = [
{
    id: 1,
    productoId: 101,
    productoNombre: 'Yerba Mate Canarias 1kg',
    tipo: 'INGRESO',
    cantidad: 25,
    usuarioId: 1,
    usuarioNombre: 'Lucas Rojas',
    fechaHora: '2026-11-25T10:15:00.000Z',
    observacion: 'Recepción de compra proveedor principal',
    stockActual: 35,
    stockMinimo: 10,
    precioUnitario: 4800,
},
{
    id: 2,
    productoId: 102,
    productoNombre: 'Café Molido Origen 500g',
    tipo: 'EGRESO',
    cantidad: 12,
    usuarioId: 2,
    usuarioNombre: 'Máximo Martinez Moraes',
    fechaHora: '2026-11-25T14:40:00.000Z',
    observacion: 'Despacho a salón de ventas',
    stockActual: 6,
    stockMinimo: 10,
    precioUnitario: 6200,
},
{
    id: 3,
    productoId: 103,
    productoNombre: 'Filtro Papel N° 4 x100',
    tipo: 'EGRESO',
    cantidad: 8,
    usuarioId: 3,
    usuarioNombre: 'Tiago de Rosa Cajarabilla',
    fechaHora: '2026-11-26T09:05:00.000Z',
    observacion: 'Salida por pedido mostrador',
    stockActual: 4,
    stockMinimo: 8,
    precioUnitario: 2100,
},
];

let movimientosStore = movimientosIniciales.map((item) => ({ ...item }));
let nextId = movimientosStore.length + 1;

function findAll({ search = '', tipo = '', productoId = '', sortBy = 'id', order = 'asc', page = 1, limit = 10 }) {
let filtrados = [...movimientosStore];

if (search && String(search).trim() !== '') {
    const term = String(search).trim().toLowerCase();
    filtrados = filtrados.filter(
    (m) =>
        String(m.productoNombre || '').toLowerCase().includes(term) ||
        String(m.usuarioNombre || '').toLowerCase().includes(term) ||
        String(m.observacion || '').toLowerCase().includes(term) ||
        String(m.tipo || '').toLowerCase().includes(term)
    );
}

if (tipo && String(tipo).trim() !== '') {
    const tipoUpper = String(tipo).trim().toUpperCase();
    filtrados = filtrados.filter((m) => String(m.tipo).toUpperCase() === tipoUpper);
}

if (productoId !== '' && productoId !== undefined && productoId !== null) {
    const prodNum = Number(productoId);
    if (!Number.isNaN(prodNum)) {
    filtrados = filtrados.filter((m) => Number(m.productoId) === prodNum);
    }
}

const validSortFields = ['id', 'productoId', 'productoNombre', 'tipo', 'cantidad', 'usuarioId', 'fechaHora'];
const campoOrden = validSortFields.includes(sortBy) ? sortBy : 'id';
const direccion = String(order).toLowerCase() === 'desc' ? -1 : 1;

filtrados.sort((a, b) => {
    const valA = a[campoOrden];
    const valB = b[campoOrden];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * direccion;
    }

    return String(valA ?? '').localeCompare(String(valB ?? ''), 'es', { sensitivity: 'base' }) * direccion;
});

const total = filtrados.length;
const pageNum = Math.max(1, Number(page) || 1);
const limitNum = Math.max(1, Number(limit) || 10);
const totalPages = Math.max(1, Math.ceil(total / limitNum));
  const inicio = (pageNum - 1) * limitNum;
const items = filtrados.slice(inicio, inicio + limitNum);

return {
    items,
    pagination: {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    },
};
}

function findById(id) {
const numId = Number(id);
if (Number.isNaN(numId)) return null;
return movimientosStore.find((m) => Number(m.id) === numId) || null;
}

function create(data) {
const nuevoMovimiento = {
    id: nextId++,
    productoId: Number(data.productoId),
    productoNombre: String(data.productoNombre || `Producto #${data.productoId}`).trim(),
    tipo: String(data.tipo).toUpperCase(),
    cantidad: Number(data.cantidad),
    usuarioId: Number(data.usuarioId),
    usuarioNombre: String(data.usuarioNombre || `Usuario #${data.usuarioId}`).trim(),
    fechaHora: data.fechaHora ? new Date(data.fechaHora).toISOString() : new Date().toISOString(),
    observacion: String(data.observacion || '').trim(),
    stockActual: data.stockActual !== undefined ? Number(data.stockActual) : 15,
    stockMinimo: data.stockMinimo !== undefined ? Number(data.stockMinimo) : 5,
    precioUnitario: data.precioUnitario !== undefined ? Number(data.precioUnitario) : 1000,
};

movimientosStore.push(nuevoMovimiento);
return { ...nuevoMovimiento };
}

function update(id, data) {
const numId = Number(id);
const index = movimientosStore.findIndex((m) => Number(m.id) === numId);
if (index === -1) return null;

const actual = movimientosStore[index];
const actualizado = {
    ...actual,
    ...(data.productoId !== undefined ? { productoId: Number(data.productoId) } : {}),
    ...(data.productoNombre !== undefined ? { productoNombre: String(data.productoNombre).trim() } : {}),
    ...(data.tipo !== undefined ? { tipo: String(data.tipo).toUpperCase() } : {}),
    ...(data.cantidad !== undefined ? { cantidad: Number(data.cantidad) } : {}),
    ...(data.usuarioId !== undefined ? { usuarioId: Number(data.usuarioId) } : {}),
    ...(data.usuarioNombre !== undefined ? { usuarioNombre: String(data.usuarioNombre).trim() } : {}),
    ...(data.fechaHora !== undefined ? { fechaHora: new Date(data.fechaHora).toISOString() } : {}),
    ...(data.observacion !== undefined ? { observacion: String(data.observacion).trim() } : {}),
};

movimientosStore[index] = actualizado;
return { ...actualizado };
}

function remove(id) {
const numId = Number(id);
const index = movimientosStore.findIndex((m) => Number(m.id) === numId);
if (index === -1) return false;

movimientosStore.splice(index, 1);
return true;
}

function getAllRaw() {
return movimientosStore.map((m) => ({ ...m }));
}

module.exports = {
findAll,
findById,
create,
update,
remove,
getAllRaw,
};