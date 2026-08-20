import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Shield, ShieldOff, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Card, Button, Modal, ModalFooter, Badge } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  currency: string;
  createdAt: string;
  _count: { expenses: number; savingsGoals: number; budgets: number };
}

export function AdminUsers() {
  const toast = useToast();
  const qc = useQueryClient();
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.data as AdminUser[];
    },
  });

  const roleMut = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      await api.patch(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('Role diperbarui');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Gagal update role'),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      toast.success('User dihapus');
      setDeleteUser(null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Gagal hapus user'),
  });

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-extrabold text-ink">Kelola User</h1>
      <p className="mb-6 text-sm text-muted">{users.length} user terdaftar</p>

      {isLoading ? (
        <p className="text-muted">Memuat...</p>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-mist/40 text-left">
                  <th className="px-4 py-3 font-semibold text-muted">User</th>
                  <th className="px-4 py-3 font-semibold text-muted">Role</th>
                  <th className="px-4 py-3 font-semibold text-muted">Transaksi</th>
                  <th className="px-4 py-3 font-semibold text-muted">Savings</th>
                  <th className="px-4 py-3 font-semibold text-muted">Budget</th>
                  <th className="px-4 py-3 font-semibold text-muted">Daftar</th>
                  <th className="px-4 py-3 font-semibold text-muted">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-line last:border-0 hover:bg-mist/20">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{u.name}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'ADMIN' ? 'accent' : 'default'} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-ink">{u._count.expenses}</td>
                    <td className="px-4 py-3 text-ink">{u._count.savingsGoals}</td>
                    <td className="px-4 py-3 text-ink">{u._count.budgets}</td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={roleMut.isPending}
                          onClick={() =>
                            roleMut.mutate({
                              id: u.id,
                              role: u.role === 'ADMIN' ? 'USER' : 'ADMIN',
                            })
                          }
                          className="rounded-lg p-1.5 text-muted transition hover:bg-violet-100 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-60"
                          title={u.role === 'ADMIN' ? 'Jadikan User' : 'Jadikan Admin'}
                        >
                          {roleMut.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : u.role === 'ADMIN' ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteUser(u)}
                          className="rounded-lg p-1.5 text-muted transition hover:bg-coral-soft hover:text-coral"
                          title="Hapus user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={!!deleteUser} onClose={() => setDeleteUser(null)} title="Hapus User" size="sm">
        <p className="text-muted">
          Hapus user <strong className="text-ink">{deleteUser?.name}</strong> ({deleteUser?.email})? Semua data akan terhapus permanen.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setDeleteUser(null)}>Batal</Button>
          <Button variant="danger" isLoading={deleteMut.isPending} onClick={() => deleteUser && deleteMut.mutate(deleteUser.id)}>
            Hapus
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
