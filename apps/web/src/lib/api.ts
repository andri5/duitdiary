/**
 * Axios API client — cookie session (web) + optional Bearer (mobile/legacy)
 */

import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from './constants';
import {
  clearTokens,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
} from './tokenStore';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Prefer Bearer when present (mobile / dual-mode); otherwise cookies carry the session
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData && config.headers) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete (config.headers as Record<string, unknown>)['Content-Type'];
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

const AUTH_NO_REFRESH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh',
  '/auth/refresh-token',
];

/** Frontend routes where a failed session must NOT hard-redirect to login */
const NO_LOGIN_REDIRECT_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/terms',
  '/privacy',
  '/help',
  '/maintenance',
  '/404',
];

function isAuthCredentialRequest(url?: string): boolean {
  if (!url) return false;
  return AUTH_NO_REFRESH_PATHS.some((path) => url.includes(path));
}

function shouldRedirectToLogin(): boolean {
  const path = window.location.pathname || '/';
  // Exact match for home; prefix match for nested public routes
  return !NO_LOGIN_REDIRECT_PATHS.some((p) =>
    p === '/' ? path === '/' : path === p || path.startsWith(`${p}/`)
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      isAuthCredentialRequest(originalRequest?.url)
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data || {};
        if (accessToken) setAccessToken(accessToken);
        if (newRefreshToken) setRefreshToken(newRefreshToken);

        if (accessToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        localStorage.removeItem(STORAGE_KEYS.USER);

        if (shouldRedirectToLogin()) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
