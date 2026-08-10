import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendCreated, sendError, sendUnauthorized } from '../utils/response.js';
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../utils/validation.js';
import type { AuthenticatedRequest } from '../types/index.js';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);
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
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      sendUnauthorized(res, message);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = (req as AuthenticatedRequest).user!;
      const { refreshToken } = req.body;
      await authService.logout(userId, refreshToken);
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      sendError(res, message, 400, 'LOGOUT_FAILED');
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenInput = req.body;
      const result = await authService.refreshTokens(refreshToken);
      sendSuccess(res, result, 'Token refreshed successfully');
    } catch (error) {
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
      sendSuccess(res, result, result.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Reset password failed';
      sendError(res, message, 400, 'RESET_PASSWORD_FAILED');
    }
  }
}

export const authController = new AuthController();
