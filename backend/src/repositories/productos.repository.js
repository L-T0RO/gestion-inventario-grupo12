import { mockStore } from "../data/mockStore.js";

const enrichProducto = (producto) => {
  const categoria = mockStore.categorias.find((c) => c.id === Number(producto.categoriaId));
  return {
    ...producto,
    categoriaNombre: categoria ? categoria.nombre : "Sin categoría",
    alertaStockBajo: Number(producto.stockActual) <= Number(producto.stockMinimo),
  };
};

export const productosRepository = {
  findAll: () => {
    return mockStore.productos.map(enrichProducto);
  },

  findById: (id) => {
    const numericId = Number(id);
    const found = mockStore.productos.find((p) => p.id === numericId);
    return found ? enrichProducto(found) : null;
  },

  create: (payload) => {
    const maxId = mockStore.productos.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const nuevo = {
      id: maxId + 1,
      codigo: payload.codigo ?? `PROD-${String(maxId + 1).padStart(3, "0")}`,
      nombre: payload.nombre,
      descripcion: payload.descripcion ?? "",
      categoriaId: Number(payload.categoriaId) || 1,
      ubicacion: payload.ubicacion ?? "Depósito General",
      stockActual: Number(payload.stockActual) || 0,
      stockMinimo: Number(payload.stockMinimo) || 0,
      precioUnitario: Number(payload.precioUnitario) || 0,
      activo: payload.activo !== undefined ? Boolean(payload.activo) : true,
      createdAt: new Date().toISOString(),
    };
    mockStore.productos.push(nuevo);
    return enrichProducto(nuevo);
  },

  update: (id, payload) => {
    const numericId = Number(id);
    const index = mockStore.productos.findIndex((p) => p.id === numericId);
    if (index === -1) return null;

    const current = mockStore.productos[index];
    const updated = {
      ...current,
      ...(payload.codigo !== undefined && { codigo: payload.codigo }),
      ...(payload.nombre !== undefined && { nombre: payload.nombre }),
      ...(payload.descripcion !== undefined && { descripcion: payload.descripcion }),
      ...(payload.categoriaId !== undefined && { categoriaId: Number(payload.categoriaId) }),
      ...(payload.ubicacion !== undefined && { ubicacion: payload.ubicacion }),
      ...(payload.stockActual !== undefined && { stockActual: Number(payload.stockActual) }),
      ...(payload.stockMinimo !== undefined && { stockMinimo: Number(payload.stockMinimo) }),
      ...(payload.precioUnitario !== undefined && { precioUnitario: Number(payload.precioUnitario) }),
      ...(payload.activo !== undefined && { activo: Boolean(payload.activo) }),
    };

    mockStore.productos[index] = updated;
    return enrichProducto(updated);
  },

  remove: (id) => {
    const numericId = Number(id);
    const index = mockStore.productos.findIndex((p) => p.id === numericId);
    if (index === -1) return false;

    mockStore.productos.splice(index, 1);
    return true;
  },
};