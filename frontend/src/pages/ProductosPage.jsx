import { useCallback, useState, useEffect } from 'react';
import { productosService } from "../services/productos.service.js";
import { ProductosList } from "../components/productos/ProductosList.jsx";
import { ProductoFormModalOrView } from "../components/productos/ProductoFormModalOrView.jsx";
import { ProductoFichaDetalle } from "../components/productos/ProductoFichaDetalle.jsx";

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
    const data = await productosService.listar({
      page: pagination.page,
      limit: pagination.limit,
      sortBy,
      order,
      search,
      stockBajo,
    });
    setProductos(data.items || []);
    setPagination((prev) => ({ ...prev, ...(data.pagination || {}) }));
  }, [pagination.page, pagination.limit, sortBy, order, search, stockBajo]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const handleSelectProducto = async (id) => {
    const detalle = await productosService.obtenerPorId(id);
    setSelectedProducto(detalle);
    setEditingProducto(null);
    setShowCreateForm(false);
  };

  const handleCreate = async (payload) => {
    await productosService.crear(payload);
    setShowCreateForm(false);
    setStatusMessage("Producto creado en el prototipo.");
    await cargarProductos();
  };

  const handleUpdate = async (payload) => {
    if (!editingProducto) return;
    await productosService.actualizar(editingProducto.id, payload);
    setEditingProducto(null);
    setSelectedProducto(null);
    setStatusMessage("Producto actualizado en el prototipo.");
    await cargarProductos();
  };

  const handleDelete = async (id) => {
    await productosService.eliminar(id);
    if (selectedProducto?.id === id) setSelectedProducto(null);
    setStatusMessage("Producto eliminado del prototipo.");
    await cargarProductos();
  };

  const handleExportMock = (formato) => {
    const contenido = [
      "ID,Codigo,Nombre,Categoria,Ubicacion,StockActual,StockMinimo,PrecioUnitario",
      ...productos.map(
        (p) =>
          `${p.id},"${p.codigo}","${p.nombre}","${p.categoriaNombre ?? p.categoriaId}","${p.ubicacion}",${p.stockActual},${p.stockMinimo},${p.precioUnitario}`
      ),
    ].join("\n");

    const mime = formato === "xlsx" ? "application/vnd.ms-excel;charset=utf-8;" : "application/pdf";
    const ext = formato === "xlsx" ? "xls" : "pdf";
    const blob = new Blob([contenido], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-productos-prototipo.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMessage(`Reporte mock exportado en formato ${formato.toUpperCase()}.`);
  };

  return (
    <section style={{ padding: "16px" }}>
      <h2>Stock e Inventario (Productos)</h2>
      {statusMessage && <p><strong>{statusMessage}</strong></p>}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Buscar por código, nombre, ubicación..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />

        <label>
          <input
            type="checkbox"
            checked={stockBajo}
            onChange={(e) => {
              setStockBajo(e.target.checked);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />{" "}
          Solo stock bajo
        </label>

        <label>
          Registros por página:{" "}
          <select
            value={pagination.limit}
            onChange={(e) =>
              setPagination((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))
            }
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            setShowCreateForm(true);
            setEditingProducto(null);
            setSelectedProducto(null);
          }}
        >
          + Nuevo Producto
        </button>

        <button type="button" onClick={() => handleExportMock("pdf")}>
          Exportar PDF
        </button>
        <button type="button" onClick={() => handleExportMock("xlsx")}>
          Exportar XLSX
        </button>
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

      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="button"
          disabled={pagination.page <= 1}
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
        >
          Anterior
        </button>
        <span>
          Página {pagination.page} de {pagination.totalPages} (Total: {pagination.total})
        </span>
        <button
          type="button"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}