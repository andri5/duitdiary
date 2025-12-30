/**
 * ============================================
 * DuitDiary API - Validation Schemas
 * ============================================
 * Zod validation schemas for request validation.
 * Used with validate middleware to validate request body/query.
 * 
 * @see https://zod.dev/ for Zod documentation
 * ============================================
 */

import { z } from 'zod';

// ==================== AUTH SCHEMAS ====================

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ==================== USER SCHEMAS ====================
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  currency: z
    .string()
    .length(3, 'Currency must be exactly 3 characters')
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'New password must be less than 100 characters'),
});

// ==================== CATEGORY SCHEMAS ====================
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters'),
  icon: z
    .string()
    .min(1, 'Icon is required')
    .max(10, 'Icon must be less than 10 characters'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format. Use hex format: #RRGGBB'),
});

export const updateCategorySchema = createCategorySchema.partial();

// ==================== EXPENSE SCHEMAS ====================
export const createExpenseSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(999999999999.99, 'Amount is too large'),
  categoryId: z.string().uuid('Invalid category ID'),
  note: z.string().max(1000, 'Note must be less than 1000 characters').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ==================== BUDGET SCHEMAS ====================
export const createBudgetSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
  totalBudget: z
    .number()
    .positive('Total budget must be positive')
    .max(999999999999.99, 'Total budget is too large'),
  categoryBudgets: z
    .array(
      z.object({
        categoryId: z.string().uuid('Invalid category ID'),
        amount: z
          .number()
          .positive('Amount must be positive')
          .max(999999999999.99, 'Amount is too large'),
      })
    )
    .optional(),
});

export const updateBudgetSchema = createBudgetSchema.partial();

// ==================== TYPE EXPORTS ====================
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
