export default function SearchFilterBar({
searchValue = '',
onSearchChange,
searchPlaceholder = 'Buscar...',
filters = [],
onFilterChange,
onReset,
}) {
return (
    <div className="search-filter-bar">
    <input
        type="text"
        value={searchValue}
        placeholder={searchPlaceholder}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
    />

    {filters.map((filter) => (
        <select
        key={filter.name}
        value={filter.value ?? ''}
        onChange={(e) =>
            onFilterChange && onFilterChange(filter.name, e.target.value)
        }
        >
        <option value="">{filter.placeholder || `Todos (${filter.label})`}</option>
        {(filter.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
            {opt.label}
            </option>
        ))}
        </select>
    ))}

    {onReset && (
        <button type="button" onClick={onReset}>
        Limpiar filtros
        </button>
    )}
    </div>
);
}