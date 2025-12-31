/**
 * DuitDiary - Register Page
 * Modern glassmorphism design with animations and password strength meter
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthLayout, PageTransition } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { registerSchema } from '@/lib/validations';
import type { RegisterFormData } from '@/lib/validations';
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
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const nameValue = watch('name');
  const emailValue = watch('email');
  const isNameValid = nameValue && !errors.name;
  const isEmailValid = emailValue && !errors.email;

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
      const errorMessage = err instanceof AxiosError 
        ? err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.'
        : 'Terjadi kesalahan. Silakan coba lagi.';
      setError(errorMessage);
      toast.error(errorMessage);
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
    <PageTransition>
      <AuthLayout
      title="Daftar DuitDiary"
      subtitle="Buat akun dan mulai catat pengeluaranmu"
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
            label="Nama Lengkap"
            type="text"
            placeholder="Masukkan nama lengkap"
            variant="glass"
            leftIcon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
            rightIcon={isNameValid && <CheckCircle className="h-4 w-4 text-green-400" />}
            error={errors.name?.message}
            {...register('name')}
          />
        </motion.div>

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
              <motion.div 
                className="mt-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white/20'
                      }`}
                      layoutId={`strength-${i}`}
                      animate={{ scale: i < passwordStrength ? 1 : 0.8 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    />
                  ))}
                </div>
                <motion.p 
                  className="mt-1 text-xs text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Kekuatan: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Sangat Lemah'}
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
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
        </motion.div>

        {/* Terms Checkbox */}
        <motion.label 
          className="flex cursor-pointer items-start gap-3 text-sm text-white/80 transition-colors hover:text-white"
          variants={itemVariants}
        >
          <motion.input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
        </motion.label>

        <motion.div variants={itemVariants}>
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
        </motion.div>

        <motion.p 
          className="text-center text-sm text-white/70 sm:text-base"
          variants={itemVariants}
        >
          Sudah punya akun?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-white transition-colors hover:underline"
          >
            Masuk di sini
          </Link>
        </motion.p>
      </motion.form>
      </AuthLayout>
    </PageTransition>
  );
}
