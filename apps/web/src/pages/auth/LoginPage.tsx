/**
 * DuitDiary - Login Page
 * Modern glassmorphism design with animations and enhanced validation
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { loginSchema } from '@/lib/validations';
import type { LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { ROUTES } from '@/lib/constants';
import { AxiosError } from 'axios';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 300 },
  },
};

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
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch('email');
  const isEmailValid = emailValue && !errors.email;

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data);
      toast.success('Login berhasil!', 'Selamat datang kembali');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Login gagal. Periksa email dan password.'
        : 'Terjadi kesalahan. Silakan coba lagi.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout
      title="Masuk ke DuitDiary"
      subtitle="Kelola pengeluaran harianmu dengan mudah"
    >
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-4 sm:space-y-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {error && (
          <motion.div 
            className="flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-100 backdrop-blur-sm sm:p-4 sm:text-base"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="relative">
          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            variant="glass"
            leftIcon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
            rightIcon={isEmailValid && <CheckCircle className="h-4 w-4 text-green-400" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
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
        </motion.div>

        <motion.div 
          className="flex items-center justify-between text-sm"
          variants={itemVariants}
        >
          <label className="flex cursor-pointer items-center gap-2 text-white/80 transition-colors hover:text-white">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span>Ingat saya</span>
          </label>
          <Link
            to="#"
            className="text-white/80 transition-colors hover:text-white hover:underline"
          >
            Lupa password?
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
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
        </motion.div>

        <motion.p 
          className="text-center text-sm text-white/70 sm:text-base"
          variants={itemVariants}
        >
          Belum punya akun?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="font-semibold text-white transition-colors hover:underline"
          >
            Daftar sekarang
          </Link>
        </motion.p>
      </motion.form>
    </AuthLayout>
  );
}
