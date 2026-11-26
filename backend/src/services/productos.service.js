import { productosRepository } from "../repositories/productos.repository.js";

const ALLOWED_SORT_FIELDS = new Set([
  "id",
  "codigo",
  "nombre",
  "categoriaNombre",
  "ubicacion",
  "stockActual",
  "stockMinimo",
  "precioUnitario",
  "createdAt",
]);

export const productosService = {
  listar: ({ page, limit, sortBy, order, search }, filters = {}) => {
    let items = productosRepository.findAll();

    if (search && search.trim() !== "") {
      const term = search.trim().toLowerCase();
      items = items.filter(
        (item) =>
          String(item.codigo).toLowerCase().includes(term) ||
          String(item.nombre).toLowerCase().includes(term) ||
          String(item.descripcion).toLowerCase().includes(term) ||
          String(item.ubicacion).toLowerCase().includes(term) ||
          String(item.categoriaNombre).toLowerCase().includes(term)
      );
    }

    if (filters.categoriaId !== undefined && filters.categoriaId !== "") {
      const catId = Number(filters.categoriaId);
      items = items.filter((item) => item.categoriaId === catId);
    }

    if (filters.stockBajo === "true" || filters.stockBajo === true) {
      items = items.filter((item) => item.alertaStockBajo);
    }

    const field = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : "id";
    const direction = order === "desc" ? -1 : 1;

    items.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (typeof valA === "number" && typeof valB === "number") {
        return (valA - valB) * direction;
      }
      return String(valA ?? "").localeCompare(String(valB ?? ""), "es", { sensitivity: "base" }) * direction;
    });

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        sortBy: field,
        order,
      },
    };
  },

  obtenerPorId: (id) => {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return { error: "ID de producto inválido", statusCode: 400 };
    }

    const producto = productosRepository.findById(parsedId);
    if (!producto) {
      return { error: "Producto no encontrado", statusCode: 404 };
    }

    return { data: producto };
  },

  crear: (payload) => {
    if (!payload || !payload.nombre || String(payload.nombre).trim() === "") {
      return { error: "El nombre del producto es obligatorio", statusCode: 400 };
    }

    const creado = productosRepository.create({
      ...payload,
      nombre: String(payload.nombre).trim(),
    });

    return { data: creado, statusCode: 201 };
  },

  actualizar: (id, payload) => {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return { error: "ID de producto inválido", statusCode: 400 };
    }

    if (payload.nombre !== undefined && String(payload.nombre).trim() === "") {
      return { error: "El nombre del producto no puede estar vacío", statusCode: 400 };
    }

    const actualizado = productosRepository.update(parsedId, payload);
    if (!actualizado) {
      return { error: "Producto no encontrado", statusCode: 404 };
    }

    return { data: actualizado, statusCode: 200 };
  },

  eliminar: (id) => {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return { error: "ID de producto inválido", statusCode: 400 };
    }

    const eliminado = productosRepository.remove(parsedId);
    if (!eliminado) {
      return { error: "Producto no encontrado", statusCode: 404 };
    }

    return { data: { id: parsedId, eliminado: true }, statusCode: 200 };
  },
};