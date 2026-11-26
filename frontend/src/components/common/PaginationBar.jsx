export default function PaginationBar({
page = 1,
limit = 10,
total = 0,
totalPages = 1,
onPageChange,
onLimitChange,
limitOptions = [5, 10, 20, 50],
}) {
const safeTotalPages = Math.max(1, totalPages);

return (
    <div className="pagination-bar">
    <div className="pagination-info">
        <span>
        Total de registros: <strong>{total}</strong> | Página{' '}
        <strong>{page}</strong> de <strong>{safeTotalPages}</strong>
        </span>
    </div>

    <div className="pagination-controls">
        {onLimitChange && (
        <label>
            Mostrar:{' '}
            <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            >
            {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                {opt}
                </option>
            ))}
            </select>
        </label>
        )}

        <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange && onPageChange(page - 1)}
        >
        Anterior
        </button>

        <button
        type="button"
        disabled={page >= safeTotalPages}
        onClick={() => onPageChange && onPageChange(page + 1)}
        >
        Siguiente
        </button>
    </div>
    </div>
);
}