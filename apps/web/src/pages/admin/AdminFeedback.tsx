import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import api from '@/lib/api';
import { Card, Button, EmptyState } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';

interface FeedbackItem {
  id: string;
  name: string | null;
  message: string;
  rating: number;
  createdAt: string;
}

export function AdminFeedback() {
  const toast = useToast();
  const qc = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin', 'feedback'],
    queryFn: async () => {
      const res = await api.get('/admin/feedback');
      return res.data.data as FeedbackItem[];
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/feedback/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] });
      toast.success('Feedback dihapus');
    },
  });

  const avgRating =
    items.length > 0
      ? (items.reduce((s, f) => s + f.rating, 0) / items.filter((f) => f.rating > 0).length || 0).toFixed(1)
      : '0';

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 font-display text-2xl font-extrabold text-ink">Feedback</h1>
          <p className="text-sm text-muted">{items.length} masukan dari pengguna</p>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-amber-700">Rata-rata {avgRating}/5</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="text-muted">Memuat...</p>
      ) : items.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<MessageSquare className="h-7 w-7" />}
            title="Belum ada feedback"
            description="Feedback dari landing page dan mobile akan muncul di sini"
          />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <Card key={f.id} padding="md" className="relative">
              <button
                onClick={() => deleteMut.mutate(f.id)}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-muted transition hover:bg-coral-soft hover:text-coral"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              {f.rating > 0 && (
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < f.rating ? 'fill-amber-400 text-amber-400' : 'text-line'
                      }`}
                    />
                  ))}
                </div>
              )}

              <p className="mb-3 text-sm leading-relaxed text-ink">"{f.message}"</p>

              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted">{f.name || 'Anonim'}</p>
                <p className="text-[11px] text-muted">{formatDate(f.createdAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
