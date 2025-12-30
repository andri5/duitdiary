/**
 * ============================================
 * DuitDiary API - Type Definitions
 * ============================================
 * Shared TypeScript interfaces and types.
 * Used across controllers, services, and responses.
 * ============================================
 */

import { Request } from 'express';

// ==================== REQUEST TYPES ====================

/**
 * Express request with authenticated user data
 * @description Extended after auth middleware validation
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// ==================== PAGINATION ====================

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ==================== USER TYPES ====================

/**
 * User data for API responses (excludes sensitive data)
 */
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  currency: string;
  createdAt: Date;
}

/**
 * Authentication response with tokens
 */
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

// ==================== CATEGORY TYPES ====================

/**
 * Category data for API responses
 */
export interface CategoryResponse {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  expenseCount?: number;
}

// ==================== EXPENSE TYPES ====================

/**
 * Expense data for API responses
 */
export interface ExpenseResponse {
  id: string;
  amount: number;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  note: string | null;
  date: string;
  receiptUrl: string | null;
  createdAt: Date;
}

// ==================== DASHBOARD TYPES ====================

/**
 * Dashboard summary data structure
 */
export interface DashboardSummary {
  /** Today's expense statistics */
  today: {
    total: number;
    count: number;
  };
  /** This week's expense statistics */
  thisWeek: {
    total: number;
    count: number;
  };
  /** This month's expense statistics */
  thisMonth: {
    total: number;
    count: number;
  };
  /** Recent expenses list */
  recentExpenses: ExpenseResponse[];
  /** Top spending categories */
  topCategories: {
    category: {
      name: string;
      icon: string;
      color: string;
    };
    total: number;
    percentage: number;
  }[];
}
