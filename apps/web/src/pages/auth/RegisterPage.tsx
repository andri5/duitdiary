/**
 * DuitDiary - Register Page
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { AuthLayout, PageTransition } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { registerSchema } from '@/lib/validations';
import type { RegisterFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/lib/constants';
import { AxiosError } from 'axios';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!termsAccepted) {
      toast.warning('Silakan setujui Syarat & Ketentuan');
      return;
    }

    setError(null);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Pendaftaran berhasil!', 'Selamat datang di DuitDiary');
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
          : 'Pendaftaran gagal. Silakan coba lagi.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = [
    'bg-coral',
    'bg-orange-500',
    'bg-amber',
    'bg-lime-500',
    'bg-lime',
  ];
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];

  return (
    <PageTransition>
      <AuthLayout title="Buat akun" subtitle="Mulai catat pengeluaran dalam hitungan detik">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-coral/20 bg-coral-soft px-3 py-3 text-sm text-ink">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-coral" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Nama Lengkap"
            type="text"
            placeholder="Nama lengkap"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 6 karakter"
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
              {...register('password', {
                onChange: (e) => setPassword(e.target.value),
              })}
            />
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : 'bg-mist-deep'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">
                  Kekuatan:{' '}
                  {passwordStrength > 0
                    ? strengthLabels[passwordStrength - 1]
                    : 'Sangat Lemah'}
                </p>
              </div>
            )}
          </div>

          <Input
            label="Konfirmasi Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Ulangi password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted transition hover:text-ink"
                aria-label={
                  showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            <span>
              Saya setuju dengan{' '}
              <span className="font-semibold text-accent">Syarat & Ketentuan</span> dan{' '}
              <span className="font-semibold text-accent">Kebijakan Privasi</span>
            </span>
          </label>

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading || !termsAccepted}
          >
            Daftar Sekarang
          </Button>

          <p className="text-center text-sm text-muted">
            Sudah punya akun?{' '}
            <Link to={ROUTES.LOGIN} className="font-semibold text-accent hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PageTransition>
  );
}
