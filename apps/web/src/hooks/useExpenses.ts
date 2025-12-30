/**
 * DuitDiary - Expense Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from '@/services/expense.service';
import type {
  CreateExpenseData,
  ExpenseFilters,
  UpdateExpenseData,
} from '@/types';
import { useUIStore } from '@/stores';

/**
 * Hook to fetch expenses with filters
 */
export function useExpenses(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.EXPENSES, filters],
    queryFn: () => getExpenses(filters),
  });
}

/**
 * Hook to fetch a single expense
 */
export function useExpense(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.EXPENSE(id),
    queryFn: () => getExpense(id),
    enabled: !!id,
  });
}

/**
 * Hook for expense mutations (create, update, delete)
 */
export function useExpenseMutations() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const createMutation = useMutation({
    mutationFn: (data: CreateExpenseData) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      addNotification({
        type: 'success',
        title: 'Pengeluaran berhasil ditambahkan',
      });
    },
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Gagal menambahkan pengeluaran',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseData }) =>
      updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPENSE(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      addNotification({
        type: 'success',
        title: 'Pengeluaran berhasil diperbarui',
      });
    },
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Gagal memperbarui pengeluaran',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      addNotification({
        type: 'success',
        title: 'Pengeluaran berhasil dihapus',
      });
    },
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Gagal menghapus pengeluaran',
      });
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}
