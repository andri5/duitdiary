/**
 * DuitDiary - Savings Goals Page
 */

import { useState } from 'react';
import { Target, Plus, Trash2, PiggyBank, TrendingUp, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout, PageHeader, PageTransition } from '@/components/layout';
import { Button, Input, Card, EmptyState, Modal, ModalFooter } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import {
  getSavingsGoals,
  createSavingsGoal,
  addSavingsAmount,
  deleteSavingsGoal,
  type SavingsGoal,
} from '@/services/savings.service';

function formatNominal(n: number) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n);
}

export function SavingsPage() {
  const toast = useToast();
  const qc = useQueryClient();
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['savings'],
    queryFn: getSavingsGoals,
  });

  const [showCreate, setShowCreate] = useState(false);
  const [addModal, setAddModal] = useState<SavingsGoal | null>(null);
  const [deleteModal, setDeleteModal] = useState<SavingsGoal | null>(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [addAmount, setAddAmount] = useState('');

  const createMut = useMutation({
    mutationFn: createSavingsGoal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings'] });
      toast.success('Target tabungan dibuat!');
      setShowCreate(false);
      setName('');
      setTarget('');
      setDeadline('');
    },
    onError: () => toast.error('Gagal membuat target'),
  });

  const addMut = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      addSavingsAmount(id, amount),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['savings'] });
      if (updated.isCompleted) {
        toast.success(`🎉 Target "${updated.name}" tercapai!`);
      } else {
        toast.success('Tabungan ditambahkan!');
      }
      setAddModal(null);
      setAddAmount('');
    },
    onError: () => toast.error('Gagal menambah tabungan'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteSavingsGoal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings'] });
      toast.success('Target dihapus');
      setDeleteModal(null);
    },
    onError: () => {
      toast.error('Gagal menghapus target');
    },
  });

  const handleCreate = () => {
    const parsed = Number(target.replace(/\./g, '').replace(',', '.'));
    if (!name.trim() || !parsed || parsed <= 0) {
      toast.error('Nama dan target harus diisi');
      return;
    }
    createMut.mutate({
      name: name.trim(),
      targetAmount: parsed,
      deadline: deadline || null,
    });
  };

  const handleAdd = () => {
    if (!addModal) return;
    const parsed = Number(addAmount.replace(/\./g, '').replace(',', '.'));
    if (!parsed || parsed <= 0) {
      toast.error('Jumlah harus lebih dari 0');
      return;
    }
    addMut.mutate({ id: addModal.id, amount: parsed });
  };

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <PageTransition>
      <MainLayout>
        <PageHeader
          eyebrow="Keuangan"
          title="Target Tabungan"
          description="Atur target saving dan pantau progresnya."
          action={
            <Button
              variant="gradient"
              size="lg"
              leftIcon={<Plus className="h-5 w-5" />}
              onClick={() => setShowCreate(true)}
            >
              Buat Target
            </Button>
          }
        />

        {goals.length > 0 && (
          <Card padding="md" className="mb-5">
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs font-semibold text-muted">Total Terkumpul</p>
                <p className="text-lg font-bold text-accent">{formatNominal(totalSaved)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">Total Target</p>
                <p className="text-lg font-bold text-ink">{formatNominal(totalTarget)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">Target Aktif</p>
                <p className="text-lg font-bold text-ink">{activeGoals.length}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted">Tercapai</p>
                <p className="text-lg font-bold text-lime-600">{completedGoals.length}</p>
              </div>
            </div>
          </Card>
        )}

        {isLoading ? (
          <Card padding="lg"><p className="text-center text-muted">Memuat...</p></Card>
        ) : goals.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={<Target className="h-7 w-7" />}
              title="Belum ada target tabungan"
              description="Mulai buat target saving untuk mencapai impianmu"
              action={
                <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
                  Buat Target
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {activeGoals.length > 0 && (
              <>
                <p className="text-sm font-semibold text-muted">Aktif</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {activeGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onAdd={setAddModal} onDelete={setDeleteModal} />
                  ))}
                </div>
              </>
            )}
            {completedGoals.length > 0 && (
              <>
                <p className="mt-6 text-sm font-semibold text-muted">Tercapai</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {completedGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onAdd={setAddModal} onDelete={setDeleteModal} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Create modal */}
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Buat Target Tabungan" size="sm">
          <div className="space-y-4">
            <Input
              label="Nama target"
              placeholder="Contoh: Dana darurat, Liburan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Target nominal"
              placeholder="Contoh: 10000000"
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <Input
              label="Deadline (opsional)"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Batal</Button>
            <Button variant="gradient" isLoading={createMut.isPending} onClick={handleCreate}>
              Simpan
            </Button>
          </ModalFooter>
        </Modal>

        {/* Add amount modal */}
        <Modal isOpen={!!addModal} onClose={() => setAddModal(null)} title="Tambah Tabungan" size="sm">
          <p className="mb-3 text-sm text-muted">
            Tambah tabungan ke "{addModal?.name}". Sisa{' '}
            <strong className="text-ink">{formatNominal(addModal?.remaining || 0)}</strong>
          </p>
          <Input
            label="Jumlah"
            placeholder="Contoh: 500000"
            inputMode="numeric"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <ModalFooter>
            <Button variant="ghost" onClick={() => setAddModal(null)}>Batal</Button>
            <Button variant="gradient" isLoading={addMut.isPending} onClick={handleAdd}>
              Tambah
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete modal */}
        <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Hapus Target" size="sm">
          <p className="text-muted">
            Hapus target "<strong className="text-ink">{deleteModal?.name}</strong>"?
          </p>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteModal(null)}>Batal</Button>
            <Button variant="danger" isLoading={deleteMut.isPending} onClick={() => deleteModal && deleteMut.mutate(deleteModal.id)}>
              Hapus
            </Button>
          </ModalFooter>
        </Modal>
      </MainLayout>
    </PageTransition>
  );
}

function GoalCard({
  goal,
  onAdd,
  onDelete,
}: {
  goal: SavingsGoal;
  onAdd: (g: SavingsGoal) => void;
  onDelete: (g: SavingsGoal) => void;
}) {
  const pct = goal.percentSaved;
  return (
    <Card padding="md" className={cn('relative', goal.isCompleted && 'opacity-80')}>
      {goal.isCompleted && (
        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-lime-500 text-white">
          <Check className="h-3.5 w-3.5" />
        </div>
      )}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <PiggyBank className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink">{goal.name}</p>
          {goal.deadline && <p className="text-[11px] text-muted">Deadline: {goal.deadline}</p>}
        </div>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <span className="text-xs text-muted">{formatNominal(goal.savedAmount)} terkumpul</span>
        <span className="text-xs font-bold text-ink">{pct}%</span>
      </div>
      <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-mist">
        <motion.div
          className={cn('h-full rounded-full', goal.isCompleted ? 'bg-lime-500' : 'bg-accent')}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <p className="mb-3 text-xs text-muted">
        Target: {formatNominal(goal.targetAmount)} · Sisa: {formatNominal(goal.remaining)}
      </p>

      <div className="flex gap-2">
        {!goal.isCompleted && (
          <Button size="sm" variant="outline" leftIcon={<TrendingUp className="h-3 w-3" />} onClick={() => onAdd(goal)} className="flex-1">
            Tambah
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onDelete(goal)} className="text-muted hover:text-coral">
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}
