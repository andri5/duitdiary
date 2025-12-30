/**
 * DuitDiary - Auth Layout Component
 * Modern glassmorphism design with gradient background
 */

import type { ReactNode } from 'react';
import { Wallet } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Animated Gradient Background - Deep Blue Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
        {/* Animated Shapes */}
        <div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-blue-400/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 animate-pulse rounded-full bg-cyan-400/10 blur-3xl delay-1000 sm:h-96 sm:w-96" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-500/10 blur-2xl delay-500 sm:h-64 sm:w-64" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[420px] sm:max-w-md">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          {/* Logo */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/30 text-white shadow-2xl backdrop-blur-sm border border-blue-400/50 sm:h-16 sm:w-16">
            <Wallet className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <h1 className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-white/80 sm:text-base">{subtitle}</p>
          )}
        </div>

        {/* Glass Card */}
        <div className="rounded-2xl border border-blue-400/30 bg-blue-950/40 p-6 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-8 lg:p-10">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-white/60 sm:mt-6 sm:text-sm">
          DuitDiary - Catat pengeluaran harianmu
        </p>
      </div>
    </div>
  );
}
