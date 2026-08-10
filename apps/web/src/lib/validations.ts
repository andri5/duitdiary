/**
 * DuitDiary - Zod Validation Schemas
 */

import { z } from 'zod';
import { VALIDATION } from '@/lib/constants';

// Auth Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(
      VALIDATION.PASSWORD_MIN_LENGTH,
      `Password minimal ${VALIDATION.PASSWORD_MIN_LENGTH} karakter`
    ),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nama wajib diisi')
      .min(
        VALIDATION.NAME_MIN_LENGTH,
        `Nama minimal ${VALIDATION.NAME_MIN_LENGTH} karakter`
      )
      .max(
        VALIDATION.NAME_MAX_LENGTH,
        `Nama maksimal ${VALIDATION.NAME_MAX_LENGTH} karakter`
      ),
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    password: z
      .string()
      .min(1, 'Password wajib diisi')
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `Password minimal ${VALIDATION.PASSWORD_MIN_LENGTH} karakter`
      ),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password wajib diisi')
      .min(
        VALIDATION.PASSWORD_MIN_LENGTH,
        `Password minimal ${VALIDATION.PASSWORD_MIN_LENGTH} karakter`
      ),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

// Category Schemas
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nama kategori wajib diisi')
    .max(50, 'Nama kategori maksimal 50 karakter'),
  icon: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(['EXPENSE', 'INCOME']),
});

// Expense Schemas
export const expenseSchema = z.object({
  amount: z
    .number({ message: 'Jumlah harus berupa angka' })
    .min(VALIDATION.AMOUNT_MIN, 'Jumlah harus lebih dari 0')
    .max(VALIDATION.AMOUNT_MAX, 'Jumlah terlalu besar'),
  description: z
    .string()
    .min(1, 'Deskripsi wajib diisi')
    .max(
      VALIDATION.DESCRIPTION_MAX_LENGTH,
      `Deskripsi maksimal ${VALIDATION.DESCRIPTION_MAX_LENGTH} karakter`
    ),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  receiptUrl: z.string().max(500).optional().nullable(),
});

// Types from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
