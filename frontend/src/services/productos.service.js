import { productosMock } from "../mocks/productos.mock.js";

const DEFAULT_API_BASE_URL = "http://localhost:3000/api/v1";
const CODE_REGEX = /^[A-Za-z0-9_-]{2,30}$/;

function resolveApiBaseUrl() {
  const raw =
    typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL
      ? String(import.meta.env.VITE_API_URL).trim()
      : DEFAULT_API_BASE_URL;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString().replace(/\/+$/, "");
    }
    return DEFAULT_API_BASE_URL;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
}

const API_BASE_URL = resolveApiBaseUrl();

const ALLOWED_SORT_FIELDS = new Set([
  "id",
  "codigo",
  "nombre",
  "categoriaNombre",
  "ubicacion",
  "stockActual",
  "stockMinimo",
  "precioUnitario",
]);

let localMockStore = [...productosMock];

function parsePositiveInt(value, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return fallback;
  }
  return parsed;
}

function sanitizeProductPayload(payload = {}, { isCreate = false } = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Datos de producto inválidos");
  }

  const data = {};

  if (payload.codigo !== undefined || isCreate) {
    const codigo = String(payload.codigo ?? "").trim().slice(0, 30);
    if (!CODE_REGEX.test(codigo)) {
      throw new Error("Código inválido o vacío");
    }
    data.codigo = codigo;
  }

  if (payload.nombre !== undefined || isCreate) {
    const nombre = String(payload.nombre ?? "").trim().slice(0, 120);
    if (nombre.length < 2) {
      throw new Error("Nombre inválido o vacío");
    }
    data.nombre = nombre;
  }

  if (payload.ubicacion !== undefined || isCreate) {
    const ubicacion = String(payload.ubicacion ?? "").trim().slice(0, 80);
    if (ubicacion.length < 2) {
      throw new Error("Ubicación inválida o vacía");
    }
    data.ubicacion = ubicacion;
  }

  if (payload.descripcion !== undefined) {
    data.descripcion = String(payload.descripcion ?? "").trim().slice(0, 500);
  } else if (isCreate) {
    data.descripcion = "";
  }

  if (payload.categoriaId !== undefined || isCreate) {
    const catId = Number.parseInt(String(payload.categoriaId ?? ""), 10);
    if (!Number.isInteger(catId) || catId < 1) {
      throw new Error("Categoría ID inválida");
    }
    data.categoriaId = catId;
  }

  if (payload.categoriaNombre !== undefined) {
    data.categoriaNombre = String(payload.categoriaNombre ?? "").trim().slice(0, 80);
  }

  if (payload.stockActual !== undefined || isCreate) {
    const stock = Number(payload.stockActual);
    if (!Number.isInteger(stock) || stock < 1) {
      throw new Error("Stock actual inválido: debe ser mayor o igual a 1");
    }
    data.stockActual = stock;
  }

  if (payload.stockMinimo !== undefined || isCreate) {
    const stockMin = Number(payload.stockMinimo);
    if (!Number.isInteger(stockMin) || stockMin < 0) {
      throw new Error("Stock mínimo inválido");
    }
    data.stockMinimo = stockMin;
  }

  if (payload.precioUnitario !== undefined || isCreate) {
    const precio = Number(payload.precioUnitario);
    if (!Number.isFinite(precio) || precio <= 0) {
      throw new Error("Precio unitario inválido");
    }
    data.precioUnitario = precio;
  }

  return data;
}

function compareMockItems(a, b, sortBy, dir) {
  switch (sortBy) {
    case "id":
    case "stockActual":
    case "stockMinimo":
    case "precioUnitario":
      return (Number(a[sortBy] ?? 0) - Number(b[sortBy] ?? 0)) * dir;
    case "codigo":
    case "nombre":
    case "categoriaNombre":
    case "ubicacion":
    default:
      return (
        String(a[sortBy] ?? "").localeCompare(String(b[sortBy] ?? ""), "es", {
          sensitivity: "base",
        }) * dir
      );
  }
}

const enrichMock = (item) => ({
  ...item,
  alertaStockBajo: Number(item.stockActual) <= Number(item.stockMinimo),
});

const listarDesdeMock = ({
  page = 1,
  limit = 10,
  sortBy = "id",
  order = "asc",
  search = "",
  categoriaId = "",
  stockBajo = false,
} = {}) => {
  const safeSortBy = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "id";
  const safeOrder = order === "desc" ? "desc" : "asc";
  const safeLimit = parsePositiveInt(limit, 10, { min: 1, max: 100 });
  const safePageInput = parsePositiveInt(page, 1, { min: 1 });
  const safeSearch = String(search ?? "").trim().slice(0, 100).toLowerCase();

  let items = localMockStore.map(enrichMock);

  if (safeSearch !== "") {
    items = items.filter(
      (p) =>
        String(p.codigo ?? "").toLowerCase().includes(safeSearch) ||
        String(p.nombre ?? "").toLowerCase().includes(safeSearch) ||
        String(p.ubicacion ?? "").toLowerCase().includes(safeSearch) ||
        String(p.categoriaNombre ?? "").toLowerCase().includes(safeSearch)
    );
  }

  if (categoriaId !== "" && categoriaId !== undefined) {
    const catNum = Number.parseInt(String(categoriaId), 10);
    if (Number.isInteger(catNum) && catNum > 0) {
      items = items.filter((p) => Number(p.categoriaId) === catNum);
    }
  }

  if (stockBajo) {
    items = items.filter((p) => Boolean(p.alertaStockBajo));
  }

  const dir = safeOrder === "desc" ? -1 : 1;
  items.sort((a, b) => compareMockItems(a, b, safeSortBy, dir));

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const safePage = Math.min(safePageInput, totalPages);
  const start = (safePage - 1) * safeLimit;

  return {
    items: items.slice(start, start + safeLimit),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      sortBy: safeSortBy,
      order: safeOrder,
    },
  };
};

export const productosService = {
  async listar(params = {}) {
    const safeSortBy = ALLOWED_SORT_FIELDS.has(params.sortBy) ? params.sortBy : "id";
    const safeOrder = params.order === "desc" ? "desc" : "asc";
    const safeLimit = parsePositiveInt(params.limit, 10, { min: 1, max: 100 });
    const safePage = parsePositiveInt(params.page, 1, { min: 1 });
    const safeSearch = String(params.search ?? "").trim().slice(0, 100);

    const queryEntries = [
      ["page", String(safePage)],
      ["limit", String(safeLimit)],
      ["sortBy", safeSortBy],
      ["order", safeOrder],
      ["search", safeSearch],
    ];

    if (params.categoriaId !== undefined && params.categoriaId !== "") {
      const catNum = Number.parseInt(String(params.categoriaId), 10);
      if (Number.isInteger(catNum) && catNum > 0) {
        queryEntries.push(["categoriaId", String(catNum)]);
      }
    }

    if (params.stockBajo) {
      queryEntries.push(["stockBajo", "true"]);
    }

    const query = new URLSearchParams(queryEntries);

    try {
      const response = await fetch(`${API_BASE_URL}/productos?${query.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      return listarDesdeMock({
        page: safePage,
        limit: safeLimit,
        sortBy: safeSortBy,
        order: safeOrder,
        search: safeSearch,
        categoriaId: params.categoriaId,
        stockBajo: Boolean(params.stockBajo),
      });
    }
  },

  async obtenerPorId(id) {
    const safeId = parsePositiveInt(id, null, { min: 1 });
    if (!safeId) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/productos/${encodeURIComponent(safeId)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      const found = localMockStore.find((p) => Number(p.id) === safeId);
      return found ? enrichMock(found) : null;
    }
  },

  async crear(payload) {
    const cleanPayload = sanitizeProductPayload(payload, { isCreate: true });

    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      const maxId = localMockStore.reduce(
        (acc, p) => (Number(p.id) > acc ? Number(p.id) : acc),
        0
      );
      const nextId = maxId + 1;
      const nuevo = enrichMock({
        ...cleanPayload,
        id: nextId,
        categoriaNombre: cleanPayload.categoriaNombre || "General",
        activo: true,
        createdAt: new Date().toISOString(),
      });
      localMockStore.push(nuevo);
      return nuevo;
    }
  },

  async actualizar(id, payload) {
    const safeId = parsePositiveInt(id, null, { min: 1 });
    if (!safeId) {
      throw new Error("ID de producto inválido");
    }

    const cleanPayload = sanitizeProductPayload(payload, { isCreate: false });

    try {
      const response = await fetch(`${API_BASE_URL}/productos/${encodeURIComponent(safeId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      const idx = localMockStore.findIndex((p) => Number(p.id) === safeId);
      if (idx === -1) return null;
      localMockStore[idx] = enrichMock({
        ...localMockStore[idx],
        ...cleanPayload,
        id: localMockStore[idx].id,
      });
      return localMockStore[idx];
    }
  },

  async eliminar(id) {
    const safeId = parsePositiveInt(id, null, { min: 1 });
    if (!safeId) {
      throw new Error("ID de producto inválido");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/productos/${encodeURIComponent(safeId)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data;
    } catch {
      localMockStore = localMockStore.filter((p) => Number(p.id) !== safeId);
      return { id: safeId, eliminado: true };
    }
  },
};