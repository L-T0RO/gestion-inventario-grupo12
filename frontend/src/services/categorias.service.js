import { CATEGORIAS_MOCK } from '../mocks/categorias.mock';
import { CATEGORIA_ESTADOS } from '../types/categoria.types';
import { createApiResponse, createPaginatedPayload } from '../types/api.types';
import { httpRequest, IS_MOCK_MODE } from './httpClient';

const STORAGE_CATEGORIAS_KEY = 'inv_mock_categorias';

function getMockCategorias() {
  const saved = localStorage.getItem(STORAGE_CATEGORIAS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...CATEGORIAS_MOCK];
    }
  }
  localStorage.setItem(STORAGE_CATEGORIAS_KEY, JSON.stringify(CATEGORIAS_MOCK));
  return [...CATEGORIAS_MOCK];
}

function saveMockCategorias(items) {
  localStorage.setItem(STORAGE_CATEGORIAS_KEY, JSON.stringify(items));
}

function applyFiltersAndSort(items, { search = '', estado = CATEGORIA_ESTADOS.TODAS, sortBy = 'id', order = 'asc' }) {
  let result = [...items];

  if (estado === CATEGORIA_ESTADOS.ACTIVAS) {
    result = result.filter((c) => c.activa);
  } else if (estado === CATEGORIA_ESTADOS.INACTIVAS) {
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

  return result;
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildXlsxBlob(categorias) {
  const rowsXml = categorias
    .map(
      (c) => `
      <Row>
        <Cell><Data ss:Type="Number">${c.id}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(c.codigo)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(c.nombre)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(c.descripcion)}</Data></Cell>
        <Cell><Data ss:Type="String">${escapeXml(c.ubicacionDefault)}</Data></Cell>
        <Cell><Data ss:Type="Number">${c.stockMinimoDefault}</Data></Cell>
        <Cell><Data ss:Type="Number">${c.cantidadProductos}</Data></Cell>
        <Cell><Data ss:Type="String">${c.activa ? 'Activa' : 'Inactiva'}</Data></Cell>
      </Row>`
    )
    .join('');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Categorias">
    <Table>
      <Row>
        <Cell><Data ss:Type="String">ID</Data></Cell>
        <Cell><Data ss:Type="String">Codigo</Data></Cell>
        <Cell><Data ss:Type="String">Nombre</Data></Cell>
        <Cell><Data ss:Type="String">Descripcion</Data></Cell>
        <Cell><Data ss:Type="String">Ubicacion por Defecto</Data></Cell>
        <Cell><Data ss:Type="String">Stock Minimo Sugerido</Data></Cell>
        <Cell><Data ss:Type="String">Productos Asociados</Data></Cell>
        <Cell><Data ss:Type="String">Estado</Data></Cell>
      </Row>
      ${rowsXml}
    </Table>
  </Worksheet>
</Workbook>`;

  return new Blob([xmlContent], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

function sanitizePdfText(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildPdfBlob(categorias) {
  const lines = [
    'SISTEMA DE GESTION DE INVENTARIO - GRUPO 12 (UTN FRBB)',
    `Reporte de Categorias y Rubros - Fecha: ${new Date().toLocaleDateString('es-AR')}`,
    `Total de registros exportados: ${categorias.length}`,
    '--------------------------------------------------------------------------',
    ...categorias.map(
      (c) =>
        `[${c.codigo}] ${c.nombre} | Ubic: ${c.ubicacionDefault} | StockMin: ${c.stockMinimoDefault} | ${c.activa ? 'Activa' : 'Inactiva'}`
    ),
  ];

  const textCommands = lines
    .slice(0, 32)
    .map((line, index) => {
      const y = 790 - index * 20;
      return `BT /F1 ${index === 0 ? 12 : 9} Tf 40 ${y} Td (${sanitizePdfText(line)}) Tj ET`;
    })
    .join('\n');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${textCommands.length} >>\nstream\n${textCommands}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

function triggerFileDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const categoriasService = {
  async getAll({
    page = 1,
    limit = 5,
    sortBy = 'id',
    order = 'asc',
    search = '',
    estado = CATEGORIA_ESTADOS.TODAS,
  } = {}) {
    if (!IS_MOCK_MODE) {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        order,
        ...(search ? { search } : {}),
        ...(estado !== CATEGORIA_ESTADOS.TODAS ? { estado } : {}),
      });
      return httpRequest(`/categorias?${params.toString()}`);
    }

    const all = getMockCategorias();
    const filtered = applyFiltersAndSort(all, { search, estado, sortBy, order });
    const safeLimit = Math.max(1, Number(limit) || 5);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
    const startIndex = (safePage - 1) * safeLimit;
    const paginatedItems = filtered.slice(startIndex, startIndex + safeLimit);

    return createApiResponse({
      msg: 'Ok',
      code: 200,
      data: createPaginatedPayload({
        items: paginatedItems,
        total,
        page: safePage,
        limit: safeLimit,
      }),
    });
  },

  async getById(id) {
    if (!IS_MOCK_MODE) {
      return httpRequest(`/categorias/${id}`);
    }

    const all = getMockCategorias();
    const found = all.find((c) => Number(c.id) === Number(id));
    if (!found) {
      const err = new Error(`No se encontró la categoría con ID ${id}.`);
      err.code = 404;
      throw err;
    }

    return createApiResponse({
      msg: 'Ok',
      code: 200,
      data: found,
    });
  },

  async create(payload) {
    if (!IS_MOCK_MODE) {
      return httpRequest('/categorias', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    const all = getMockCategorias();
    const codigoNormalizado = String(payload.codigo || '').trim().toUpperCase();
    const nombreNormalizado = String(payload.nombre || '').trim();

    if (!codigoNormalizado || !nombreNormalizado) {
      const err = new Error('El código y el nombre de la categoría son obligatorios.');
      err.code = 400;
      throw err;
    }

    const duplicated = all.some(
      (c) => c.codigo.toUpperCase() === codigoNormalizado
    );
    if (duplicated) {
      const err = new Error(`Ya existe una categoría con el código ${codigoNormalizado}.`);
      err.code = 400;
      throw err;
    }

    const now = new Date().toISOString();
    const newItem = {
      id: all.length ? Math.max(...all.map((c) => c.id)) + 1 : 1,
      codigo: codigoNormalizado,
      nombre: nombreNormalizado,
      descripcion: String(payload.descripcion || '').trim(),
      ubicacionDefault: String(payload.ubicacionDefault || '').trim() || 'Sin asignar',
      stockMinimoDefault: Math.max(0, Number(payload.stockMinimoDefault) || 0),
      cantidadProductos: 0,
      activa: Boolean(payload.activa ?? true),
      createdAt: now,
      updatedAt: now,
    };

    saveMockCategorias([newItem, ...all]);

    return createApiResponse({
      msg: 'Categoría creada correctamente',
      code: 201,
      data: newItem,
    });
  },

  async update(id, payload) {
    if (!IS_MOCK_MODE) {
      return httpRequest(`/categorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    }

    const all = getMockCategorias();
    const index = all.findIndex((c) => Number(c.id) === Number(id));
    if (index === -1) {
      const err = new Error(`No se encontró la categoría con ID ${id}.`);
      err.code = 404;
      throw err;
    }

    const codigoNormalizado = String(payload.codigo ?? all[index].codigo)
      .trim()
      .toUpperCase();

    const duplicated = all.some(
      (c) => Number(c.id) !== Number(id) && c.codigo.toUpperCase() === codigoNormalizado
    );
    if (duplicated) {
      const err = new Error(`Ya existe otra categoría con el código ${codigoNormalizado}.`);
      err.code = 400;
      throw err;
    }

    const updatedItem = {
      ...all[index],
      codigo: codigoNormalizado,
      nombre: String(payload.nombre ?? all[index].nombre).trim(),
      descripcion: String(payload.descripcion ?? all[index].descripcion).trim(),
      ubicacionDefault:
        String(payload.ubicacionDefault ?? all[index].ubicacionDefault).trim() ||
        'Sin asignar',
      stockMinimoDefault: Math.max(
        0,
        Number(payload.stockMinimoDefault ?? all[index].stockMinimoDefault) || 0
      ),
      activa: Boolean(payload.activa ?? all[index].activa),
      updatedAt: new Date().toISOString(),
    };

    const nextList = [...all];
    nextList[index] = updatedItem;
    saveMockCategorias(nextList);

    return createApiResponse({
      msg: 'Categoría actualizada correctamente',
      code: 200,
      data: updatedItem,
    });
  },

  async remove(id) {
    if (!IS_MOCK_MODE) {
      return httpRequest(`/categorias/${id}`, {
        method: 'DELETE',
      });
    }

    const all = getMockCategorias();
    const exists = all.some((c) => Number(c.id) === Number(id));
    if (!exists) {
      const err = new Error(`No se encontró la categoría con ID ${id}.`);
      err.code = 404;
      throw err;
    }

    const nextList = all.filter((c) => Number(c.id) !== Number(id));
    saveMockCategorias(nextList);

    return createApiResponse({
      msg: 'Categoría eliminada correctamente',
      code: 200,
      data: { id: Number(id) },
    });
  },

  async exportReport({ format = 'xlsx', filters = {} } = {}) {
    const all = getMockCategorias();
    const filtered = applyFiltersAndSort(all, filters);
    const dateTag = new Date().toISOString().slice(0, 10);

    if (format === 'pdf') {
      const blob = buildPdfBlob(filtered);
      triggerFileDownload(blob, `reporte-categorias-${dateTag}.pdf`);
      return;
    }

    const blob = buildXlsxBlob(filtered);
    triggerFileDownload(blob, `reporte-categorias-${dateTag}.xlsx`);
  },

  getSummaryStatsMock() {
    const all = getMockCategorias();
    const activas = all.filter((c) => c.activa).length;
    const inactivas = all.length - activas;
    const productosAsociados = all.reduce(
      (acc, item) => acc + (Number(item.cantidadProductos) || 0),
      0
    );
    return {
      total: all.length,
      activas,
      inactivas,
      productosAsociados,
    };
  },
};