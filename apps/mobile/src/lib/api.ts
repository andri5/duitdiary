/**
 * API client — Bearer tokens in SecureStore (mobile)
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { emitAppStatus } from './appStatus';

const ACCESS_KEY = 'dd_access';
const REFRESH_KEY = 'dd_refresh';

/** Android emulator → host machine; device/iOS sim → LAN or localhost */
function defaultApiUrl() {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api/v1';
  }
  return 'http://localhost:3001/api/v1';
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || defaultApiUrl();

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status as number | undefined;
    const code = error.code as string | undefined;
    const apiCode = error.response?.data?.code as string | undefined;
    const apiMessage = error.response?.data?.message as string | undefined;

    if (!error.response) {
      if (code === 'ECONNABORTED') {
        emitAppStatus({
          type: 'offline',
          message: 'Koneksi terlalu lama. Periksa internet lalu coba lagi.',
        });
      } else {
        emitAppStatus({
          type: 'offline',
          message: 'Tidak bisa terhubung ke server. Periksa internet kamu.',
        });
      }
    } else if (
      status === 503 ||
      apiCode === 'MAINTENANCE' ||
      apiCode === 'LOGIN_UNAVAILABLE'
    ) {
      emitAppStatus({
        type: 'maintenance',
        message:
          apiMessage ||
          'DuitDiary sedang dalam perawatan. Silakan coba beberapa saat lagi.',
      });
    }

    const original = error.config;
    if (status === 401 && original && !original._retry) {
      original._retry = true;
      const refresh = await getRefreshToken();
      if (!refresh) {
        await clearTokens();
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken: refresh,
        });
        const accessToken = data.data.accessToken as string;
        const refreshToken = data.data.refreshToken as string;
        await saveTokens(accessToken, refreshToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (e) {
        await clearTokens();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);
