/**
 * DuitDiary - Login Page
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthLayout, PageTransition } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { loginSchema } from '@/lib/validations';
import type { LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/lib/constants';
import { SEO } from '@/components/SEO';
import { AxiosError } from 'axios';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const toast = useToast();
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
      toast.success('Login berhasil!', 'Selamat datang kembali');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const apiMessage =
        err instanceof AxiosError
          ? (err.response?.data as { message?: string } | undefined)?.message
          : err instanceof Error
            ? err.message
            : undefined;
      const errorMessage =
        apiMessage && apiMessage !== 'No refresh token'
          ? apiMessage
          : 'Email atau password salah. Silakan coba lagi.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <PageTransition>
      <SEO title="Masuk" description="Login ke akun DuitDiary untuk mengelola keuangan pribadimu." canonical="/login" noIndex />
      <AuthLayout title="Masuk" subtitle="Lanjutkan pencatatan keuanganmu">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-coral/20 bg-coral-soft px-3 py-3 text-sm text-ink">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-coral" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Masukkan password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted transition hover:text-ink"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-muted">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
              />
              <span>Ingat saya</span>
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="font-medium text-accent hover:underline"
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
            disabled={isLoading}
          >
            Masuk
          </Button>

          <p className="text-center text-sm text-muted">
            Belum punya akun?{' '}
            <Link to={ROUTES.REGISTER} className="font-semibold text-accent hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PageTransition>
  );
}
