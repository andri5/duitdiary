/**
 * DuitDiary - Categories Page
 * Modern grid layout with colorful cards
 */

import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import {
  Button,
  Loading,
  Modal,
  ModalFooter,
} from '@/components/ui';
import { CategoryForm } from './components/CategoryForm';
import { useCategories, useCategoryMutations } from '@/hooks';
import type { Category } from '@/types';

export function CategoriesPage() {
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    category?: Category;
  }>({ isOpen: false });
  const [deleteModal, setDeleteModal] = useState<Category | null>(null);

  const { data: categories, isLoading } = useCategories();
  const { delete: deleteMutation } = useCategoryMutations();

  const handleDelete = async () => {
    if (!deleteModal) return;
    await deleteMutation.mutateAsync(deleteModal.id);
    setDeleteModal(null);
  };

  const openCreateModal = () => {
    setFormModal({ isOpen: true });
  };

  const openEditModal = (category: Category) => {
    setFormModal({ isOpen: true, category });
  };

  const closeFormModal = () => {
    setFormModal({ isOpen: false });
  };

  return (
    <MainLayout>
      {/* Hero Header */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 p-6 text-white shadow-xl sm:p-8 border border-blue-700/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">📁 Kategori</h1>
            <p className="mt-1 text-white/80">
              Kelola kategori pengeluaranmu
            </p>
          </div>
          <Button
            variant="glass"
            size="lg"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={openCreateModal}
            className="w-full sm:w-auto"
          >
            Tambah Kategori
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loading message="Memuat kategori..." />
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Color accent top border */}
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: category.color || '#6366f1' }}
              />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: category.color
                        ? `${category.color}15`
                        : '#f3f4f6',
                    }}
                  >
                    <span
                      className="text-2xl"
                      style={{ color: category.color }}
                    >
                      {category.icon || '📁'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">
                      {category.expenseCount || 0} pengeluaran
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action buttons - show on hover */}
              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => openEditModal(category)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  onClick={() => setDeleteModal(category)}
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
          
          {/* Add New Category Card */}
          <button
            onClick={openCreateModal}
            className="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 text-gray-400 transition-all hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-medium">Tambah Kategori</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100">
            <FolderOpen className="h-8 w-8 text-violet-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Belum ada kategori</h3>
          <p className="mt-1 text-gray-500">Buat kategori untuk mengelompokkan pengeluaranmu</p>
          <Button 
            variant="gradient" 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={openCreateModal}
            className="mt-4"
          >
            Tambah Kategori
          </Button>
        </div>
      )}

      {/* Category Form Modal */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={closeFormModal}
        title={formModal.category ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <CategoryForm
          category={formModal.category}
          onSuccess={closeFormModal}
          onCancel={closeFormModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Hapus Kategori"
        size="sm"
      >
        <p className="text-gray-600">
          Apakah kamu yakin ingin menghapus kategori "
          <strong>{deleteModal?.name}</strong>"? Pengeluaran yang terkait dengan
          kategori ini tidak akan dihapus.
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
    </MainLayout>
  );
}
