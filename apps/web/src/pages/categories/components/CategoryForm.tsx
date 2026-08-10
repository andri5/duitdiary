/**
 * DuitDiary - Category Form Component
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button, Input, ModalFooter, CategoryIcon, CATEGORY_ICON_OPTIONS } from '@/components/ui';
import { categorySchema } from '@/lib/validations';
import type { CategoryFormData } from '@/lib/validations';
import { useCategoryMutations } from '@/hooks';
import { CATEGORY_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const isEditing = !!category;
  const { create: createMutation, update: updateMutation } = useCategoryMutations();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: CATEGORY_ICON_OPTIONS[0],
      color: CATEGORY_COLORS[0],
      type: 'EXPENSE',
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');
  const selectedType = watch('type');

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        icon: category.icon || CATEGORY_ICON_OPTIONS[0],
        color: category.color || CATEGORY_COLORS[0],
        type: category.type || 'EXPENSE',
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        await updateMutation.mutateAsync({
          id: category.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Nama Kategori"
        placeholder="Contoh: Makanan, Transport, dll"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink">Jenis</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'EXPENSE', label: 'Pengeluaran' },
            { value: 'INCOME', label: 'Pemasukan' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue('type', option.value as 'EXPENSE' | 'INCOME')}
              className={cn(
                'rounded-xl border px-3 py-2.5 text-sm font-semibold transition',
                selectedType === option.value
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-surface text-muted hover:border-accent/40'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('type')} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink">Warna</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={cn(
                'h-8 w-8 rounded-xl transition-transform',
                selectedColor === color && 'scale-110 ring-2 ring-offset-2'
              )}
              style={{
                backgroundColor: color,
                // @ts-expect-error ringColor is a custom CSS property
                '--tw-ring-color': color,
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink">Ikon</label>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {CATEGORY_ICON_OPTIONS.map((icon) => {
            const active = selectedIcon === icon;
            return (
              <button
                key={icon}
                type="button"
                onClick={() => setValue('icon', icon, { shouldValidate: true })}
                className={cn(
                  'flex h-11 w-full items-center justify-center rounded-2xl border transition',
                  active
                    ? 'border-accent bg-accent-soft text-accent shadow-sm shadow-accent/15'
                    : 'border-line bg-mist/40 text-ink hover:border-accent/40 hover:bg-accent-soft/40'
                )}
                aria-label={`Pilih ikon ${icon}`}
              >
                <CategoryIcon icon={icon} size={18} />
              </button>
            );
          })}
        </div>
        <input type="hidden" {...register('icon')} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink">Preview</label>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-mist/50 p-4">
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: selectedColor ? `${selectedColor}22` : '#e6edf4',
              color: selectedColor || '#0f9b8e',
            }}
          >
            <CategoryIcon icon={selectedIcon} size={22} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-ink">
              {watch('name') || 'Nama Kategori'}
            </p>
            <p className="text-xs text-muted">
              {selectedType === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
            </p>
          </div>
        </div>
      </div>

      <ModalFooter className="border-t-0 pt-0">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {isEditing ? 'Simpan' : 'Tambah'}
        </Button>
      </ModalFooter>
    </form>
  );
}
