/**
 * Dashboard market rates — USD/IDR + Antam gold + BI Rate strip
 */

import { DollarSign, Gem, Landmark, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui';
import { useMarketRates } from '@/hooks/useMarketRates';
import { formatCurrency, cn } from '@/lib/utils';

export function MarketRates() {
  const { data, isLoading, isError, isFetching, refetch } = useMarketRates();

  if (isLoading) {
    return (
      <div className="mb-4 animate-pulse rounded-2xl border border-line bg-surface/80 px-3 py-2.5">
        <div className="flex gap-3">
          <div className="h-8 flex-1 rounded-xl bg-mist-deep" />
          <div className="h-8 flex-1 rounded-xl bg-mist-deep" />
          <div className="h-8 flex-1 rounded-xl bg-mist-deep" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-line bg-surface/80 px-3 py-2">
        <p className="text-[11px] text-muted">Kurs & emas gagal dimuat</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-accent hover:bg-accent-soft"
        >
          <RefreshCw className="h-3 w-3" />
          Coba lagi
        </button>
      </div>
    );
  }

  const items = [
    {
      key: 'usd',
      label: 'USD / IDR',
      value: formatCurrency(data.usdIdr.rate),
      icon: DollarSign,
      tone: 'bg-accent-soft text-accent',
    },
    {
      key: 'gold',
      label: 'Emas 1g',
      value: formatCurrency(data.gold.sellPerGram),
      sub: `BB ${formatCurrency(data.gold.buybackPerGram)}`,
      icon: Gem,
      tone: 'bg-amber-soft text-amber',
    },
    ...(data.biRate
      ? [
          {
            key: 'bi',
            label: 'BI Rate',
            value: data.biRate.percentLabel,
            sub: data.biRate.effectiveDate,
            icon: Landmark,
            tone: 'bg-violet-100 text-violet-700',
          },
        ]
      : []),
  ] as const;

  return (
    <Card padding="none" className="mb-4 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 sm:px-3.5">
        <div
          className={cn(
            'grid min-w-0 flex-1 gap-2',
            items.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'
          )}
        >
          {items.map((item) => (
            <div
              key={item.key}
              className="flex min-w-0 items-center gap-2 rounded-xl bg-mist/40 px-2 py-1.5"
            >
              <span
                className={cn(
                  'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg',
                  item.tone
                )}
              >
                <item.icon className="h-3 w-3" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-medium leading-none text-muted">{item.label}</p>
                <p className="mt-0.5 truncate text-xs font-bold tabular text-ink sm:text-[13px]">
                  {item.value}
                </p>
                {'sub' in item && item.sub ? (
                  <p className="truncate text-[9px] text-muted">{item.sub}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-mist hover:text-ink disabled:opacity-60"
          aria-label="Muat ulang kurs"
          title="Perbarui"
        >
          <RefreshCw className={cn('h-3 w-3', isFetching && 'animate-spin')} />
        </button>
      </div>
    </Card>
  );
}
