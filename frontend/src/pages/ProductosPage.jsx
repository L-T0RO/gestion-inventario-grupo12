import { useCallback, useState, useEffect } from "react";
import { productosService } from "../services/productos.service.js";
import { ProductosList } from "../components/productos/ProductosList.jsx";
import { ProductoFormModalOrView } from "../components/productos/ProductoFormModalOrView.jsx";
import { ProductoFichaDetalle } from "../components/productos/ProductoFichaDetalle.jsx";
import "../styles/ProductosPage.css";

const ALLOWED_SORT_FIELDS = new Set([
  "id",
  "codigo",
  "nombre",
  "ubicacion",
  "stockActual",
  "stockMinimo",
  "precioUnitario",
]);

const ALLOWED_ORDERS = new Set(["asc", "desc"]);
const ALLOWED_LIMITS = new Set([5, 10, 20]);
const MAX_SEARCH_LENGTH = 100;

function sanitizeCsvCell(value) {
  let str = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [stockBajo, setStockBajo] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");

  const [selectedProducto, setSelectedProducto] = useState(null);
  const [editingProducto, setEditingProducto] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const cargarProductos = useCallback(async () => {
    const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "id";
    const safeOrder = ALLOWED_ORDERS.has(order) ? order : "asc";
    const safeLimit = ALLOWED_LIMITS.has(Number(pagination.limit)) ? Number(pagination.limit) : 10;
    const safePage = Math.max(1, Number.parseInt(pagination.page, 10) || 1);
    const safeSearch = String(search ?? "").slice(0, MAX_SEARCH_LENGTH);

    try {
      const data = await productosService.listar({
        page: safePage,
        limit: safeLimit,
        sortBy: safeSortBy,
        order: safeOrder,
        search: safeSearch,
        stockBajo: Boolean(stockBajo),
      });
      setProductos(Array.isArray(data?.items) ? data.items : []);
      setPagination((prev) => ({
        ...prev,
        ...(data?.pagination || {}),
        page: Math.max(1, Number(data?.pagination?.page) || safePage),
        limit: safeLimit,
        totalPages: Math.max(1, Number(data?.pagination?.totalPages) || 1),
        total: Math.max(0, Number(data?.pagination?.total) || 0),
      }));
    } catch {
      setStatusMessage("No se pudo cargar el listado de productos.");
    }
  }, [pagination.page, pagination.limit, sortBy, order, search, stockBajo]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleSort = (field) => {
    if (!ALLOWED_SORT_FIELDS.has(field)) return;
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const handleSelectProducto = async (id) => {
    try {
      const detalle = await productosService.obtenerPorId(id);
      if (!detalle) {
        setStatusMessage("No se encontró el producto seleccionado.");
        return;
      }
      setSelectedProducto(detalle);
      setEditingProducto(null);
      setShowCreateForm(false);
    } catch {
      setStatusMessage("No se pudo obtener la ficha del producto.");
    }
  };

  const handleCreate = async (payload) => {
    try {
      await productosService.crear(payload);
      setShowCreateForm(false);
      setStatusMessage("Producto creado en el prototipo.");
      await cargarProductos();
    } catch {
      setStatusMessage("No se pudo crear el producto. Verificá los datos ingresados.");
    }
  };

  const handleUpdate = async (payload) => {
    if (!editingProducto) return;
    try {
      await productosService.actualizar(editingProducto.id, payload);
      setEditingProducto(null);
      setSelectedProducto(null);
      setStatusMessage("Producto actualizado en el prototipo.");
      await cargarProductos();
    } catch {
      setStatusMessage("No se pudo actualizar el producto. Verificá los datos ingresados.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await productosService.eliminar(id);
      if (selectedProducto?.id === id) setSelectedProducto(null);
      setStatusMessage("Producto eliminado del prototipo.");
      await cargarProductos();
    } catch {
      setStatusMessage("No se pudo eliminar el producto.");
    }
  };

  const handleExportMock = (formato) => {
    const safeFormato = formato === "xlsx" ? "xlsx" : "pdf";
    const headers = [
      "ID",
      "Codigo",
      "Nombre",
      "Categoria",
      "Ubicacion",
      "StockActual",
      "StockMinimo",
      "PrecioUnitario",
    ].join(",");

    const rows = productos.map((p) =>
      [
        sanitizeCsvCell(p.id),
        sanitizeCsvCell(p.codigo),
        sanitizeCsvCell(p.nombre),
        sanitizeCsvCell(p.categoriaNombre ?? p.categoriaId),
        sanitizeCsvCell(p.ubicacion),
        sanitizeCsvCell(p.stockActual),
        sanitizeCsvCell(p.stockMinimo),
        sanitizeCsvCell(p.precioUnitario),
      ].join(",")
    );

    const contenido = [headers, ...rows].join("\n");
    const mime =
      safeFormato === "xlsx"
        ? "application/vnd.ms-excel;charset=utf-8;"
        : "application/pdf";
    const ext = safeFormato === "xlsx" ? "xls" : "pdf";
    const blob = new Blob([contenido], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-productos-prototipo.${ext}`;
    link.rel = "noopener noreferrer";
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage(`Reporte mock exportado en formato ${safeFormato.toUpperCase()}.`);
  };

  return (
    <section className="prod-page">
      <div className="prod-page-header">
        <h2 className="prod-page-title">Stock e Inventario (Productos)</h2>
      </div>

      {statusMessage && <div className="prod-status-banner">{statusMessage}</div>}

      <div className="prod-toolbar">
        <input
          type="text"
          className="prod-search-input"
          placeholder="Buscar por código, nombre, ubicación..."
          value={search}
          maxLength={MAX_SEARCH_LENGTH}
          onChange={(e) => {
            setSearch(e.target.value.slice(0, MAX_SEARCH_LENGTH));
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />

        <label className="prod-checkbox-label">
          <input
            type="checkbox"
            checked={stockBajo}
            onChange={(e) => {
              setStockBajo(e.target.checked);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
          <span>Solo stock bajo</span>
        </label>

        <label className="prod-page-size-label">
          <span>Registros por página:</span>
          <select
            className="prod-select"
            value={pagination.limit}
            onChange={(e) => {
              const nextLimit = Number(e.target.value);
              setPagination((prev) => ({
                ...prev,
                limit: ALLOWED_LIMITS.has(nextLimit) ? nextLimit : 10,
                page: 1,
              }));
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <div className="prod-toolbar-actions">
          <button
            type="button"
            className="prod-btn-primary"
            onClick={() => {
              setShowCreateForm(true);
              setEditingProducto(null);
              setSelectedProducto(null);
            }}
          >
            + Nuevo Producto
          </button>

          <button
            type="button"
            className="prod-btn-secondary"
            onClick={() => handleExportMock("pdf")}
          >
            Exportar PDF
          </button>

          <button
            type="button"
            className="prod-btn-secondary"
            onClick={() => handleExportMock("xlsx")}
          >
            Exportar XLSX
          </button>
        </div>
      </div>

      {showCreateForm && (
        <ProductoFormModalOrView
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingProducto && (
        <ProductoFormModalOrView
          initialData={editingProducto}
          onSubmit={handleUpdate}
          onCancel={() => setEditingProducto(null)}
        />
      )}

      {selectedProducto && !editingProducto && (
        <ProductoFichaDetalle
          producto={selectedProducto}
          onEdit={(prod) => setEditingProducto(prod)}
          onClose={() => setSelectedProducto(null)}
        />
      )}

      <ProductosList
        productos={productos}
        onSelectProducto={handleSelectProducto}
        onDeleteProducto={handleDelete}
        onSort={handleSort}
      />

      <div className="prod-pagination">
        <button
          type="button"
          className="prod-page-btn"
          disabled={pagination.page <= 1}
          onClick={() =>
            setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
          }
        >
          Anterior
        </button>
        <span className="prod-pagination-info">
          Página {pagination.page} de {pagination.totalPages} (Total: {pagination.total})
        </span>
        <button
          type="button"
          className="prod-page-btn"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(prev.totalPages, prev.page + 1),
            }))
          }
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}

export default ProductosPage;