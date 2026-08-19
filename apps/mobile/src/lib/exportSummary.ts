import { Share } from 'react-native';
import type { DashboardSummary } from './finance';
import { formatIDR, formatDateShort } from './format';

const PERIOD_LABEL = {
  week: 'Minggu',
  month: 'Bulan',
  year: 'Tahun',
} as const;

export function buildSummaryShareText(
  summary: DashboardSummary,
  period: keyof typeof PERIOD_LABEL
): string {
  const lines = [
    `DuitDiary — Ringkasan ${PERIOD_LABEL[period]}`,
    `${formatDateShort(summary.periodStart)} – ${formatDateShort(summary.periodEnd)}`,
    '',
    `Pemasukan: ${formatIDR(summary.totalIncome)}`,
    `Pengeluaran: ${formatIDR(summary.totalExpenses)}`,
    `Saldo: ${formatIDR(summary.balance)}`,
  ];

  const breakdown =
    summary.expenseCategoryBreakdown || summary.categoryBreakdown || [];
  if (breakdown.length > 0) {
    lines.push('', 'Top pengeluaran:');
    breakdown.slice(0, 5).forEach((row) => {
      lines.push(`• ${row.categoryName}: ${formatIDR(row.total)}`);
    });
  }

  return lines.join('\n');
}

export async function shareSummaryReport(
  summary: DashboardSummary,
  period: keyof typeof PERIOD_LABEL
): Promise<void> {
  await Share.share({
    message: buildSummaryShareText(summary, period),
    title: 'Ringkasan DuitDiary',
  });
}
