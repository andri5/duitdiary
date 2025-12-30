/**
 * DuitDiary - Expense Form Page (Create/Edit)
 */

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { MainLayout, PageHeader } from '@/components/layout';
import { Card, CardContent, Button, Input, Select, Loading } from '@/components/ui';
import { expenseSchema } from '@/lib/validations';
import type { ExpenseFormData } from '@/lib/validations';
import { useExpense, useExpenseMutations, useCategories } from '@/hooks';
import { formatDateForInput } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

export function ExpenseFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: expense, isLoading: isExpenseLoading } = useExpense(id || '');
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { create: createMutation, update: updateMutation } = useExpenseMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      description: '',
      date: formatDateForInput(new Date()),
      categoryId: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      reset({
        amount: expense.amount,
        description: expense.description,
        date: formatDateForInput(expense.date),
        categoryId: expense.categoryId,
      });
    }
  }, [expense, reset]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({
          id,
          data: {
            ...data,
            date: new Date(data.date).toISOString(),
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          date: new Date(data.date).toISOString(),
        });
      }
      navigate(ROUTES.EXPENSES);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const categoryOptions = categories?.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })) || [];

  if (isEditing && isExpenseLoading) {
    return (
      <MainLayout>
        <Loading message="Memuat data pengeluaran..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={isEditing ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
        description={
          isEditing
            ? 'Perbarui informasi pengeluaran'
            : 'Catat pengeluaran baru'
        }
        action={
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.EXPENSES)}
          >
            Kembali
          </Button>
        }
      />

      <Card className="max-w-2xl">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Jumlah (Rp)"
              type="number"
              placeholder="Masukkan jumlah"
              error={errors.amount?.message}
              {...register('amount', { valueAsNumber: true })}
            />

            <Input
              label="Deskripsi"
              placeholder="Contoh: Makan siang di warteg"
              error={errors.description?.message}
              {...register('description')}
            />

            <Input
              label="Tanggal"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />

            <Select
              label="Kategori"
              placeholder="Pilih kategori"
              options={categoryOptions}
              disabled={isCategoriesLoading}
              error={errors.categoryId?.message}
              {...register('categoryId')}
            />

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Save className="h-4 w-4" />}
              >
                {isEditing ? 'Simpan Perubahan' : 'Tambah Pengeluaran'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(ROUTES.EXPENSES)}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
