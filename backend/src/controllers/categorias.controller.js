import { categoriasService } from '../services/categorias.service.js';

function sendError(res, error) {
  const code = error.statusCode || 500;
  return res.status(code).json({
    msg: error.message || 'Error interno del servidor',
    code,
    data: null,
  });
}

export const categoriasController = {
  getAll(req, res) {
    try {
      const result = categoriasService.listCategorias({
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        order: req.query.order,
        search: req.query.search,
        estado: req.query.estado,
      });

      return res.status(200).json({
        msg: 'Ok',
        code: 200,
        data: result,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  getById(req, res) {
    try {
      const categoria = categoriasService.getCategoriaById(req.params.id);
      return res.status(200).json({
        msg: 'Ok',
        code: 200,
        data: categoria,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  create(req, res) {
    try {
      const created = categoriasService.createCategoria(req.body || {});
      return res.status(201).json({
        msg: 'Categoría creada correctamente',
        code: 201,
        data: created,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  update(req, res) {
    try {
      const updated = categoriasService.updateCategoria(req.params.id, req.body || {});
      return res.status(200).json({
        msg: 'Categoría actualizada correctamente',
        code: 200,
        data: updated,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  remove(req, res) {
    try {
      const deleted = categoriasService.deleteCategoria(req.params.id);
      return res.status(200).json({
        msg: 'Categoría eliminada correctamente',
        code: 200,
        data: deleted,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },
};