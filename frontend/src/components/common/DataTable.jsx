export default function DataTable({
columns = [],
rows = [],
sortBy = 'id',
order = 'asc',
onSortChange,
onRowClick,
emptyMessage = 'No se encontraron registros para mostrar.',
}) {
const handleHeaderClick = (column) => {
    if (!column.sortable || !onSortChange) return;
    const nextOrder = sortBy === column.key && order === 'asc' ? 'desc' : 'asc';
    onSortChange(column.key, nextOrder);
};

return (
    <div className="data-table-wrapper">
    <table className="data-table">
        <thead>
        <tr>
            {columns.map((col) => {
            const isSorted = sortBy === col.key;
            return (
                <th
                key={col.key}
                onClick={() => handleHeaderClick(col)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                >
                {col.label}
                {col.sortable && isSorted ? (order === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
            );
            })}
        </tr>
        </thead>
        <tbody>
        {rows.length === 0 ? (
            <tr>
            <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
        ) : (
            rows.map((row, idx) => (
            <tr
                key={row.id ?? idx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
                {columns.map((col) => (
                <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key] ?? '-'}
                </td>
                ))}
            </tr>
            ))
        )}
        </tbody>
    </table>
    </div>
);
}