import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendCreated, sendError, sendUnauthorized } from '../utils/response.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js';
import { config } from '../config/index.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../utils/validation.js';
import type { AuthenticatedRequest } from '../types/index.js';

function readRefreshFromRequest(req: Request): string | undefined {
  const bodyToken = (req.body as { refreshToken?: string } | undefined)?.refreshToken;
  if (bodyToken) return bodyToken;
  return (req as Request & { cookies?: Record<string, string> }).cookies?.[
    config.cookie.refreshName
  ];
}

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);
      setAuthCookies(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      sendCreated(res, result, 'Registration successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      if (message === 'Email already registered') {
        sendError(res, message, 409, 'EMAIL_EXISTS');
      } else {
        sendError(res, message, 400, 'REGISTRATION_FAILED');
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);
      setAuthCookies(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      if (
        message === 'Email atau password salah' ||
        message === 'Invalid email or password'
      ) {
        sendUnauthorized(res, 'Email atau password salah');
        return;
      }
      // Avoid leaking Prisma/DB internals to clients
      console.error('Login error:', message);
      sendError(res, 'Login gagal. Coba lagi sebentar.', 503, 'LOGIN_UNAVAILABLE');
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const refreshToken = readRefreshFromRequest(req);
      await authService.logout(userId, refreshToken);
      clearAuthCookies(res);
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      clearAuthCookies(res);
      const message = error instanceof Error ? error.message : 'Logout failed';
      sendError(res, message, 400, 'LOGOUT_FAILED');
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = readRefreshFromRequest(req);
      if (!refreshToken) {
        sendUnauthorized(res, 'Refresh token is required');
        return;
      }
      const result = await authService.refreshTokens(refreshToken);
      setAuthCookies(res, result);
      sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error) {
      clearAuthCookies(res);
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      sendUnauthorized(res, message);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const data: ForgotPasswordInput = req.body;
      const result = await authService.forgotPassword(data);
      sendSuccess(res, result, result.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Forgot password failed';
      sendError(res, message, 400, 'FORGOT_PASSWORD_FAILED');
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const data: ResetPasswordInput = req.body;
      const result = await authService.resetPassword(data);
      clearAuthCookies(res);
      sendSuccess(res, result, result.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reset password failed';
      sendError(res, message, 400, 'RESET_PASSWORD_FAILED');
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const user = await authService.getMe(userId);
      sendSuccess(res, user, 'OK');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load profile';
      if (message === 'User not found') {
        sendUnauthorized(res, message);
      } else {
        sendError(res, message, 400, 'PROFILE_FAILED');
      }
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const data = req.body as { name?: string; currency?: string };
      const user = await authService.updateProfile(userId, data);
      sendSuccess(res, user, 'Profil diperbarui');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      sendError(res, message, 400, 'PROFILE_UPDATE_FAILED');
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const data = req.body as { currentPassword: string; newPassword: string };
      const result = await authService.changePassword(userId, data);
      sendSuccess(res, result, result.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengubah password';
      if (message === 'User not found') {
        sendUnauthorized(res, message);
        return;
      }
      if (message === 'Password saat ini salah') {
        sendUnauthorized(res, message);
        return;
      }
      sendError(res, message, 400, 'CHANGE_PASSWORD_FAILED');
    }
  }
}

export const authController = new AuthController();
