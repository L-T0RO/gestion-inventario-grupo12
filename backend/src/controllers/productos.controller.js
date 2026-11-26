import { parsePaginationQuery } from "../contracts/paginationQuery.contract.js";
import { productosService } from "../services/productos.service.js";

export const productosController = {
  getAll: (req, res, next) => {
    try {
      const paginationParams = parsePaginationQuery(req.query);
      const filters = {
        categoriaId: req.query.categoriaId,
        stockBajo: req.query.stockBajo,
      };
      const result = productosService.listar(paginationParams, filters);
      return res.success(result, "Ok", 200);
    } catch (err) {
      next(err);
    }
  },

  getById: (req, res, next) => {
    try {
      const result = productosService.obtenerPorId(req.params.id);
      if (result.error) {
        return res.error(result.error, result.statusCode);
      }
      return res.success(result.data, "Ok", 200);
    } catch (err) {
      next(err);
    }
  },

  create: (req, res, next) => {
    try {
      const result = productosService.crear(req.body);
      if (result.error) {
        return res.error(result.error, result.statusCode);
      }
      return res.success(result.data, "Producto creado correctamente", result.statusCode);
    } catch (err) {
      next(err);
    }
  },

  update: (req, res, next) => {
    try {
      const result = productosService.actualizar(req.params.id, req.body);
      if (result.error) {
        return res.error(result.error, result.statusCode);
      }
      return res.success(result.data, "Producto actualizado correctamente", result.statusCode);
    } catch (err) {
      next(err);
    }
  },

  remove: (req, res, next) => {
    try {
      const result = productosService.eliminar(req.params.id);
      if (result.error) {
        return res.error(result.error, result.statusCode);
      }
      return res.success(result.data, "Producto eliminado correctamente", result.statusCode);
    } catch (err) {
      next(err);
    }
  },
};