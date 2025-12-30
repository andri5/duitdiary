/**
 * DuitDiary - Login Page
 * Modern glassmorphism design with gradient
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { loginSchema } from '@/lib/validations';
import type { LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/lib/constants';
import { AxiosError } from 'axios';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  return (
    <AuthLayout
      title="Masuk ke DuitDiary"
      subtitle="Kelola pengeluaran harianmu dengan mudah"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-100 backdrop-blur-sm sm:p-4 sm:text-base">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="nama@email.com"
          variant="glass"
          leftIcon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Masukkan password"
          variant="glass"
          leftIcon={<Lock className="h-4 w-4 sm:h-5 sm:w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/60 transition-colors hover:text-white"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-white/80">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span>Ingat saya</span>
          </label>
          <Link
            to="#"
            className="text-white/80 transition-colors hover:text-white hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Masuk
        </Button>

        <p className="text-center text-sm text-white/70 sm:text-base">
          Belum punya akun?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-semibold text-white transition-colors hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
