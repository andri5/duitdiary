/**
 * API client — Bearer tokens in SecureStore (mobile)
 */

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { emitAppStatus } from './appStatus';

const ACCESS_KEY = 'dt_access';
const REFRESH_KEY = 'dt_refresh';

function hostFromExpo(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    // Legacy Expo Go manifest
    (Constants as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost;

  if (!hostUri) return null;
  const host = String(hostUri).split(':')[0]?.trim();
  if (!host) return null;
  // Tunnel / localhost cannot reach the API on the PC LAN
  if (
    host.includes('exp.direct') ||
    host.includes('exp.host') ||
    host === 'localhost' ||
    host === '127.0.0.1'
  ) {
    return null;
  }
  return host;
}

/** Prefer env, then Expo LAN host, then emulator defaults. */
function resolveApiBaseUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) {
    // If env points at localhost but we're on a device, prefer Expo LAN host.
    const looksLocal =
      fromEnv.includes('localhost') ||
      fromEnv.includes('127.0.0.1') ||
      fromEnv.includes('10.0.2.2');
    if (!looksLocal) return fromEnv;

    const expoHost = hostFromExpo();
    if (expoHost) return `http://${expoHost}:3001/api/v1`;
    return fromEnv;
  }

  const expoHost = hostFromExpo();
  if (expoHost) return `http://${expoHost}:3001/api/v1`;

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api/v1';
  }
  return 'http://localhost:3001/api/v1';
}

export const API_BASE_URL = resolveApiBaseUrl();

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

export const apiClient = api;

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
          type: 'server',
          message: 'Koneksi ke server terlalu lama. Pastikan API jalan dan HP satu Wi‑Fi dengan PC.',
        });
      } else {
        emitAppStatus({
          type: 'server',
          message: `Tidak bisa terhubung ke server (${API_BASE_URL}). Pastikan API jalan dan HP satu Wi‑Fi dengan PC.`,
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
          'Dompet Tenang sedang dalam perawatan. Silakan coba beberapa saat lagi.',
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
