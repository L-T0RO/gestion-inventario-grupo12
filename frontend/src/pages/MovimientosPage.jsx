import { useCallback, useEffect, useState } from 'react';
import {
createMovimiento,
deleteMovimiento,
getMovimientos,
getResumenAlertas,
updateMovimiento,
} from '../services/movimientos.service';
import AlertasStockBajoPanel from '../components/movimientos/AlertasStockBajoPanel';
import MovimientosList from '../components/movimientos/MovimientosList';
import MovimientoRegistroForm from '../components/movimientos/MovimientoRegistroForm';

export default function MovimientosPage() {
const [items, setItems] = useState([]);
const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
const [resumen, setResumen] = useState(null);
const [search, setSearch] = useState('');
const [tipo, setTipo] = useState('');
const [sortBy, setSortBy] = useState('id');
const [order, setOrder] = useState('desc');
const [seleccionado, setSeleccionado] = useState(null);
const [mensaje, setMensaje] = useState('');

const cargarDatos = useCallback(async () => {
    const [respLista, respResumen] = await Promise.all([
    getMovimientos({
        search,
        tipo,
        sortBy,
        order,
        page: pagination.page,
        limit: pagination.limit,
    }),
    getResumenAlertas(),
    ]);

    if (respLista?.data) {
    setItems(respLista.data.items || []);
    setPagination((prev) => ({ ...prev, ...(respLista.data.pagination || {}) }));
    }

    if (respResumen?.data) {
    setResumen(respResumen.data);
    }
}, [search, tipo, sortBy, order, pagination.page, pagination.limit]);

useEffect(() => {
    cargarDatos();
}, [cargarDatos]);

const handleGuardar = async (payload) => {
    if (seleccionado) {
    const resp = await updateMovimiento(seleccionado.id, payload);
    setMensaje(resp.msg || 'Movimiento actualizado');
    } else {
    const resp = await createMovimiento(payload);
    setMensaje(resp.msg || 'Movimiento registrado');
    }
    setSeleccionado(null);
    cargarDatos();
};

const handleEliminar = async (id) => {
    const resp = await deleteMovimiento(id);
    setMensaje(resp.msg || 'Movimiento eliminado');
    setSeleccionado(null);
    cargarDatos();
};

return (
    <main className="movimientos-page">
    <h1>Gestión de Movimientos y Auditoría</h1>

    {mensaje && <p className="status-banner">{mensaje}</p>}

    <AlertasStockBajoPanel resumen={resumen} />

    <div className="movimientos-workspace">
        <MovimientosList
        items={items}
        pagination={pagination}
        search={search}
        tipo={tipo}
        sortBy={sortBy}
        order={order}
        onSearchChange={(val) => {
            setSearch(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onTipoChange={(val) => {
            setTipo(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onResetFilters={() => {
            setSearch('');
            setTipo('');
            setPagination((prev) => ({ ...prev, page: 1 }));
        }}
        onSortChange={(col, dir) => {
            setSortBy(col);
            setOrder(dir);
        }}
        onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
        onLimitChange={(newLimit) =>
            setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))
        }
        onSelectMovimiento={(mov) => setSeleccionado(mov)}
        />

        <MovimientoRegistroForm
        movimientoSeleccionado={seleccionado}
        onSubmit={handleGuardar}
        onCancel={() => setSeleccionado(null)}
        onDelete={handleEliminar}
        />
    </div>
    </main>
);
}