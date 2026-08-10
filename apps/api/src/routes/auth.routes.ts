import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware, validate } from '../middlewares/index.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation.js';

const router = Router();

router.post(
  '/register',
  validate(registerSchema),
  (req, res) => authController.register(req, res)
);

router.post(
  '/login',
  validate(loginSchema),
  (req, res) => authController.login(req, res)
);

router.post(
  '/logout',
  authMiddleware,
  (req, res) => authController.logout(req, res)
);

router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  (req, res) => authController.refreshToken(req, res)
);

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  (req, res) => authController.forgotPassword(req, res)
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  (req, res) => authController.resetPassword(req, res)
);

export default router;
