import { useEffect, useState } from 'react';
import { MOVIMIENTO_INITIAL_FORM } from '../../types/movimiento.types';

export default function MovimientoRegistroForm({
movimientoSeleccionado = null,
onSubmit,
onCancel,
onDelete,
}) {
const [form, setForm] = useState(MOVIMIENTO_INITIAL_FORM);

useEffect(() => {
    if (movimientoSeleccionado) {
    setForm({
        productoId: movimientoSeleccionado.productoId ?? '',
        productoNombre: movimientoSeleccionado.productoNombre ?? '',
        tipo: movimientoSeleccionado.tipo ?? 'INGRESO',
        cantidad: movimientoSeleccionado.cantidad ?? 1,
        usuarioId: movimientoSeleccionado.usuarioId ?? 3,
        usuarioNombre: movimientoSeleccionado.usuarioNombre ?? 'Tiago de Rosa Cajarabilla',
        fechaHora: movimientoSeleccionado.fechaHora
        ? new Date(movimientoSeleccionado.fechaHora).toISOString().slice(0, 16)
        : '',
        observacion: movimientoSeleccionado.observacion ?? '',
    });
    } else {
    setForm(MOVIMIENTO_INITIAL_FORM);
    }
}, [movimientoSeleccionado]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
    ...form,
    productoId: Number(form.productoId),
    cantidad: Number(form.cantidad),
    usuarioId: Number(form.usuarioId),
    fechaHora: form.fechaHora ? new Date(form.fechaHora).toISOString() : new Date().toISOString(),
    });
};

return (
    <form className="movimiento-form" onSubmit={handleSubmit}>
    <h3>
        {movimientoSeleccionado
        ? `Detalle / Edición del Movimiento #${movimientoSeleccionado.id}`
        : 'Registrar Nuevo Movimiento'}
    </h3>

    <div>
        <label>ID Producto:</label>
        <input
        type="number"
        name="productoId"
        value={form.productoId}
        onChange={handleChange}
        required
        />
    </div>

    <div>
        <label>Nombre Producto:</label>
        <input
        type="text"
        name="productoNombre"
        value={form.productoNombre}
        onChange={handleChange}
        required
        />
    </div>

    <div>
        <label>Tipo de Movimiento:</label>
        <select name="tipo" value={form.tipo} onChange={handleChange}>
        <option value="INGRESO">INGRESO (Compra / Recepción)</option>
        <option value="EGRESO">EGRESO (Venta / Despacho)</option>
        </select>
    </div>

    <div>
        <label>Cantidad:</label>
        <input
        type="number"
        name="cantidad"
        min="1"
        value={form.cantidad}
        onChange={handleChange}
        required
        />
    </div>

    <div>
        <label>Responsable:</label>
        <input
        type="text"
        name="usuarioNombre"
        value={form.usuarioNombre}
        onChange={handleChange}
        required
        />
    </div>

    <div>
        <label>Fecha y Hora:</label>
        <input
        type="datetime-local"
        name="fechaHora"
        value={form.fechaHora}
        onChange={handleChange}
        />
    </div>

    <div>
        <label>Observación:</label>
        <input
        type="text"
        name="observacion"
        value={form.observacion}
        onChange={handleChange}
        />
    </div>

    <div className="form-actions">
        <button type="submit">
        {movimientoSeleccionado ? 'Guardar cambios' : 'Registrar movimiento'}
        </button>

        {movimientoSeleccionado && onDelete && (
        <button
            type="button"
            onClick={() => onDelete(movimientoSeleccionado.id)}
        >
            Eliminar
        </button>
        )}

        {onCancel && (
        <button type="button" onClick={onCancel}>
            Limpiar / Nuevo
        </button>
        )}
    </div>
    </form>
);
}