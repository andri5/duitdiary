/**
 * Dashboard / expense / category / market API clients
 */

import { api } from './api';

export type TxType = 'EXPENSE' | 'INCOME';

export type Category = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  type: TxType;
};

export type Transaction = {
  id: string;
  type: TxType;
  amount: number;
  description: string;
  note?: string | null;
  date: string;
  categoryId: string;
  category: {
    id?: string;
    name?: string;
    icon?: string | null;
    color?: string | null;
    type?: TxType;
  };
  receiptUrl?: string | null;
};

export type DashboardSummary = {
  period: string;
  periodStart: string;
  periodEnd: string;
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  expenseCount: number;
  incomeCount: number;
  recentExpenses?: Transaction[];
  recentIncomes?: Transaction[];
};

export type MarketQuotes = {
  usdIdr: { rate: number; updatedAt?: string; source?: string };
  gold: {
    sellPerGram: number;
    buybackPerGram?: number;
    label?: string;
    updatedAt?: string;
  };
  fetchedAt?: string;
};

export const CATEGORY_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
] as const;

export const CATEGORY_ICONS = [
  'utensils',
  'car',
  'shopping-bag',
  'gamepad-2',
  'heart-pulse',
  'home',
  'wallet',
  'banknote',
  'briefcase',
  'more-horizontal',
] as const;

function normalizeTx(raw: Record<string, unknown>): Transaction {
  const category = (raw.category as Record<string, unknown>) || {};
  const dateRaw = String(raw.date || '');
  return {
    id: String(raw.id),
    type: (raw.type as TxType) || 'EXPENSE',
    amount: Number(raw.amount),
    description: String(raw.description || raw.note || ''),
    note: (raw.note as string) ?? null,
    date: dateRaw.slice(0, 10),
    categoryId: String(raw.categoryId || category.id || ''),
    category: {
      id: category.id as string | undefined,
      name: category.name as string | undefined,
      icon: (category.icon as string) ?? null,
      color: (category.color as string) ?? null,
      type: (category.type as TxType) || (raw.type as TxType) || 'EXPENSE',
    },
    receiptUrl: (raw.receiptUrl as string) ?? null,
  };
}

export async function getDashboardSummary(
  period: 'week' | 'month' | 'year' = 'month'
): Promise<DashboardSummary> {
  const { data } = await api.get(`/dashboard/summary?period=${period}`);
  return data.data as DashboardSummary;
}

export async function getMarketQuotes(): Promise<MarketQuotes | null> {
  try {
    const { data } = await api.get('/market/quotes');
    return (data.data || null) as MarketQuotes | null;
  } catch {
    return null;
  }
}

export async function getCategories(type?: TxType): Promise<Category[]> {
  const qs = type ? `?type=${type}` : '';
  const { data } = await api.get(`/categories${qs}`);
  return (data.data || []) as Category[];
}

export async function createCategory(input: {
  name: string;
  type: TxType;
  color: string;
  icon: string;
}): Promise<Category> {
  const { data } = await api.post('/categories', input);
  return data.data as Category;
}

export async function updateCategory(
  id: string,
  input: Partial<{ name: string; type: TxType; color: string; icon: string }>
): Promise<Category> {
  const { data } = await api.put(`/categories/${id}`, input);
  return data.data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}

export async function getTransactions(opts?: {
  page?: number;
  limit?: number;
  type?: TxType;
}): Promise<{ items: Transaction[]; total: number }> {
  const params = new URLSearchParams();
  params.set('page', String(opts?.page ?? 1));
  params.set('limit', String(opts?.limit ?? 30));
  params.set('sortBy', 'date');
  params.set('sortOrder', 'desc');
  if (opts?.type) params.set('type', opts.type);

  const { data } = await api.get(`/expenses?${params.toString()}`);
  const items = ((data.data || []) as Record<string, unknown>[]).map(normalizeTx);
  const total = (data.meta?.total as number) ?? items.length;
  return { items, total };
}

export async function getTransaction(id: string): Promise<Transaction> {
  const { data } = await api.get(`/expenses/${id}`);
  return normalizeTx(data.data as Record<string, unknown>);
}

export async function createTransaction(input: {
  amount: number;
  categoryId: string;
  type: TxType;
  date: string;
  description?: string;
}): Promise<Transaction> {
  const { data } = await api.post('/expenses', {
    amount: input.amount,
    categoryId: input.categoryId,
    type: input.type,
    date: input.date.slice(0, 10),
    note: input.description || undefined,
    description: input.description || undefined,
  });
  return normalizeTx(data.data as Record<string, unknown>);
}

export async function updateTransaction(
  id: string,
  input: {
    amount: number;
    categoryId: string;
    type: TxType;
    date: string;
    description?: string;
  }
): Promise<Transaction> {
  const { data } = await api.put(`/expenses/${id}`, {
    amount: input.amount,
    categoryId: input.categoryId,
    type: input.type,
    date: input.date.slice(0, 10),
    note: input.description || undefined,
    description: input.description || undefined,
  });
  return normalizeTx(data.data as Record<string, unknown>);
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
