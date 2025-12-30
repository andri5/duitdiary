/**
 * DuitDiary - Category Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category.service';
import type { CreateCategoryData, UpdateCategoryData } from '@/types';
import { useUIStore } from '@/stores';

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: getCategories,
  });
}

/**
 * Hook for category mutations (create, update, delete)
 */
export function useCategoryMutations() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryData) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      addNotification({
        type: 'success',
        title: 'Kategori berhasil ditambahkan',
      });
    },
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Gagal menambahkan kategori',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      addNotification({
        type: 'success',
        title: 'Kategori berhasil diperbarui',
      });
    },
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Gagal memperbarui kategori',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES });
      addNotification({
        type: 'success',
        title: 'Kategori berhasil dihapus',
      });
    },
    onError: () => {
      addNotification({
        type: 'error',
        title: 'Gagal menghapus kategori',
      });
    },
  });

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}
