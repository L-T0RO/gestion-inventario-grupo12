import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.put('/profile/:id', authController.updateProfile);
router.get('/users', authController.listUsers);
router.patch('/users/:id', authController.updateUserAdmin);

export default router;