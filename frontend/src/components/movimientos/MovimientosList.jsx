import DataTable from '../common/DataTable';
import PaginationBar from '../common/PaginationBar';
import SearchFilterBar from '../common/SearchFilterBar';
import ExportReportButton from '../common/ExportReportButton';

export default function MovimientosList({
items = [],
pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
search = '',
tipo = '',
sortBy = 'id',
order = 'asc',
onSearchChange,
onTipoChange,
onResetFilters,
onSortChange,
onPageChange,
onLimitChange,
onSelectMovimiento,
}) {
const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'productoNombre', label: 'Producto', sortable: true },
    { key: 'tipo', label: 'Tipo', sortable: true },
    { key: 'cantidad', label: 'Cantidad', sortable: true },
    { key: 'usuarioNombre', label: 'Usuario', sortable: false },
    {
    key: 'fechaHora',
    label: 'Fecha y Hora',
    sortable: true,
    render: (row) => new Date(row.fechaHora).toLocaleString('es-AR'),
    },
    { key: 'observacion', label: 'Observación', sortable: false },
];

return (
    <section className="movimientos-list-section">
    <div className="toolbar">
        <SearchFilterBar
        searchValue={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Buscar por producto, usuario u observación..."
        filters={[
            {
            name: 'tipo',
            label: 'Tipo',
            placeholder: 'Todos los tipos',
            value: tipo,
            options: [
                { value: 'INGRESO', label: 'INGRESO' },
                { value: 'EGRESO', label: 'EGRESO' },
            ],
            },
        ]}
        onFilterChange={(name, value) => {
            if (name === 'tipo' && onTipoChange) onTipoChange(value);
        }}
        onReset={onResetFilters}
        />

        <ExportReportButton
        filename="reporte-movimientos-grupo12"
        title="Reporte de Movimientos de Inventario"
        columns={columns}
        rows={items}
        />
    </div>

    <DataTable
        columns={columns}
        rows={items}
        sortBy={sortBy}
        order={order}
        onSortChange={onSortChange}
        onRowClick={onSelectMovimiento}
        emptyMessage="No se registraron movimientos con los filtros actuales."
    />

    <PaginationBar
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
    />
    </section>
);
}