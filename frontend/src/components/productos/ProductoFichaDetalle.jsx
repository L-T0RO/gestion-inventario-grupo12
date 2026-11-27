import "../../styles/ProductoFichaDetalle.css";

export function ProductoFichaDetalle({ producto, onEdit, onClose }) {
  if (!producto) return null;

  return (
    <section className="prod-ficha-card">
      <div className="prod-ficha-header">
        <h3 className="prod-ficha-title">Ficha Técnica — {producto.nombre}</h3>
        <span
          className={
            producto.alertaStockBajo
              ? "prod-ficha-status prod-ficha-status-low"
              : "prod-ficha-status prod-ficha-status-ok"
          }
        >
          {producto.alertaStockBajo ? "Alerta de stock bajo" : "Stock OK"}
        </span>
      </div>

      <div className="prod-ficha-grid">
        <div className="prod-ficha-item">
          <span className="prod-ficha-label">ID</span>
          <span className="prod-ficha-value">{producto.id}</span>
        </div>

        <div className="prod-ficha-item">
          <span className="prod-ficha-label">Código</span>
          <span className="prod-ficha-value">{producto.codigo}</span>
        </div>

        <div className="prod-ficha-item">
          <span className="prod-ficha-label">Categoría</span>
          <span className="prod-ficha-value">
            {producto.categoriaNombre || producto.categoriaId}
          </span>
        </div>

        <div className="prod-ficha-item">
          <span className="prod-ficha-label">Ubicación en depósito</span>
          <span className="prod-ficha-value">{producto.ubicacion}</span>
        </div>

        <div className="prod-ficha-item">
          <span className="prod-ficha-label">Stock actual / Mínimo</span>
          <span className="prod-ficha-value">
            {producto.stockActual} / {producto.stockMinimo}{" "}
            {producto.alertaStockBajo ? "(Alerta de stock bajo)" : "(OK)"}
          </span>
        </div>

        <div className="prod-ficha-item">
          <span className="prod-ficha-label">Precio unitario</span>
          <span className="prod-ficha-value">
            ${Number(producto.precioUnitario).toLocaleString("es-AR")}
          </span>
        </div>

        <div className="prod-ficha-item prod-ficha-item-full">
          <span className="prod-ficha-label">Descripción</span>
          <span className="prod-ficha-value">
            {producto.descripcion || "Sin descripción"}
          </span>
        </div>
      </div>

      <div className="prod-ficha-actions">
        <button
          type="button"
          className="prod-ficha-btn-primary"
          onClick={() => onEdit(producto)}
        >
          Editar en formulario
        </button>
        <button
          type="button"
          className="prod-ficha-btn-secondary"
          onClick={onClose}
        >
          Cerrar ficha
        </button>
      </div>
    </section>
  );
}