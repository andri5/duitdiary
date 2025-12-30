/**
 * DuitDiary - Expense Service
 * API calls for expense management
 */

import api from '@/lib/api';
import type {
  ApiResponse,
  CreateExpenseData,
  Expense,
  ExpenseFilters,
  PaginatedResponse,
  UpdateExpenseData,
} from '@/types';

/**
 * Get expenses with filters and pagination
 */
export async function getExpenses(
  filters?: ExpenseFilters
): Promise<PaginatedResponse<Expense>> {
  const params = new URLSearchParams();

  if (filters) {
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  }

  const response = await api.get<PaginatedResponse<Expense>>(
    `/expenses?${params.toString()}`
  );
  return response.data;
}

/**
 * Get a single expense by ID
 */
export async function getExpense(id: string): Promise<Expense> {
  const response = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);
  return response.data.data;
}

/**
 * Create a new expense
 */
export async function createExpense(
  data: CreateExpenseData
): Promise<Expense> {
  const response = await api.post<ApiResponse<Expense>>('/expenses', data);
  return response.data.data;
}

/**
 * Update an expense
 */
export async function updateExpense(
  id: string,
  data: UpdateExpenseData
): Promise<Expense> {
  const response = await api.put<ApiResponse<Expense>>(
    `/expenses/${id}`,
    data
  );
  return response.data.data;
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
