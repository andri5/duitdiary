/**
 * DuitDiary - Forgot Password Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle, ArrowLeft, KeyRound, ExternalLink } from 'lucide-react';
import { AuthLayout, PageTransition } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { forgotPasswordSchema } from '@/lib/validations';
import type { ForgotPasswordFormData } from '@/lib/validations';
import { forgotPassword } from '@/services/auth.service';
import { ROUTES } from '@/lib/constants';
import { AxiosError } from 'axios';

export function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; resetUrl?: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await forgotPassword(data.email);
      setResult(response);
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || 'Gagal mengirim permintaan reset'
          : 'Terjadi kesalahan. Silakan coba lagi.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <AuthLayout
        title="Lupa Password"
        subtitle="Masukkan email akunmu untuk mengatur ulang password"
      >
        {result ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-accent/20 bg-accent-soft/40 px-4 py-3 text-sm text-ink">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <KeyRound className="h-4 w-4 text-accent" />
                Permintaan diterima
              </div>
              <p className="text-muted">{result.message}</p>
            </div>

            {result.resetUrl ? (
              <div className="space-y-3 rounded-2xl border border-line bg-mist/50 p-4">
                <p className="text-sm font-semibold text-ink">Mode development</p>
                <p className="text-xs text-muted">
                  SMTP belum dikonfigurasi. Tautan di bawah hanya muncul di development.
                </p>
                <Link to={result.resetUrl.replace(/^https?:\/\/[^/]+/, '')}>
                  <Button
                    variant="gradient"
                    className="w-full"
                    rightIcon={<ExternalLink className="h-4 w-4" />}
                  >
                    Atur Password Baru
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted">
                Jika email terdaftar, tautan reset dikirim ke kotak masuk. Periksa juga folder
                spam. Tautan berlaku 1 jam.
              </p>
            )}

            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke login
            </Link>
          </div>
        ) : (
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

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Kirim Tautan Reset
            </Button>

            <p className="text-center text-sm text-muted">
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke login
              </Link>
            </p>
          </form>
        )}
      </AuthLayout>
    </PageTransition>
  );
}
