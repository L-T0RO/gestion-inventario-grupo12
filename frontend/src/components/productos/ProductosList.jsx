import "../../styles/ProductosList.css"

export function ProductosList({ productos, onSelectProducto, onDeleteProducto, onSort }) {
  if (!productos || productos.length === 0) {
    return (
      <div className="prod-empty">
        No hay productos para mostrar con los filtros actuales.
      </div>
    );
  }

  return (
    <div className="prod-table-card">
      <div className="prod-table-wrap">
        <table className="prod-table">
          <thead>
            <tr>
              <th>
                <button type="button" className="prod-sort-btn" onClick={() => onSort("codigo")}>
                  Código
                </button>
              </th>
              <th>
                <button type="button" className="prod-sort-btn" onClick={() => onSort("nombre")}>
                  Producto
                </button>
              </th>
              <th>Categoría</th>
              <th>
                <button type="button" className="prod-sort-btn" onClick={() => onSort("ubicacion")}>
                  Ubicación
                </button>
              </th>
              <th>
                <button type="button" className="prod-sort-btn" onClick={() => onSort("stockActual")}>
                  Stock Actual
                </button>
              </th>
              <th>Stock Mínimo</th>
              <th>
                <button type="button" className="prod-sort-btn" onClick={() => onSort("precioUnitario")}>
                  Precio
                </button>
              </th>
              <th className="prod-th-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr
                key={prod.id}
                className={prod.alertaStockBajo ? "prod-row-low" : "prod-row"}
              >
                <td className="prod-code">{prod.codigo}</td>
                <td>
                  <button
                    type="button"
                    className="prod-link-btn"
                    onClick={() => onSelectProducto(prod.id)}
                  >
                    {prod.nombre}
                  </button>
                </td>
                <td>{prod.categoriaNombre || prod.categoriaId}</td>
                <td>{prod.ubicacion}</td>
                <td>
                  <span className="prod-stock-cell">
                    <span>{prod.stockActual}</span>
                    {prod.alertaStockBajo && (
                      <span className="prod-badge-low">Bajo</span>
                    )}
                  </span>
                </td>
                <td>{prod.stockMinimo}</td>
                <td className="prod-price">
                  ${Number(prod.precioUnitario).toLocaleString("es-AR")}
                </td>
                <td className="prod-td-right">
                  <div className="prod-actions">
                    <button
                      type="button"
                      className="prod-btn-edit"
                      onClick={() => onSelectProducto(prod.id)}
                    >
                      Ver / Editar
                    </button>
                    <button
                      type="button"
                      className="prod-btn-delete"
                      onClick={() => onDeleteProducto(prod.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}