/**
 * DuitDiary - Auth Layout
 * Brand-forward atmospheric shell
 */

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh overflow-x-clip">
      <div className="absolute inset-0 bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(28,200,180,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(15,155,142,0.18),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(94,234,212,0.12),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <motion.div
          className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-accent-bright/20 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center gap-6 px-4 py-8 sm:gap-10 sm:py-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center lg:text-left"
        >
          <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md sm:mb-6">
            <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-xl text-ink">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-display text-xl font-bold tracking-[-0.04em] text-white">
                DuitDiary
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
                Finance OS
              </p>
            </div>
          </div>

          <h1 className="font-display text-[2rem] font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Kendalikan
            <span className="block bg-gradient-to-r from-accent-bright to-teal-200 bg-clip-text text-transparent">
              arus kas harianmu
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65 sm:mt-4 sm:text-base lg:mx-0 lg:text-lg">
            Catat pemasukan dan pengeluaran dalam satu ruang yang cepat dan jelas.
          </p>

          <div className="mt-6 hidden items-center gap-3 text-sm text-white/55 lg:flex">
            <Sparkles className="h-4 w-4 text-accent-bright" />
            Ringkas. Responsif. Siap dipakai setiap hari.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-[1.5rem] border border-white/15 bg-white/95 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-8">
            <div className="mb-5 sm:mb-6">
              <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
            {children}
          </div>
          <p className="mt-4 pb-[var(--safe-bottom)] text-center text-xs text-white/45">
            DuitDiary © {new Date().getFullYear()} — catat lebih cerdas
          </p>
        </motion.div>
      </div>
    </div>
  );
}
