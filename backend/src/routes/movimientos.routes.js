const express = require('express');
const movimientosController = require('../controllers/movimientos.controller');

const router = express.Router();

router.get('/resumen/alertas', movimientosController.getAlertasYResumen);
router.get('/', movimientosController.getMovimientos);
router.get('/:id', movimientosController.getMovimientoById);
router.post('/', movimientosController.createMovimiento);
router.put('/:id', movimientosController.updateMovimiento);
router.patch('/:id', movimientosController.updateMovimiento);
router.delete('/:id', movimientosController.deleteMovimiento);

module.exports = router;