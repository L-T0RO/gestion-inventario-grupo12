/**
 * @typedef {Object} Producto
 * @property {number} id
 * @property {string} codigo
 * @property {string} nombre
 * @property {string} descripcion
 * @property {number} categoriaId
 * @property {string} categoriaNombre
 * @property {string} ubicacion
 * @property {number} stockActual
 * @property {number} stockMinimo
 * @property {number} precioUnitario
 * @property {boolean} alertaStockBajo
 * @property {boolean} activo
 * @property {string} createdAt
 */

export const ESTADO_STOCK = {
  BAJO: "STOCK_BAJO",
  NORMAL: "NORMAL",
};