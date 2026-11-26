const INITIAL_CATEGORIAS = [
  {
    id: 1,
    codigo: 'CAT-001',
    nombre: 'Informática y Redes',
    descripcion: 'Equipos de computación, periféricos, cables de red y accesorios.',
    ubicacionDefault: 'Pasillo A - Estantería 1',
    stockMinimoDefault: 10,
    cantidadProductos: 24,
    activa: true,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-11-15T14:30:00Z',
  },
  {
    id: 2,
    codigo: 'CAT-002',
    nombre: 'Insumos de Oficina',
    descripcion: 'Resmas de papel, tóneres, cartuchos y artículos de escritorio.',
    ubicacionDefault: 'Pasillo A - Estantería 3',
    stockMinimoDefault: 15,
    cantidadProductos: 19,
    activa: true,
    createdAt: '2026-10-02T11:20:00Z',
    updatedAt: '2026-11-18T09:10:00Z',
  },
  {
    id: 3,
    codigo: 'CAT-003',
    nombre: 'Seguridad Industrial',
    descripcion: 'Elementos de protección personal, guantes, cascos y señalética.',
    ubicacionDefault: 'Pasillo B - Sector 1',
    stockMinimoDefault: 20,
    cantidadProductos: 14,
    activa: true,
    createdAt: '2026-10-04T08:45:00Z',
    updatedAt: '2026-11-10T16:00:00Z',
  },
  {
    id: 4,
    codigo: 'CAT-004',
    nombre: 'Herramientas Eléctricas',
    descripcion: 'Taladros, amoladoras, soldadores e instrumental de medición.',
    ubicacionDefault: 'Pasillo B - Sector 4',
    stockMinimoDefault: 5,
    cantidadProductos: 11,
    activa: true,
    createdAt: '2026-10-05T13:15:00Z',
    updatedAt: '2026-11-12T11:25:00Z',
  },
  {
    id: 5,
    codigo: 'CAT-005',
    nombre: 'Ferretería General',
    descripcion: 'Tornillería, fijaciones, adhesivos industriales y herrajes.',
    ubicacionDefault: 'Pasillo C - Cajoneras',
    stockMinimoDefault: 50,
    cantidadProductos: 32,
    activa: true,
    createdAt: '2026-10-06T09:30:00Z',
    updatedAt: '2026-11-20T17:40:00Z',
  },
  {
    id: 6,
    codigo: 'CAT-006',
    nombre: 'Embalaje y Logística',
    descripcion: 'Cajas de cartón, film stretch, cintas de embalar y etiquetas.',
    ubicacionDefault: 'Depósito Sur - Zona Carga',
    stockMinimoDefault: 30,
    cantidadProductos: 9,
    activa: true,
    createdAt: '2026-10-08T15:00:00Z',
    updatedAt: '2026-11-19T10:05:00Z',
  },
  {
    id: 7,
    codigo: 'CAT-007',
    nombre: 'Iluminación',
    descripcion: 'Paneles LED, reflectores, tubos y luminaria de emergencia.',
    ubicacionDefault: 'Pasillo D - Estantería 2',
    stockMinimoDefault: 12,
    cantidadProductos: 8,
    activa: true,
    createdAt: '2026-10-10T12:10:00Z',
    updatedAt: '2026-11-14T15:50:00Z',
  },
  {
    id: 8,
    codigo: 'CAT-008',
    nombre: 'Limpieza e Higiene',
    descripcion: 'Productos químicos de limpieza, dispensadores y descartables.',
    ubicacionDefault: 'Depósito Norte - Box 2',
    stockMinimoDefault: 15,
    cantidadProductos: 7,
    activa: true,
    createdAt: '2026-10-12T10:40:00Z',
    updatedAt: '2026-11-11T08:20:00Z',
  },
  {
    id: 9,
    codigo: 'CAT-009',
    nombre: 'Electromecánica',
    descripcion: 'Motores, contactores, térmicas, disyuntores y tableros.',
    ubicacionDefault: 'Pasillo D - Estantería 5',
    stockMinimoDefault: 4,
    cantidadProductos: 4,
    activa: true,
    createdAt: '2026-10-15T16:30:00Z',
    updatedAt: '2026-11-21T13:15:00Z',
  },
  {
    id: 10,
    codigo: 'CAT-010',
    nombre: 'Repuestos Discontinuados',
    descripcion: 'Componentes de líneas anteriores sujetos a liquidación de stock.',
    ubicacionDefault: 'Archivo / Estantería 9',
    stockMinimoDefault: 0,
    cantidadProductos: 0,
    activa: false,
    createdAt: '2026-10-18T14:00:00Z',
    updatedAt: '2026-11-05T12:00:00Z',
  },
];

let categoriasStore = [...INITIAL_CATEGORIAS];

export const categoriasRepository = {
  findAll({ page = 1, limit = 10, sortBy = 'id', order = 'asc', search = '', estado = 'TODAS' } = {}) {
    let result = [...categoriasStore];

    const normalizedEstado = String(estado).toUpperCase();
    if (normalizedEstado === 'ACTIVAS') {
      result = result.filter((c) => c.activa);
    } else if (normalizedEstado === 'INACTIVAS') {
      result = result.filter((c) => !c.activa);
    }

    const term = String(search).trim().toLowerCase();
    if (term) {
      result = result.filter(
        (c) =>
          c.codigo.toLowerCase().includes(term) ||
          c.nombre.toLowerCase().includes(term) ||
          c.descripcion.toLowerCase().includes(term) ||
          c.ubicacionDefault.toLowerCase().includes(term)
      );
    }

    const direction = String(order).toLowerCase() === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * direction;
      }
      return String(valA).localeCompare(String(valB), 'es', { sensitivity: 'base' }) * direction;
    });

    const safeLimit = Math.max(1, Number(limit) || 10);
    const total = result.length;
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const startIndex = (safePage - 1) * safeLimit;
    const items = result.slice(startIndex, startIndex + safeLimit);

    return {
      items,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
      },
    };
  },

  findById(id) {
    return categoriasStore.find((c) => Number(c.id) === Number(id)) || null;
  },

  findByCodigo(codigo) {
    const normalized = String(codigo || '').trim().toUpperCase();
    return categoriasStore.find((c) => c.codigo.toUpperCase() === normalized) || null;
  },

  create(data) {
    const now = new Date().toISOString();
    const nextId = categoriasStore.length
      ? Math.max(...categoriasStore.map((c) => c.id)) + 1
      : 1;

    const created = {
      id: nextId,
      codigo: String(data.codigo).trim().toUpperCase(),
      nombre: String(data.nombre).trim(),
      descripcion: String(data.descripcion || '').trim(),
      ubicacionDefault: String(data.ubicacionDefault || '').trim() || 'Sin asignar',
      stockMinimoDefault: Math.max(0, Number(data.stockMinimoDefault) || 0),
      cantidadProductos: 0,
      activa: Boolean(data.activa ?? true),
      createdAt: now,
      updatedAt: now,
    };

    categoriasStore = [created, ...categoriasStore];
    return created;
  },

  update(id, data) {
    const index = categoriasStore.findIndex((c) => Number(c.id) === Number(id));
    if (index === -1) return null;

    const current = categoriasStore[index];
    const updated = {
      ...current,
      codigo: data.codigo !== undefined ? String(data.codigo).trim().toUpperCase() : current.codigo,
      nombre: data.nombre !== undefined ? String(data.nombre).trim() : current.nombre,
      descripcion:
        data.descripcion !== undefined ? String(data.descripcion).trim() : current.descripcion,
      ubicacionDefault:
        data.ubicacionDefault !== undefined
          ? String(data.ubicacionDefault).trim() || 'Sin asignar'
          : current.ubicacionDefault,
      stockMinimoDefault:
        data.stockMinimoDefault !== undefined
          ? Math.max(0, Number(data.stockMinimoDefault) || 0)
          : current.stockMinimoDefault,
      activa: data.activa !== undefined ? Boolean(data.activa) : current.activa,
      updatedAt: new Date().toISOString(),
    };

    categoriasStore[index] = updated;
    return updated;
  },

  delete(id) {
    const exists = categoriasStore.some((c) => Number(c.id) === Number(id));
    if (!exists) return false;
    categoriasStore = categoriasStore.filter((c) => Number(c.id) !== Number(id));
    return true;
  },
};