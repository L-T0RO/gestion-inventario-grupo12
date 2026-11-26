import { authService } from '../services/auth.service.js';

function sendError(res, error) {
  const code = error.statusCode || 500;
  return res.status(code).json({
    msg: error.message || 'Error interno del servidor',
    code,
    data: null,
  });
}

export const authController = {
  login(req, res) {
    try {
      const result = authService.login(req.body || {});
      return res.status(200).json({
        msg: 'Inicio de sesión exitoso',
        code: 200,
        data: result,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  register(req, res) {
    try {
      const created = authService.register(req.body || {});
      return res.status(201).json({
        msg: 'Usuario registrado correctamente',
        code: 201,
        data: created,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  forgotPassword(req, res) {
    try {
      const result = authService.forgotPassword(req.body || {});
      return res.status(200).json({
        msg: 'Se enviaron las instrucciones de recuperación de contraseña al correo indicado.',
        code: 200,
        data: result,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  updateProfile(req, res) {
    try {
      const updated = authService.updateProfile(req.params.id, req.body || {});
      return res.status(200).json({
        msg: 'Perfil actualizado correctamente',
        code: 200,
        data: updated,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  listUsers(_req, res) {
    try {
      const users = authService.listUsers();
      return res.status(200).json({
        msg: 'Ok',
        code: 200,
        data: users,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },

  updateUserAdmin(req, res) {
    try {
      const updated = authService.updateUserAdmin(req.params.id, req.body || {});
      return res.status(200).json({
        msg: 'Permisos de usuario actualizados correctamente',
        code: 200,
        data: updated,
      });
    } catch (error) {
      return sendError(res, error);
    }
  },
};