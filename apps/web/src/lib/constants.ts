/**
 * DuitDiary - Application Constants
 */

// API Configuration
export const API_ORIGIN = 'http://localhost:3001';
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;

/** Resolve uploaded file path to absolute URL */
export function resolveUploadUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'duitdiary_access_token',
  REFRESH_TOKEN: 'duitdiary_refresh_token',
  USER: 'duitdiary_user',
  THEME: 'duitdiary_theme',
} as const;

export type AppTheme = 'neo' | 'midnight' | 'ocean';

export const THEME_OPTIONS: {
  id: AppTheme;
  name: string;
  description: string;
}[] = [
  {
    id: 'neo',
    name: 'Neo Ledger',
    description: 'Teal terang, bersih, dan fokus',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Gelap nyaman untuk malam hari',
  },
  {
    id: 'ocean',
    name: 'Ocean Mist',
    description: 'Biru laut lembut dan sejuk',
  },
];


// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd MMM yyyy',
  DISPLAY_FULL: 'dd MMMM yyyy',
  DISPLAY_WITH_TIME: 'dd MMM yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  API: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

// Currency
export const CURRENCY = {
  CODE: 'IDR',
  SYMBOL: 'Rp',
  LOCALE: 'id-ID',
} as const;

// Category Colors
export const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
] as const;

// Category Icons (Lucide keys — keep in sync with CategoryIcon)
export const CATEGORY_ICONS = [
  'utensils',
  'car',
  'shopping-bag',
  'gamepad-2',
  'heart-pulse',
  'graduation-cap',
  'home',
  'zap',
  'plane',
  'gift',
  'wallet',
  'banknote',
  'briefcase',
  'laptop',
  'line-chart',
  'piggy-bank',
  'sparkles',
  'more-horizontal',
] as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  EXPENSE_NEW: '/expenses/new',
  EXPENSE_EDIT: '/expenses/:id/edit',
  INCOMES: '/incomes',
  INCOME_NEW: '/incomes/new',
  INCOME_EDIT: '/incomes/:id/edit',
  CATEGORIES: '/categories',
  SETTINGS: '/settings',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  USER: ['user'],
  CATEGORIES: ['categories'],
  EXPENSES: ['expenses'],
  EXPENSE: (id: string) => ['expense', id],
  INCOMES: ['incomes'],
  INCOME: (id: string) => ['income', id],
  DASHBOARD: ['dashboard'],
  DASHBOARD_SUMMARY: (period: string) => ['dashboard', 'summary', period],
} as const;

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  AMOUNT_MIN: 0,
  AMOUNT_MAX: 999999999999,
} as const;
