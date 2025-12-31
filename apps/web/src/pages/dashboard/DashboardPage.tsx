/**
 * DuitDiary - Dashboard Page
 * Modern glassmorphism design with animations and enhanced cards
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  FolderOpen,
  Plus,
  ArrowRight,
  Calendar,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { MainLayout } from '@/components/layout';
import { Button, Loading, EmptyState } from '@/components/ui';
import { useDashboard } from '@/hooks';
import { useExpenses } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/stores';

type Period = 'week' | 'month' | 'year';

// Animation variants
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

// Stats card colors with new design tokens
const statsConfig = [
  { 
    key: 'total',
    label: 'Total Pengeluaran',
    icon: TrendingDown,
    gradient: 'from-red-500 to-red-600',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
    accentColor: '#E74C3C',
  },
  {
    key: 'count',
    label: 'Jumlah Transaksi',
    icon: Receipt,
    gradient: 'from-blue-600 to-blue-700',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    accentColor: '#0052CC',
  },
  {
    key: 'average',
    label: 'Rata-rata',
    icon: TrendingUp,
    gradient: 'from-green-500 to-green-600',
    bgLight: 'bg-green-50',
    textColor: 'text-green-600',
    accentColor: '#27AE60',
  },
  {
    key: 'categories',
    label: 'Kategori Aktif',
    icon: FolderOpen,
    gradient: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    accentColor: '#F39C12',
  },
];

export function DashboardPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<Period>('month');
  
  const { data: summary, isLoading: isSummaryLoading } = useDashboard({ period });
  const { data: recentExpenses, isLoading: isExpensesLoading } = useExpenses({
    limit: 5,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const periodLabels: Record<Period, string> = {
    week: 'Minggu Ini',
    month: 'Bulan Ini',
    year: 'Tahun Ini',
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // Get stats values
  const getStatsValue = (key: string) => {
    switch (key) {
      case 'total':
        return formatCurrency(summary?.totalExpenses || 0);
      case 'count':
        return (summary?.expenseCount || 0).toString();
      case 'average':
        return formatCurrency(
          summary?.expenseCount
            ? (summary.totalExpenses / summary.expenseCount)
            : 0
        );
      case 'categories':
        return (summary?.categoryBreakdown?.length || 0).toString();
      default:
        return '0';
    }
  };

  return (
    <MainLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Header */}
        <motion.div 
          className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-6 text-white shadow-xl sm:p-8 border border-blue-700/50 relative"
          variants={itemVariants}
        >
          {/* Background animation */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -right-32 -top-32 h-64 w-64 bg-blue-400/10 rounded-full blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <motion.div 
                className="mb-1 flex items-center gap-2 text-white/80"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date().toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </motion.div>
              <motion.h1 
                className="text-2xl font-bold sm:text-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
              </motion.h1>
              <motion.p 
                className="mt-1 text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Pantau pengeluaran harianmu dengan mudah
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', damping: 20, stiffness: 300 }}
            >
              <Link to={ROUTES.EXPENSE_NEW}>
                <Button
                  variant="glass"
                  size="lg"
                  leftIcon={<Plus className="h-5 w-5" />}
                  className="w-full sm:w-auto"
                >
                  Tambah Pengeluaran
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div 
          className="mb-6 flex flex-wrap gap-2"
          variants={itemVariants}
        >
          {(['week', 'month', 'year'] as Period[]).map((p) => (
            <motion.button
              key={p}
              onClick={() => setPeriod(p)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                period === p
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              {periodLabels[p]}
            </motion.button>
          ))}
        </motion.div>

        {isSummaryLoading ? (
          <Loading message="Memuat data..." />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Cards */}
            <motion.div 
              className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              variants={containerVariants}
            >
              {statsConfig.map((stat, index) => (
                <motion.div
                  key={stat.key}
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300"
                >
                  {/* Gradient Accent */}
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
                  
                  {/* Animated background */}
                  <motion.div
                    className="absolute -right-20 -top-20 h-40 w-40 opacity-0 rounded-full blur-3xl"
                    style={{ backgroundColor: stat.accentColor }}
                    animate={{ opacity: [0, 0.1, 0], scale: [0.5, 1.2, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <motion.p 
                        className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl"
                        key={`stat-${stat.key}-${period}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      >
                        {getStatsValue(stat.key)}
                      </motion.p>
                    </div>
                    <motion.div 
                      className={`rounded-2xl ${stat.bgLight} p-3 transition-transform`}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts & Recent Expenses */}
            <motion.div 
              className="grid gap-6 lg:grid-cols-2"
              variants={containerVariants}
            >
              {/* Category Breakdown Chart */}
              <motion.div 
                className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:p-6"
                variants={itemVariants}
                whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Pengeluaran per Kategori
                  </h3>
                </div>
                {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={summary.categoryBreakdown.map((item) => ({
                            ...item,
                            [item.categoryName]: item.total,
                          }))}
                          dataKey="total"
                          nameKey="categoryName"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          innerRadius={50}
                          paddingAngle={2}
                          label={({ name, percent }) =>
                            `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                          }
                          labelLine={false}
                        >
                          {summary.categoryBreakdown.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.categoryColor || `hsl(${index * 45 + 200}, 70%, 55%)`}
                              stroke="white"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          formatter={(value) => <span className="text-gray-600">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                ) : (
                  <EmptyState
                    title="Belum ada data"
                    description="Tambahkan pengeluaran untuk melihat statistik"
                  />
                )}
              </motion.div>

              {/* Recent Expenses */}
              <motion.div 
                className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:p-6"
                variants={itemVariants}
                whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Pengeluaran Terbaru
                  </h3>
                  <Link
                    to={ROUTES.EXPENSES}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    Lihat semua
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {isExpensesLoading ? (
                  <Loading />
                ) : recentExpenses?.data && recentExpenses.data.length > 0 ? (
                  <motion.div 
                    className="space-y-3"
                    variants={containerVariants}
                  >
                    {recentExpenses.data.map((expense, index) => (
                      <motion.div
                        key={expense.id}
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                        className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-all hover:border-blue-100 hover:bg-blue-50/30 sm:p-4"
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform sm:h-12 sm:w-12"
                            style={{
                              backgroundColor: expense.category?.color
                                ? `${expense.category.color}20`
                                : '#f3f4f6',
                            }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span
                              className="text-xl sm:text-2xl"
                              style={{ color: expense.category?.color }}
                            >
                              {expense.category?.icon || '💰'}
                            </span>
                          </motion.div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {expense.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              {expense.category?.name} • {formatDate(expense.date)}
                            </p>
                          </div>
                        </div>
                        <p className="text-base font-bold text-rose-600 sm:text-lg">
                          -{formatCurrency(expense.amount)}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    title="Belum ada pengeluaran"
                    description="Tambahkan pengeluaran pertamamu"
                    action={
                      <Link to={ROUTES.EXPENSE_NEW}>
                        <Button 
                          size="sm" 
                          variant="gradient"
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          Tambah
                        </Button>
                      </Link>
                    }
                  />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
}
