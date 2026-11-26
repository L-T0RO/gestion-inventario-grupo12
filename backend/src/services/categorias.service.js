import { categoriasRepository } from '../repositories/categorias.repository.js';

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export const categoriasService = {
  listCategorias(queryParams) {
    return categoriasRepository.findAll(queryParams);
  },

  getCategoriaById(id) {
    const categoria = categoriasRepository.findById(id);
    if (!categoria) {
      throw createHttpError(`No se encontró la categoría con ID ${id}.`, 404);
    }
    return categoria;
  },

  createCategoria(payload) {
    const codigo = String(payload.codigo || '').trim().toUpperCase();
    const nombre = String(payload.nombre || '').trim();

    if (!codigo || !nombre) {
      throw createHttpError('Los campos codigo y nombre son obligatorios.', 400);
    }

    const existing = categoriasRepository.findByCodigo(codigo);
    if (existing) {
      throw createHttpError(`Ya existe una categoría con el código ${codigo}.`, 400);
    }

    return categoriasRepository.create({
      ...payload,
      codigo,
      nombre,
    });
  },

  updateCategoria(id, payload) {
    const existing = categoriasRepository.findById(id);
    if (!existing) {
      throw createHttpError(`No se encontró la categoría con ID ${id}.`, 404);
    }

    if (payload.codigo !== undefined) {
      const normalizedCodigo = String(payload.codigo).trim().toUpperCase();
      if (!normalizedCodigo) {
        throw createHttpError('El código de categoría no puede estar vacío.', 400);
      }
      const duplicated = categoriasRepository.findByCodigo(normalizedCodigo);
      if (duplicated && Number(duplicated.id) !== Number(id)) {
        throw createHttpError(
          `Ya existe otra categoría con el código ${normalizedCodigo}.`,
          400
        );
      }
    }

    if (payload.nombre !== undefined && !String(payload.nombre).trim()) {
      throw createHttpError('El nombre de categoría no puede estar vacío.', 400);
    }

    return categoriasRepository.update(id, payload);
  },

  deleteCategoria(id) {
    const deleted = categoriasRepository.delete(id);
    if (!deleted) {
      throw createHttpError(`No se encontró la categoría con ID ${id}.`, 404);
    }
    return { id: Number(id) };
  },
};