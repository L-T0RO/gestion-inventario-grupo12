export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Error interno del servidor";

  return res.status(statusCode).json({
    msg: message,
    code: statusCode,
    data: null,
  });
};