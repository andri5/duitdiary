/**
 * Auth API helpers
 */

import { api, clearTokens, saveTokens } from './api';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  currency?: string;
};

export type AuthResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export async function login(email: string, password: string): Promise<AuthResult> {
  const { data } = await api.post('/auth/login', { email, password });
  const result = data.data as AuthResult;
  await saveTokens(result.accessToken, result.refreshToken);
  return result;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const { data } = await api.post('/auth/register', { name, email, password });
  const result = data.data as AuthResult;
  await saveTokens(result.accessToken, result.refreshToken);
  return result;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get('/auth/me');
  return data.data as User;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout', {});
  } finally {
    await clearTokens();
  }
}

export async function forgotPassword(email: string): Promise<string> {
  const { data } = await api.post('/auth/forgot-password', { email });
  return (data.message as string) || 'Jika email terdaftar, link reset akan dikirim.';
}

export async function updateProfile(input: {
  name?: string;
  currency?: string;
}): Promise<User> {
  const { data } = await api.put('/auth/profile', input);
  return data.data as User;
}
