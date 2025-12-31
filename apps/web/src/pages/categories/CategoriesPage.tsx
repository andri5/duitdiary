/**
 * DuitDiary - Categories Page
 * Modern grid layout with animations and category management
 */

import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderOpen, Grid, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout, PageTransition } from '@/components/layout';
import {
  Button,
  Loading,
  Modal,
  ModalFooter,
  EmptyState,
} from '@/components/ui';
import { CategoryForm } from './components/CategoryForm';
import { useCategories, useCategoryMutations } from '@/hooks';
import type { Category } from '@/types';

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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 20, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  hover: { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
};

export function CategoriesPage() {
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    category?: Category;
  }>({ isOpen: false });
  const [deleteModal, setDeleteModal] = useState<Category | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
    <PageTransition>
      <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Hero Header */}
        <motion.div 
          className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 via-blue-800 to-slate-900 p-6 text-white shadow-xl sm:p-8 border border-purple-700/50 relative"
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
              <motion.h1 
                className="text-2xl font-bold sm:text-3xl flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Grid className="w-8 h-8" />
                Kategori
              </motion.h1>
              <motion.p 
                className="mt-1 text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Kelola kategori pengeluaranmu dengan mudah
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', damping: 20, stiffness: 300 }}
            >
              <Button
                variant="glass"
                size="lg"
                leftIcon={<Plus className="h-5 w-5" />}
                onClick={openCreateModal}
                className="w-full sm:w-auto"
              >
                Tambah Kategori
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {isLoading ? (
          <Loading message="Memuat kategori..." />
        ) : categories && categories.length > 0 ? (
          <motion.div 
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  exit="exit"
                  whileHover="hover"
                  onMouseEnter={() => setHoveredId(category.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300"
                >
                  {/* Color accent top border */}
                  <motion.div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ backgroundColor: category.color || '#6366f1' }}
                    layoutId={`color-${category.id}`}
                  />
                  
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute -right-20 -top-20 h-40 w-40 opacity-0 rounded-full blur-3xl"
                    style={{
                      backgroundColor: category.color,
                    }}
                    animate={{ 
                      opacity: hoveredId === category.id ? 0.1 : 0,
                      scale: hoveredId === category.id ? 1 : 0.5,
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  />

                  <div className="relative z-10 p-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform flex-shrink-0"
                        style={{
                          backgroundColor: category.color
                            ? `${category.color}15`
                            : '#f3f4f6',
                        }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span
                          className="text-2xl"
                          style={{ color: category.color }}
                        >
                          {category.icon || '📁'}
                        </span>
                      </motion.div>
                      <div>
                        <p className="font-semibold text-gray-900">{category.name}</p>
                        <motion.p 
                          className="text-sm text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {category.expenseCount || 0} pengeluaran
                        </motion.p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Color indicator badge */}
                  <div className="relative z-10 px-5 pb-3">
                    <div
                      className="h-3 rounded-full opacity-70"
                      style={{
                        backgroundColor: category.color || '#6366f1',
                        width: '100%',
                      }}
                    />
                  </div>
                  
                  {/* Action buttons - show on hover */}
                  <motion.div 
                    className="relative z-10 mt-2 flex items-center gap-2 border-t border-gray-100 pt-4 px-5 pb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: hoveredId === category.id ? 1 : 0, y: hoveredId === category.id ? 0 : 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.button
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 px-3 text-sm font-medium text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => openEditModal(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 px-3 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      onClick={() => setDeleteModal(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}

              {/* Add New Category Card */}
              <motion.button
                key="add-category"
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.2)' }}
                onClick={openCreateModal}
                className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 text-gray-400 transition-all hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-500"
              >
                <motion.div 
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <Plus className="h-6 w-6" />
                </motion.div>
                <span className="font-medium">Tambah Kategori</span>
              </motion.button>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EmptyState
              icon={<FolderOpen className="h-12 w-12" />}
              title="Belum ada kategori"
              description="Buat kategori untuk mengelompokkan pengeluaranmu"
              action={
                <Button 
                  variant="gradient" 
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={openCreateModal}
                >
                  Tambah Kategori
                </Button>
              }
            />
          </motion.div>
        )}

        {/* Category Form Modal */}
        <Modal
          isOpen={formModal.isOpen}
          onClose={closeFormModal}
          title={formModal.category ? 'Edit Kategori' : 'Tambah Kategori'}
          animated
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
          animated
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3 mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Kategori akan dihapus, tetapi pengeluaran yang terkait akan tetap ada.
              </p>
            </div>
            <p className="text-gray-600">
              Apakah kamu yakin ingin menghapus kategori "
              <strong>{deleteModal?.name}</strong>"?
            </p>
          </motion.div>
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
