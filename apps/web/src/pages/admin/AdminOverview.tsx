import { useQuery } from '@tanstack/react-query';
import { Users, Receipt, MessageSquare, Target, UserPlus } from 'lucide-react';
import api from '@/lib/api';
import { Card } from '@/components/ui';

interface Stats {
  users: number;
  transactions: number;
  feedback: number;
  savingsGoals: number;
  todayUsers: number;
}

export function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data as Stats;
    },
  });

  const cards = [
    { label: 'Total Users', value: data?.users ?? 0, icon: Users, tone: 'bg-violet-100 text-violet-600' },
    { label: 'User Baru Hari Ini', value: data?.todayUsers ?? 0, icon: UserPlus, tone: 'bg-lime-100 text-lime-600' },
    { label: 'Total Transaksi', value: data?.transactions ?? 0, icon: Receipt, tone: 'bg-accent-soft text-accent' },
    { label: 'Target Tabungan', value: data?.savingsGoals ?? 0, icon: Target, tone: 'bg-amber-100 text-amber-600' },
    { label: 'Feedback Masuk', value: data?.feedback ?? 0, icon: MessageSquare, tone: 'bg-cyan-100 text-cyan-600' },
  ];

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-extrabold text-ink">Overview</h1>
      <p className="mb-6 text-sm text-muted">Ringkasan statistik DuitDiary</p>

      {isLoading ? (
        <p className="text-muted">Memuat...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((c) => (
            <Card key={c.label} padding="md">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tone}`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted">{c.label}</p>
                  <p className="font-display text-xl font-extrabold text-ink">
                    {c.value.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
