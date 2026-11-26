export function ProductoFichaDetalle({ producto, onEdit, onClose }) {
  if (!producto) return null;

  return (
    <div style={{ border: "1px solid #999", padding: "16px", marginBottom: "16px" }}>
      <h3>Ficha Técnica — {producto.nombre}</h3>
      <p><strong>ID:</strong> {producto.id}</p>
      <p><strong>Código:</strong> {producto.codigo}</p>
      <p><strong>Descripción:</strong> {producto.descripcion || "Sin descripción"}</p>
      <p><strong>Categoría:</strong> {producto.categoriaNombre || producto.categoriaId}</p>
      <p><strong>Ubicación en depósito:</strong> {producto.ubicacion}</p>
      <p>
        <strong>Stock actual / Mínimo:</strong> {producto.stockActual} / {producto.stockMinimo}{" "}
        {producto.alertaStockBajo ? "(Alerta de stock bajo)" : "(OK)"}
      </p>
      <p><strong>Precio unitario:</strong> ${Number(producto.precioUnitario).toLocaleString("es-AR")}</p>

      <button type="button" onClick={() => onEdit(producto)}>Editar en formulario</button>{" "}
      <button type="button" onClick={onClose}>Cerrar ficha</button>
    </div>
  );
}