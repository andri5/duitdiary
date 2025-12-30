import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware, validate } from '../middlewares/index.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validation.js';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validate(registerSchema),
  (req, res) => authController.register(req, res)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validate(loginSchema),
  (req, res) => authController.login(req, res)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  '/logout',
  authMiddleware,
  (req, res) => authController.logout(req, res)
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  (req, res) => authController.refreshToken(req, res)
);

export default router;
