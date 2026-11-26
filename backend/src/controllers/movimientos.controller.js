const movimientosService = require('../services/movimientos.service');

function sendResponse(res, statusCode, msg, data = null) {
return res.status(statusCode).json({
    msg,
    code: statusCode,
    data,
});
}

function handleError(res, err) {
const statusCode = err.statusCode || 500;
const msg = statusCode === 500 ? 'Error interno del servidor' : err.message;
return sendResponse(res, statusCode, msg, null);
}

function getMovimientos(req, res) {
try {
    const resultado = movimientosService.listarMovimientos(req.query);
    return sendResponse(res, 200, 'Ok', resultado);
} catch (err) {
    return handleError(res, err);
}
}

function getMovimientoById(req, res) {
try {
    const movimiento = movimientosService.obtenerMovimientoPorId(req.params.id);
    return sendResponse(res, 200, 'Ok', movimiento);
} catch (err) {
    return handleError(res, err);
}
}

function getAlertasYResumen(req, res) {
try {
    const resumen = movimientosService.obtenerAlertasYResumen();
    return sendResponse(res, 200, 'Ok', resumen);
} catch (err) {
    return handleError(res, err);
}
}

function createMovimiento(req, res) {
try {
    const creado = movimientosService.crearMovimiento(req.body);
    return sendResponse(res, 201, 'Movimiento registrado correctamente', creado);
} catch (err) {
    return handleError(res, err);
}
}

function updateMovimiento(req, res) {
try {
    const actualizado = movimientosService.actualizarMovimiento(req.params.id, req.body);
    return sendResponse(res, 200, 'Movimiento actualizado correctamente', actualizado);
} catch (err) {
    return handleError(res, err);
}
}

function deleteMovimiento(req, res) {
try {
    const eliminado = movimientosService.eliminarMovimiento(req.params.id);
    return sendResponse(res, 200, 'Movimiento eliminado correctamente', eliminado);
} catch (err) {
    return handleError(res, err);
}
}

module.exports = {
getMovimientos,
getMovimientoById,
getAlertasYResumen,
createMovimiento,
updateMovimiento,
deleteMovimiento,
};