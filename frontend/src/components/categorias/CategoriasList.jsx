import { CATEGORIA_ESTADOS } from '../../types/categoria.types';

export default function CategoriasList({
  categorias,
  pagination,
  filters,
  loading,
  onFilterChange,
  onPageChange,
  onSelectCategoria,
  onDeleteCategoria,
  onCreateNew,
  onExport,
}) {
  const handleSortToggle = (field) => {
    const nextOrder =
      filters.sortBy === field && filters.order === 'asc' ? 'desc' : 'asc';
    onFilterChange({ sortBy: field, order: nextOrder, page: 1 });
  };

  const renderSortIndicator = (field) => {
    if (filters.sortBy !== field) return '';
    return filters.order === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Barra superior de acciones y exportación */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.2rem' }}>Listado de Rubros y Categorías</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Hacé clic sobre cualquier fila para visualizar o editar todos sus datos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onExport('xlsx')}
          >
            Exportar XLSX
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onExport('pdf')}
          >
            Exportar PDF
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={onCreateNew}>
            + Nueva Categoría
          </button>
        </div>
      </div>

      {/* Búsqueda, filtros y cantidad de registros */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          alignItems: 'end',
        }}
      >
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="cat-search">Buscar (código, nombre o ubicación)</label>
          <input
            id="cat-search"
            type="text"
            className="form-control"
            placeholder="Ej: CAT-001, Redes, Pasillo A..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="cat-estado">Estado</label>
          <select
            id="cat-estado"
            className="form-control"
            value={filters.estado}
            onChange={(e) => onFilterChange({ estado: e.target.value, page: 1 })}
          >
            <option value={CATEGORIA_ESTADOS.TODAS}>Todas</option>
            <option value={CATEGORIA_ESTADOS.ACTIVAS}>Activas</option>
            <option value={CATEGORIA_ESTADOS.INACTIVAS}>Inactivas</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="cat-limit">Registros por página</label>
          <select
            id="cat-limit"
            className="form-control"
            value={filters.limit}
            onChange={(e) => onFilterChange({ limit: Number(e.target.value), page: 1 })}
          >
            <option value={5}>5 registros</option>
            <option value={10}>10 registros</option>
            <option value={20}>20 registros</option>
          </select>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSortToggle('codigo')}>
                Código{renderSortIndicator('codigo')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSortToggle('nombre')}>
                Nombre del Rubro{renderSortIndicator('nombre')}
              </th>
              <th>Ubicación por Defecto</th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSortToggle('stockMinimoDefault')}
              >
                Stock Mín. Sugerido{renderSortIndicator('stockMinimoDefault')}
              </th>
              <th
                style={{ cursor: 'pointer' }}
                onClick={() => handleSortToggle('cantidadProductos')}
              >
                Productos{renderSortIndicator('cantidadProductos')}
              </th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem' }}>
                  Cargando categorías...
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem' }}>
                  No se encontraron categorías con los filtros aplicados.
                </td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr
                  key={cat.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectCategoria(cat.id)}
                >
                  <td>
                    <strong>{cat.codigo}</strong>
                  </td>
                  <td>
                    <div>{cat.nombre}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {cat.descripcion}
                    </div>
                  </td>
                  <td>{cat.ubicacionDefault}</td>
                  <td>{cat.stockMinimoDefault} u.</td>
                  <td>{cat.cantidadProductos}</td>
                  <td>
                    <span className={`badge ${cat.activa ? 'badge-success' : 'badge-warning'}`}>
                      {cat.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectCategoria(cat.id)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteCategoria(cat)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pie de paginado y cantidad de registros */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
        }}
      >
        <div>
          Mostrando <strong>{categorias.length}</strong> de{' '}
          <strong>{pagination.total}</strong> registros totales (Página{' '}
          <strong>{pagination.page}</strong> de <strong>{pagination.totalPages}</strong>)
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}