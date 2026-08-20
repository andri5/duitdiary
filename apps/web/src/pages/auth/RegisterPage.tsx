/**
 * Dompet Tenang - Register Page
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, Calendar } from 'lucide-react';
import { AuthLayout, PageTransition } from '@/components/layout';
import { TurnstileWidget } from '@/components/auth';
import { Button, Input } from '@/components/ui';
import { registerSchema } from '@/lib/validations';
import type { RegisterFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { useCaptchaConfig } from '@/hooks/useCaptchaConfig';
import { ROUTES } from '@/lib/constants';
import { SEO } from '@/components/SEO';
import { authErrorMessage, AUTH_SAFE } from '@/lib/authErrors';
import { GENDER_OPTIONS } from '@/lib/gender';
import { cn } from '@/lib/utils';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const toast = useToast();
  const { data: captcha, isLoading: captchaLoading, isError: captchaFetchError } =
    useCaptchaConfig();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);

  const captchaRequired = Boolean(captcha?.enabled && captcha.siteKey);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedGender = watch('gender');

  const onSubmit = async (data: RegisterFormData) => {
    if (!termsAccepted) {
      toast.warning('Silakan setujui Syarat & Ketentuan');
      return;
    }
    if (captchaRequired && !captchaToken) {
      toast.warning('Selesaikan verifikasi captcha dulu');
      return;
    }

    setError(null);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        gender: data.gender,
        birthDate: data.birthDate,
        ...(captchaToken ? { captchaToken } : {}),
      });
      toast.success('Selamat datang di Dompet Tenang', 'Pendaftaran berhasil!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const errorMessage = authErrorMessage(err, AUTH_SAFE.registerFailed);
      setError(errorMessage);
      toast.error(errorMessage);
      setCaptchaToken(null);
      setCaptchaReset((n) => n + 1);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Za-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    if (pwd.length >= 12) strength++;
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
      <SEO title="Daftar" description="Buat akun Dompet Tenang gratis. Mulai catat keuangan pribadimu sekarang." canonical="/register" />
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
            <p className="mb-2 text-sm font-medium text-ink">Jenis kelamin</p>
            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map((opt) => {
                const active = selectedGender === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue('gender', opt.value, { shouldValidate: true })}
                    className={cn(
                      'rounded-2xl border px-2 py-2.5 text-center text-xs font-semibold transition sm:text-sm',
                      active
                        ? 'border-accent bg-accent-soft text-accent'
                        : 'border-line bg-surface text-muted hover:border-accent/40'
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {errors.gender?.message && (
              <p className="mt-1 text-xs text-coral">{errors.gender.message}</p>
            )}
          </div>

          <Input
            label="Tanggal lahir"
            type="date"
            leftIcon={<Calendar className="h-4 w-4" />}
            error={errors.birthDate?.message}
            {...register('birthDate')}
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 karakter (huruf + angka)"
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
            <p className="mt-2 text-xs text-muted">
              Contoh: <span className="font-semibold text-ink">RapatKamis7!</span>
            </p>
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

          {captchaLoading && (
            <p className="text-center text-xs text-muted">Memuat captcha…</p>
          )}
          {captchaFetchError && (
            <p className="text-xs text-coral">
              Gagal memuat konfigurasi captcha. Refresh halaman atau periksa API.
            </p>
          )}
          {captcha?.misconfigured && (
            <p className="text-xs text-amber-700">
              Captcha diaktifkan admin tetapi kunci Turnstile belum diset di server.
            </p>
          )}

          {captchaRequired && captcha.siteKey && (
            <TurnstileWidget
              key={captchaReset}
              siteKey={captcha.siteKey}
              onToken={setCaptchaToken}
              className="flex justify-center overflow-visible"
            />
          )}

          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            <span>
              Saya setuju dengan{' '}
              <Link to={ROUTES.TERMS} className="font-semibold text-accent hover:underline">
                Syarat & Ketentuan
              </Link>{' '}
              dan{' '}
              <Link to={ROUTES.PRIVACY} className="font-semibold text-accent hover:underline">
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
            disabled={isLoading || !termsAccepted || (captchaRequired && !captchaToken)}
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
