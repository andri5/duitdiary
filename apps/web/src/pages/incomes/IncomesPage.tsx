/**
 * DuitDiary - Incomes List Page
 */

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Calendar,
  Wallet,
  Paperclip,
  X,
  ChevronDown,
  Grid,
  List,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout, PageHeader, PageTransition } from '@/components/layout';
import {
  Button,
  Input,
  Select,
  Loading,
  Modal,
  ModalFooter,
  Badge,
  Card,
  EmptyState,
  CategoryIcon,
  ReceiptPreviewModal,
} from '@/components/ui';
import { useExpenses, useExpenseMutations, useCategories } from '@/hooks';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { ROUTES, DEFAULT_PAGE_SIZE } from '@/lib/constants';
import type { Expense, ExpenseFilters } from '@/types';

export function IncomesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteModal, setDeleteModal] = useState<Expense | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<Expense | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');

  const filters: ExpenseFilters = {
    page: Number(searchParams.get('page')) || 1,
    limit: DEFAULT_PAGE_SIZE,
    categoryId: searchParams.get('categoryId') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    type: 'INCOME',
    sortBy: (searchParams.get('sortBy') as ExpenseFilters['sortBy']) || 'date',
    sortOrder: (searchParams.get('sortOrder') as ExpenseFilters['sortOrder']) || 'desc',
  };

  const { data: expenses, isLoading } = useExpenses(filters);
  const { data: categories } = useCategories('INCOME');
  const { delete: deleteMutation } = useExpenseMutations('INCOME');

  const updateFilters = (newFilters: Partial<ExpenseFilters>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
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

  const clearFilters = () => setSearchParams({});

  const categoryOptions =
    categories?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

  const hasActiveFilters = filters.categoryId || filters.startDate || filters.endDate;

  const filteredData =
    expenses?.data?.filter((expense) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        expense.description.toLowerCase().includes(q) ||
        expense.category?.name?.toLowerCase().includes(q)
      );
    }) || [];

  return (
    <PageTransition>
      <MainLayout>
        <PageHeader
          eyebrow="Transaksi"
          title="Pemasukan"
          description="Catat dan pantau semua sumber pemasukanmu."
          action={
            <Link to={ROUTES.INCOME_NEW} className="w-full sm:w-auto">
              <Button
                variant="gradient"
                size="lg"
                leftIcon={<Plus className="h-5 w-5" />}
                className="w-full"
              >
                Tambah
              </Button>
            </Link>
          }
        />

        <Card padding="md" className="mb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pemasukan atau kategori..."
                className="w-full rounded-2xl border border-line bg-mist/40 py-3 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl border border-line p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'rounded-lg p-2 transition',
                    viewMode === 'list' ? 'bg-accent-soft text-accent' : 'text-muted'
                  )}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'rounded-lg p-2 transition',
                    viewMode === 'grid' ? 'bg-accent-soft text-accent' : 'text-muted'
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>

              <Button
                variant={showFilters ? 'primary' : 'outline'}
                leftIcon={<Filter className="h-4 w-4" />}
                rightIcon={
                  <ChevronDown
                    className={cn('h-4 w-4 transition', showFilters && 'rotate-180')}
                  />
                }
                onClick={() => setShowFilters(!showFilters)}
              >
                Filter
                {hasActiveFilters && (
                  <span className="ml-1 rounded-md bg-white/20 px-1.5 text-xs">•</span>
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Select
                    label="Kategori"
                    placeholder="Semua kategori"
                    options={categoryOptions}
                    value={filters.categoryId || ''}
                    onChange={(e) =>
                      updateFilters({ categoryId: e.target.value || undefined })
                    }
                  />
                  <Input
                    label="Dari Tanggal"
                    type="date"
                    leftIcon={<Calendar className="h-4 w-4" />}
                    value={filters.startDate || ''}
                    onChange={(e) =>
                      updateFilters({ startDate: e.target.value || undefined })
                    }
                  />
                  <Input
                    label="Sampai Tanggal"
                    type="date"
                    leftIcon={<Calendar className="h-4 w-4" />}
                    value={filters.endDate || ''}
                    onChange={(e) =>
                      updateFilters({ endDate: e.target.value || undefined })
                    }
                  />
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      leftIcon={<X className="h-4 w-4" />}
                      className="w-full"
                    >
                      Reset Filter
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {isLoading ? (
          <Loading message="Memuat pemasukan..." />
        ) : filteredData.length > 0 ? (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3'
                  : 'space-y-2'
              }
            >
              {filteredData.map((expense) => (
                <Card
                  key={expense.id}
                  padding="sm"
                  className={cn(
                    'transition hover:shadow-[var(--shadow-lift)]',
                    viewMode === 'list' && 'sm:px-4'
                  )}
                >
                  <div
                    className={cn(
                      'flex gap-3',
                      viewMode === 'grid'
                        ? 'flex-col'
                        : 'flex-col sm:flex-row sm:items-center sm:justify-between'
                    )}
                  >
                    <div
                      className={cn(
                        'flex min-w-0 items-center gap-3',
                        viewMode === 'grid' && 'flex-col text-center'
                      )}
                    >
                      <div
                        className={cn(
                          'flex flex-shrink-0 items-center justify-center rounded-2xl',
                          viewMode === 'grid' ? 'h-14 w-14' : 'h-12 w-12'
                        )}
                        style={{
                          backgroundColor: expense.category?.color
                            ? `${expense.category.color}22`
                            : '#e6edf4',
                          color: expense.category?.color || '#0f9b8e',
                        }}
                      >
                        <CategoryIcon
                          icon={expense.category?.icon}
                          size={viewMode === 'grid' ? 24 : 20}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                          {expense.description}
                        </p>
                        <div
                          className={cn(
                            'mt-1.5 flex flex-wrap items-center gap-2',
                            viewMode === 'grid' && 'justify-center'
                          )}
                        >
                          <Badge variant="primary" size="sm">
                            {expense.category?.name || 'Umum'}
                          </Badge>
                          <span className="text-xs text-muted">
                            {formatDate(expense.date)}
                          </span>
                          {expense.receiptUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setReceiptPreview(expense);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-medium text-accent transition hover:underline"
                            >
                              <Paperclip className="h-3 w-3" />
                              Struk
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'flex items-center gap-2',
                        viewMode === 'grid' ? 'mt-2 justify-between' : 'justify-between sm:justify-end'
                      )}
                    >
                      <p className="text-base font-bold font-mono text-lime sm:text-lg">
                        +{formatCurrency(expense.amount)}
                      </p>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/incomes/${expense.id}/edit`}
                          className="rounded-xl p-2 text-muted transition hover:bg-accent-soft hover:text-accent"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          className="rounded-xl p-2 text-muted transition hover:bg-coral-soft hover:text-coral"
                          onClick={() => setDeleteModal(expense)}
                          aria-label="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {expenses?.pagination && expenses.pagination.totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!expenses.pagination.hasPrev}
                  onClick={() => updateFilters({ page: filters.page! - 1 })}
                  className="w-full sm:w-auto"
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-muted">
                  Halaman{' '}
                  <span className="font-semibold text-ink">{expenses.pagination.page}</span>{' '}
                  dari{' '}
                  <span className="font-semibold text-ink">
                    {expenses.pagination.totalPages}
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!expenses.pagination.hasNext}
                  onClick={() => updateFilters({ page: filters.page! + 1 })}
                  className="w-full sm:w-auto"
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card padding="lg">
            <EmptyState
              icon={<Wallet className="h-7 w-7" />}
              title="Belum ada pemasukan"
              description="Mulai catat pemasukan seperti gaji atau freelance"
              action={
                <Link to={ROUTES.INCOME_NEW}>
                  <Button leftIcon={<Plus className="h-4 w-4" />}>Tambah Pemasukan</Button>
                </Link>
              }
            />
          </Card>
        )}

        <Modal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Hapus Pemasukan"
          size="sm"
        >
          <p className="text-muted">
            Hapus pemasukan "
            <strong className="text-ink">{deleteModal?.description}</strong>"? Tindakan
            ini tidak dapat dibatalkan.
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

        <ReceiptPreviewModal
          isOpen={!!receiptPreview}
          onClose={() => setReceiptPreview(null)}
          receiptUrl={receiptPreview?.receiptUrl}
          title={receiptPreview?.description || 'Preview Struk'}
        />
      </MainLayout>
    </PageTransition>
  );
}
