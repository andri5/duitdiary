/**
 * DuitDiary - Application Constants
 */

// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api/v1';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'duitdiary_access_token',
  REFRESH_TOKEN: 'duitdiary_refresh_token',
  USER: 'duitdiary_user',
} as const;

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

// Category Icons
export const CATEGORY_ICONS = [
  'utensils',      // Food
  'car',           // Transportation
  'shopping-bag',  // Shopping
  'gamepad-2',     // Entertainment
  'heart-pulse',   // Health
  'graduation-cap',// Education
  'home',          // Housing
  'zap',           // Utilities
  'plane',         // Travel
  'gift',          // Gifts
  'more-horizontal',// Other
] as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  EXPENSE_NEW: '/expenses/new',
  EXPENSE_EDIT: '/expenses/:id/edit',
  CATEGORIES: '/categories',
  SETTINGS: '/settings',
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  USER: ['user'],
  CATEGORIES: ['categories'],
  EXPENSES: ['expenses'],
  EXPENSE: (id: string) => ['expense', id],
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
