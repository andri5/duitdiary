/**
 * DuitDiary - Category Form Component
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button, Input, ModalFooter } from '@/components/ui';
import { categorySchema } from '@/lib/validations';
import type { CategoryFormData } from '@/lib/validations';
import { useCategoryMutations } from '@/hooks';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

// Icon mapping - simple emoji for now
const iconEmojis: Record<string, string> = {
  'utensils': '🍽️',
  'car': '🚗',
  'shopping-bag': '🛍️',
  'gamepad-2': '🎮',
  'heart-pulse': '❤️',
  'graduation-cap': '🎓',
  'home': '🏠',
  'zap': '⚡',
  'plane': '✈️',
  'gift': '🎁',
  'more-horizontal': '📁',
};

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
      icon: CATEGORY_ICONS[0],
      color: CATEGORY_COLORS[0],
    },
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  // Populate form when editing
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        icon: category.icon || CATEGORY_ICONS[0],
        color: category.color || CATEGORY_COLORS[0],
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
    } catch (error) {
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

      {/* Color Picker */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Warna
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={cn(
                'h-8 w-8 rounded-full transition-transform',
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

      {/* Icon Picker */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Ikon
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', iconEmojis[icon] || '📁')}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl transition-colors',
                selectedIcon === (iconEmojis[icon] || '📁')
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              {iconEmojis[icon] || '📁'}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('icon')} />
      </div>

      {/* Preview */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Preview
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: selectedColor ? `${selectedColor}20` : '#f3f4f6',
            }}
          >
            <span className="text-xl" style={{ color: selectedColor }}>
              {selectedIcon || '📁'}
            </span>
          </div>
          <p className="font-medium text-gray-900">
            {watch('name') || 'Nama Kategori'}
          </p>
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
