/**
 * DuitDiary - Type Definitions
 * Central type definitions for the application
 */

// ============================================
// User Types
// ============================================
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// ============================================
// Category Types
// ============================================
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  expenseCount?: number; // Optional: count of expenses in this category
}

export interface CreateCategoryData {
  name: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  color?: string;
}

// ============================================
// Expense Types
// ============================================
export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  userId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseData {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}

export interface UpdateExpenseData {
  amount?: number;
  description?: string;
  date?: string;
  categoryId?: string;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// Dashboard Types
// ============================================
export interface DashboardSummary {
  totalExpenses: number;
  expenseCount: number;
  categoryBreakdown: CategoryBreakdown[];
  periodStart: string;
  periodEnd: string;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  total: number;
  count: number;
  percentage: number;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
