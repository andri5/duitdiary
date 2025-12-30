/**
 * DuitDiary - Register Page
 * Modern glassmorphism design
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { registerSchema } from '@/lib/validations';
import type { RegisterFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores';
import { ROUTES } from '@/lib/constants';
import { AxiosError } from 'axios';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  // Password strength indicator
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
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];

  return (
    <AuthLayout
      title="Daftar DuitDiary"
      subtitle="Buat akun dan mulai catat pengeluaranmu"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-100 backdrop-blur-sm sm:p-4 sm:text-base">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Nama Lengkap"
          type="text"
          placeholder="Masukkan nama lengkap"
          variant="glass"
          leftIcon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="nama@email.com"
          variant="glass"
          leftIcon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 6 karakter"
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
            {...register('password', {
              onChange: (e) => setPassword(e.target.value),
            })}
          />
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-white/60">
                Kekuatan: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Sangat Lemah'}
              </p>
            </div>
          )}
        </div>

        <Input
          label="Konfirmasi Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Ulangi password"
          variant="glass"
          leftIcon={<Lock className="h-4 w-4 sm:h-5 sm:w-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-white/60 transition-colors hover:text-white"
              aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Terms Checkbox */}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-white/80">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
          />
          <span>
            Saya setuju dengan{' '}
            <Link to="#" className="text-white underline hover:no-underline">
              Syarat & Ketentuan
            </Link>{' '}
            dan{' '}
            <Link to="#" className="text-white underline hover:no-underline">
              Kebijakan Privasi
            </Link>
          </span>
        </label>

        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Daftar Sekarang
        </Button>

        <p className="text-center text-sm text-white/70 sm:text-base">
          Sudah punya akun?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-white transition-colors hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
