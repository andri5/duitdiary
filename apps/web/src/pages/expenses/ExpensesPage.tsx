/**
 * DuitDiary - Expenses List Page
 * Modern design with animations, badges, and enhanced card views
 */

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Filter, Calendar, Receipt, X, ChevronDown, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout, PageTransition } from '@/components/layout';
import {
  Button,
  Input,
  Select,
  Loading,
  Modal,
  ModalFooter,
  Badge,
} from '@/components/ui';
import { useExpenses, useExpenseMutations, useCategories } from '@/hooks';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ROUTES, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import type { Expense, ExpenseFilters } from '@/types';

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
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

export function ExpensesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteModal, setDeleteModal] = useState<Expense | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Get filter values from URL
  const filters: ExpenseFilters = {
    page: Number(searchParams.get('page')) || 1,
    limit: DEFAULT_PAGE_SIZE,
    categoryId: searchParams.get('categoryId') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    sortBy: (searchParams.get('sortBy') as ExpenseFilters['sortBy']) || 'date',
    sortOrder: (searchParams.get('sortOrder') as ExpenseFilters['sortOrder']) || 'desc',
  };

  const { data: expenses, isLoading } = useExpenses(filters);
  const { data: categories } = useCategories();
  const { delete: deleteMutation } = useExpenseMutations();

  const updateFilters = (newFilters: Partial<ExpenseFilters>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 when filters change
    if (!('page' in newFilters)) {
      params.set('page', '1');
    }
    setSearchParams(params);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    await deleteMutation.mutateAsync(deleteModal.id);
    setDeleteModal(null);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const categoryOptions = categories?.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })) || [];

  const hasActiveFilters = filters.categoryId || filters.startDate || filters.endDate;

  return (
    <PageTransition>
      <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hero Header */}
        <motion.div 
          className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-blue-900 p-6 text-white shadow-xl sm:p-8 border border-blue-700/50 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Background animation */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -right-40 -top-40 h-80 w-80 bg-blue-400/10 rounded-full blur-3xl"
              animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">💰 Pengeluaran</h1>
              <p className="mt-1 text-white/80">
                Kelola semua pengeluaran harianmu dengan mudah
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
        </motion.div>

        {/* Search & Filters */}
        <motion.div 
          className="mb-6 overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <motion.input
                  type="text"
                  placeholder="Cari pengeluaran..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="flex gap-1 border border-gray-200 rounded-xl p-1"
                whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              >
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="h-4 w-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid className="h-4 w-4" />
                </motion.button>
              </motion.div>
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                leftIcon={<Filter className="h-4 w-4" />}
                rightIcon={<ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />}
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-xl"
              >
                Filter
                {hasActiveFilters && (
                  <motion.span 
                    className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    Aktif
                  </motion.span>
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="mt-4 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <Select
                  label="Kategori"
                  placeholder="Semua kategori"
                  options={categoryOptions}
                  value={filters.categoryId || ''}
                  onChange={(e) => updateFilters({ categoryId: e.target.value || undefined })}
                />
                <Input
                  label="Dari Tanggal"
                  type="date"
                  leftIcon={<Calendar className="h-4 w-4" />}
                  value={filters.startDate || ''}
                  onChange={(e) => updateFilters({ startDate: e.target.value || undefined })}
                />
                <Input
                  label="Sampai Tanggal"
                  type="date"
                  leftIcon={<Calendar className="h-4 w-4" />}
                  value={filters.endDate || ''}
                  onChange={(e) => updateFilters({ endDate: e.target.value || undefined })}
                />
                <div className="flex items-end">
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    leftIcon={<X className="h-4 w-4" />}
                    className="text-gray-500"
                  >
                    Reset Filter
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Expenses List/Grid */}
        {isLoading ? (
          <Loading message="Memuat pengeluaran..." />
        ) : expenses?.data && expenses.data.length > 0 ? (
          <>
            <motion.div 
              className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {expenses.data.map((expense) => (
                  <motion.div
                    key={expense.id}
                    variants={itemVariants}
                    exit="exit"
                    whileHover={{ scale: 1.02 }}
                    className={`group overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-lg sm:p-5 ${viewMode === 'grid' ? 'flex flex-col' : 'flex items-center justify-between'}`}
                  >
                    <div className={`flex items-center ${viewMode === 'grid' ? 'flex-col' : ''} gap-3 sm:gap-4`}>
                      <motion.div
                        className={`flex flex-shrink-0 items-center justify-center rounded-xl transition-transform sm:h-14 sm:w-14 ${viewMode === 'grid' ? 'h-16 w-16' : 'h-12 w-12'}`}
                        style={{
                          backgroundColor: expense.category?.color
                            ? `${expense.category.color}15`
                            : '#f3f4f6',
                        }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                      >
                        <span
                          className={`${viewMode === 'grid' ? 'text-3xl' : 'text-xl sm:text-2xl'}`}
                          style={{ color: expense.category?.color }}
                        >
                          {expense.category?.icon || '💰'}
                        </span>
                      </motion.div>
                      <div className={viewMode === 'grid' ? 'text-center w-full' : ''}>
                        <p className="font-semibold text-gray-900">
                          {expense.description}
                        </p>
                        <div className="flex flex-wrap gap-2 items-center mt-2">
                          <Badge variant="primary" size="sm">
                            {expense.category?.name}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 sm:gap-4 ${viewMode === 'grid' ? 'mt-4 w-full justify-between' : ''}`}>
                      <p className="text-lg font-bold text-rose-600 sm:text-xl">
                        -{formatCurrency(expense.amount)}
                      </p>
                      <motion.div 
                        className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Link to={`/expenses/${expense.id}/edit`}>
                          <motion.button 
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Pencil className="h-4 w-4" />
                          </motion.button>
                        </Link>
                        <motion.button
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteModal(expense)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {expenses?.pagination && expenses.pagination.totalPages > 1 && (
              <motion.div 
                className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!expenses.pagination.hasPrev}
                  onClick={() => updateFilters({ page: filters.page! - 1 })}
                  className="w-full rounded-xl sm:w-auto"
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-gray-600">
                  Halaman <span className="font-semibold text-gray-900">{expenses.pagination.page}</span> dari{' '}
                  <span className="font-semibold text-gray-900">{expenses.pagination.totalPages}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!expenses.pagination.hasNext}
                  onClick={() => updateFilters({ page: filters.page! + 1 })}
                  className="w-full rounded-xl sm:w-auto"
                >
                  Selanjutnya
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            className="overflow-hidden rounded-2xl bg-white p-8 text-center shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-red-200"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Receipt className="h-8 w-8 text-rose-500" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-900">Belum ada pengeluaran</h3>
            <p className="mt-1 text-gray-500">Mulai catat pengeluaran harianmu sekarang</p>
            <Link to={ROUTES.EXPENSE_NEW} className="mt-4 inline-block">
              <Button 
                variant="gradient" 
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Tambah Pengeluaran
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Hapus Pengeluaran"
          size="sm"
        >
          <p className="text-gray-600">
            Apakah kamu yakin ingin menghapus pengeluaran "
            <strong>{deleteModal?.description}</strong>"? Tindakan ini tidak dapat
            dibatalkan.
          </p>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteModal(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              isLoading={deleteMutation.isPending}
              onClick={handleDelete}
            >
              Hapus
            </Button>
          </ModalFooter>
        </Modal>
      </motion.div>
      </MainLayout>
    </PageTransition>
  );
}
