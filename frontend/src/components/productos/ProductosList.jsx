export function ProductosList({ productos, onSelectProducto, onDeleteProducto, onSort }) {
  if (!productos || productos.length === 0) {
    return <p>No hay productos para mostrar con los filtros actuales.</p>;
  }

  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>
            <button type="button" onClick={() => onSort("codigo")}>Código</button>
          </th>
          <th>
            <button type="button" onClick={() => onSort("nombre")}>Producto</button>
          </th>
          <th>Categoría</th>
          <th>
            <button type="button" onClick={() => onSort("ubicacion")}>Ubicación</button>
          </th>
          <th>
            <button type="button" onClick={() => onSort("stockActual")}>Stock Actual</button>
          </th>
          <th>Stock Mínimo</th>
          <th>
            <button type="button" onClick={() => onSort("precioUnitario")}>Precio</button>
          </th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((prod) => (
          <tr
            key={prod.id}
            style={{
              backgroundColor: prod.alertaStockBajo ? "#fff3cd" : "transparent",
            }}
          >
            <td>{prod.codigo}</td>
            <td>
              <button
                type="button"
                onClick={() => onSelectProducto(prod.id)}
                style={{ background: "none", border: "none", textDecoration: "underline", cursor: "pointer", padding: 0 }}
              >
                {prod.nombre}
              </button>
            </td>
            <td>{prod.categoriaNombre || prod.categoriaId}</td>
            <td>{prod.ubicacion}</td>
            <td>
              {prod.stockActual} {prod.alertaStockBajo ? "(Bajo)" : ""}
            </td>
            <td>{prod.stockMinimo}</td>
            <td>${Number(prod.precioUnitario).toLocaleString("es-AR")}</td>
            <td>
              <button type="button" onClick={() => onSelectProducto(prod.id)}>
                Ver / Editar
              </button>{" "}
              <button type="button" onClick={() => onDeleteProducto(prod.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}