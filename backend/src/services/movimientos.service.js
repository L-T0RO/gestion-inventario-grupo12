const movimientosRepository = require('../repositories/movimientos.repository');

const TIPOS_VALIDOS = ['INGRESO', 'EGRESO'];

function listarMovimientos(query = {}) {
const {
    search = '',
    tipo = '',
    productoId = '',
    sortBy = 'id',
    order = 'asc',
    page = 1,
    limit = 10,
} = query;

return movimientosRepository.findAll({
    search,
    tipo,
    productoId,
    sortBy,
    order,
    page,
    limit,
});
}

function obtenerMovimientoPorId(id) {
const numericId = Number(id);
if (!Number.isInteger(numericId) || numericId <= 0) {
    const error = new Error('El ID del movimiento debe ser un número entero positivo');
    error.statusCode = 400;
    throw error;
}

const movimiento = movimientosRepository.findById(numericId);
if (!movimiento) {
    const error = new Error(`No se encontró el movimiento con ID ${numericId}`);
    error.statusCode = 404;
    throw error;
}

return movimiento;
}

function validarPayloadCreacion(payload = {}) {
const errores = [];

if (payload.productoId === undefined || payload.productoId === null || Number.isNaN(Number(payload.productoId))) {
    errores.push('productoId es obligatorio y debe ser numérico');
}

const tipoNormalizado = String(payload.tipo || '').trim().toUpperCase();
if (!TIPOS_VALIDOS.includes(tipoNormalizado)) {
    errores.push('tipo debe ser INGRESO o EGRESO');
}

const cantidadNum = Number(payload.cantidad);
if (payload.cantidad === undefined || payload.cantidad === null || Number.isNaN(cantidadNum) || cantidadNum <= 0) {
    errores.push('cantidad es obligatoria y debe ser mayor a 0');
}

if (payload.usuarioId === undefined || payload.usuarioId === null || Number.isNaN(Number(payload.usuarioId))) {
    errores.push('usuarioId es obligatorio y debe ser numérico');
}

if (payload.fechaHora !== undefined && payload.fechaHora !== null && String(payload.fechaHora).trim() !== '') {
    const fechaParseada = Date.parse(payload.fechaHora);
    if (Number.isNaN(fechaParseada)) {
    errores.push('fechaHora no tiene un formato de fecha válido');
    }
}

if (errores.length > 0) {
    const error = new Error(errores.join('; '));
    error.statusCode = 400;
    throw error;
}
}

function validarPayloadActualizacion(payload = {}) {
const errores = [];

if (payload.productoId !== undefined && Number.isNaN(Number(payload.productoId))) {
    errores.push('productoId debe ser numérico');
}

if (payload.tipo !== undefined) {
    const tipoNormalizado = String(payload.tipo).trim().toUpperCase();
    if (!TIPOS_VALIDOS.includes(tipoNormalizado)) {
    errores.push('tipo debe ser INGRESO o EGRESO');
    }
}

if (payload.cantidad !== undefined) {
    const cantidadNum = Number(payload.cantidad);
    if (Number.isNaN(cantidadNum) || cantidadNum <= 0) {
    errores.push('cantidad debe ser mayor a 0');
    }
}

if (payload.usuarioId !== undefined && Number.isNaN(Number(payload.usuarioId))) {
    errores.push('usuarioId debe ser numérico');
}

if (payload.fechaHora !== undefined && payload.fechaHora !== null && String(payload.fechaHora).trim() !== '') {
    const fechaParseada = Date.parse(payload.fechaHora);
    if (Number.isNaN(fechaParseada)) {
    errores.push('fechaHora no tiene un formato de fecha válido');
    }
}

if (errores.length > 0) {
    const error = new Error(errores.join('; '));
    error.statusCode = 400;
    throw error;
}
}

function crearMovimiento(payload) {
validarPayloadCreacion(payload);
return movimientosRepository.create(payload);
}

function actualizarMovimiento(id, payload) {
const numericId = Number(id);
if (!Number.isInteger(numericId) || numericId <= 0) {
    const error = new Error('El ID del movimiento debe ser un número entero positivo');
    error.statusCode = 400;
    throw error;
}

validarPayloadActualizacion(payload);

const actualizado = movimientosRepository.update(numericId, payload);
if (!actualizado) {
    const error = new Error(`No se encontró el movimiento con ID ${numericId}`);
    error.statusCode = 404;
    throw error;
}

return actualizado;
}

function eliminarMovimiento(id) {
const numericId = Number(id);
if (!Number.isInteger(numericId) || numericId <= 0) {
    const error = new Error('El ID del movimiento debe ser un número entero positivo');
    error.statusCode = 400;
    throw error;
}

const eliminado = movimientosRepository.remove(numericId);
if (!eliminado) {
    const error = new Error(`No se encontró el movimiento con ID ${numericId}`);
    error.statusCode = 404;
    throw error;
}

return { id: numericId, eliminado: true };
}

function obtenerAlertasYResumen() {
const todos = movimientosRepository.getAllRaw();

const porProducto = new Map();
let totalIngresos = 0;
let totalEgresos = 0;

for (const mov of todos) {
    if (mov.tipo === 'INGRESO') totalIngresos += Number(mov.cantidad) || 0;
    if (mov.tipo === 'EGRESO') totalEgresos += Number(mov.cantidad) || 0;

    porProducto.set(mov.productoId, {
    productoId: mov.productoId,
    productoNombre: mov.productoNombre,
    stockActual: Number(mov.stockActual ?? 0),
    stockMinimo: Number(mov.stockMinimo ?? 0),
    precioUnitario: Number(mov.precioUnitario ?? 0),
      valorizacionEstimada: Number(mov.stockActual ?? 0) * Number(mov.precioUnitario ?? 0),
    });
}

const alertasStockBajo = Array.from(porProducto.values()).filter(
    (item) => item.stockActual <= item.stockMinimo
);

const valorizacionTotal = Array.from(porProducto.values()).reduce(
    (acc, item) => acc + item.valorizacionEstimada,
    0
);

return {
    totalMovimientos: todos.length,
    totalIngresos,
    totalEgresos,
    valorizacionTotal,
    alertasStockBajo,
    ultimosMovimientos: [...todos].slice(-5).reverse(),
};
}

module.exports = {
listarMovimientos,
obtenerMovimientoPorId,
crearMovimiento,
actualizarMovimiento,
eliminarMovimiento,
obtenerAlertasYResumen,
};