/**
 * DuitDiary - Auth Service
 * API calls for authentication
 */

import api from '@/lib/api';
import { STORAGE_KEYS } from '@/lib/constants';
import type {
  ApiResponse,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  User,
} from '@/types';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    data
  );
  return response.data.data;
}

/**
 * Login user
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    credentials
  );
  return response.data.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } finally {
    // Always clear local storage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(
  refreshToken: string
): Promise<AuthTokens> {
  const response = await api.post<ApiResponse<AuthTokens>>('/auth/refresh', {
    refreshToken,
  });
  return response.data.data;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}

/**
 * Request password reset
 */
export async function forgotPassword(
  email: string
): Promise<{ message: string; resetUrl?: string }> {
  const response = await api.post<
    ApiResponse<{ message: string; resetUrl?: string }>
  >('/auth/forgot-password', { email });
  return response.data.data;
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  password: string
): Promise<{ message: string }> {
  const response = await api.post<ApiResponse<{ message: string }>>(
    '/auth/reset-password',
    { token, password }
  );
  return response.data.data;
}

/**
 * Save auth data to local storage
 */
export function saveAuthData(data: AuthResponse): void {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
}

/**
 * Get stored user from local storage
 */
export function getStoredUser(): User | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}
