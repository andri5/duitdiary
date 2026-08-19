import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../utils/prisma.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  parseExpiresIn,
} from '../utils/jwt.js';
import { config } from '../config/index.js';
import { isSmtpConfigured, sendPasswordResetEmail } from './email.service.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../utils/validation.js';
import type { AuthResponse, UserResponse } from '../types/index.js';

export class AuthService {
  async register(data: RegisterInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: this.formatUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Email atau password salah');
    }

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: this.formatUser(user),
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new Error('Refresh token expired');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    await this.saveRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Create a password reset token.
   * Always returns a generic message (no email enumeration).
   * resetUrl is only included in development when EXPOSE_PASSWORD_RESET_URL is enabled.
   */
  async forgotPassword(
    data: ForgotPasswordInput
  ): Promise<{ message: string; resetUrl?: string }> {
    const email = data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    const generic = {
      message:
        'Jika email terdaftar, tautan reset password akan dikirim. Periksa kotak masuk atau folder spam.',
    };

    if (!user) {
      return generic;
    }

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `${config.appUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;

    try {
      if (isSmtpConfigured()) {
        await sendPasswordResetEmail({
          to: user.email,
          name: user.name,
          resetUrl,
        });
      } else if (config.isProduction) {
        console.error('[password-reset] SMTP not configured; email not sent');
      } else {
        console.warn('[password-reset] SMTP off — email not sent');
      }
    } catch (err) {
      console.error('[password-reset] Failed to send email', err);
      // Still return generic message (no enumeration / no leak)
    }

    if (config.exposePasswordResetUrl) {
      console.log(`[password-reset:dev] ${user.email} → ${resetUrl}`);
      return { ...generic, resetUrl };
    }

    return generic;
  }

  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    const tokenHash = crypto.createHash('sha256').update(data.token).digest('hex');

    const record = await prisma.passwordResetToken.findUnique({
      where: { token: tokenHash },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new Error('Token reset tidak valid atau sudah kedaluwarsa');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      prisma.refreshToken.deleteMany({
        where: { userId: record.userId },
      }),
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: record.userId,
          id: { not: record.id },
        },
      }),
    ]);

    return { message: 'Password berhasil diubah. Silakan masuk dengan password baru.' };
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        currency: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatUser(user);
  }

  async updateProfile(
    userId: string,
    data: { name?: string; currency?: string }
  ): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        currency: true,
        role: true,
        createdAt: true,
      },
    });

    return this.formatUser(user);
  }

  async changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string }
  ): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      throw new Error('Password saat ini salah');
    }

    if (data.currentPassword === data.newPassword) {
      throw new Error('Password baru harus berbeda dari password saat ini');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password berhasil diubah' };
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date(Date.now() + parseExpiresIn(config.jwt.refreshExpiresIn));

    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  private formatUser(user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    currency: string;
    role?: string;
    createdAt: Date;
  }): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      currency: user.currency,
      role: user.role || 'USER',
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
