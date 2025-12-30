/**
 * DuitDiary - Dashboard Page
 * Modern glassmorphism design
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
} from 'lucide-react';
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

// Stats card colors
const statsConfig = [
  { 
    key: 'total',
    label: 'Total Pengeluaran',
    icon: TrendingDown,
    gradient: 'from-red-500 to-red-600',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
  },
  {
    key: 'count',
    label: 'Jumlah Transaksi',
    icon: Receipt,
    gradient: 'from-blue-600 to-blue-700',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    key: 'average',
    label: 'Rata-rata',
    icon: TrendingUp,
    gradient: 'from-cyan-500 to-cyan-600',
    bgLight: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  {
    key: 'categories',
    label: 'Kategori Aktif',
    icon: FolderOpen,
    gradient: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
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
      {/* Hero Header */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 p-6 text-white shadow-xl sm:p-8 border border-blue-700/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-white/80">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="mt-1 text-white/80">
              Pantau pengeluaran harianmu dengan mudah
            </p>
          </div>
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
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['week', 'month', 'year'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              period === p
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {isSummaryLoading ? (
        <Loading message="Memuat data..." />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsConfig.map((stat) => (
              <div
                key={stat.key}
                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Gradient Accent */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                      {getStatsValue(stat.key)}
                    </p>
                  </div>
                  <div className={`rounded-2xl ${stat.bgLight} p-3 transition-transform group-hover:scale-110`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts & Recent Expenses */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category Breakdown Chart */}
            <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Pengeluaran per Kategori</h3>
              </div>
              {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
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
              ) : (
                <EmptyState
                  title="Belum ada data"
                  description="Tambahkan pengeluaran untuk melihat statistik"
                />
              )}
            </div>

            {/* Recent Expenses */}
            <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Pengeluaran Terbaru</h3>
                <Link
                  to={ROUTES.EXPENSES}
                  className="flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  Lihat semua
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {isExpensesLoading ? (
                <Loading />
              ) : recentExpenses?.data && recentExpenses.data.length > 0 ? (
                <div className="space-y-3">
                  {recentExpenses.data.map((expense) => (
                    <div
                      key={expense.id}
                      className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-all hover:border-indigo-100 hover:bg-indigo-50/30 sm:p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105 sm:h-12 sm:w-12"
                          style={{
                            backgroundColor: expense.category?.color
                              ? `${expense.category.color}20`
                              : '#f3f4f6',
                          }}
                        >
                          <span
                            className="text-xl sm:text-2xl"
                            style={{ color: expense.category?.color }}
                          >
                            {expense.category?.icon || '💰'}
                          </span>
                        </div>
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
                    </div>
                  ))}
                </div>
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
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}
