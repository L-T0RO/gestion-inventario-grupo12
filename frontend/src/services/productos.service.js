import { productosMock } from "../mocks/productos.mock.js";

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:3000/api/v1";

let localMockStore = [...productosMock];

const enrichMock = (item) => ({
  ...item,
  alertaStockBajo: Number(item.stockActual) <= Number(item.stockMinimo),
});

const listarDesdeMock = ({ page = 1, limit = 10, sortBy = "id", order = "asc", search = "", categoriaId = "", stockBajo = false }) => {
  let items = localMockStore.map(enrichMock);

  if (search && search.trim() !== "") {
    const term = search.trim().toLowerCase();
    items = items.filter(
      (p) =>
        String(p.codigo).toLowerCase().includes(term) ||
        String(p.nombre).toLowerCase().includes(term) ||
        String(p.ubicacion).toLowerCase().includes(term) ||
        String(p.categoriaNombre).toLowerCase().includes(term)
    );
  }

  if (categoriaId !== "" && categoriaId !== undefined) {
    items = items.filter((p) => Number(p.categoriaId) === Number(categoriaId));
  }

  if (stockBajo) {
    items = items.filter((p) => p.alertaStockBajo);
  }

  const dir = order === "desc" ? -1 : 1;
  items.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (typeof valA === "number" && typeof valB === "number") return (valA - valB) * dir;
    return String(valA ?? "").localeCompare(String(valB ?? ""), "es", { sensitivity: "base" }) * dir;
  });

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    pagination: { page: safePage, limit, total, totalPages, sortBy, order },
  };
};

export const productosService = {
  async listar(params = {}) {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 10),
      sortBy: String(params.sortBy ?? "id"),
      order: String(params.order ?? "asc"),
      search: String(params.search ?? ""),
      ...(params.categoriaId ? { categoriaId: String(params.categoriaId) } : {}),
      ...(params.stockBajo ? { stockBajo: "true" } : {}),
    });

    try {
      const response = await fetch(`${API_BASE_URL}/productos?${query.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      return listarDesdeMock(params);
    }
  },

  async obtenerPorId(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      const found = localMockStore.find((p) => Number(p.id) === Number(id));
      return found ? enrichMock(found) : null;
    }
  },

  async crear(payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      const maxId = localMockStore.reduce((acc, p) => (p.id > acc ? p.id : acc), 0);
      const nuevo = enrichMock({
        ...payload,
        id: maxId + 1,
        codigo: payload.codigo || `PROD-${String(maxId + 1).padStart(3, "0")}`,
        categoriaNombre: payload.categoriaNombre || "General",
        stockActual: Number(payload.stockActual) || 0,
        stockMinimo: Number(payload.stockMinimo) || 0,
        precioUnitario: Number(payload.precioUnitario) || 0,
        activo: true,
        createdAt: new Date().toISOString(),
      });
      localMockStore.push(nuevo);
      return nuevo;
    }
  },

  async actualizar(id, payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      const idx = localMockStore.findIndex((p) => Number(p.id) === Number(id));
      if (idx === -1) return null;
      localMockStore[idx] = enrichMock({ ...localMockStore[idx], ...payload });
      return localMockStore[idx];
    }
  },

  async eliminar(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      localMockStore = localMockStore.filter((p) => Number(p.id) !== Number(id));
      return { id: Number(id), eliminado: true };
    }
  },
};