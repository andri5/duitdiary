import { Share, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { DashboardSummary, Transaction } from './finance';
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

function escCsv(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export async function exportTransactionsCsv(
  transactions: Transaction[],
  summary: DashboardSummary,
  period: keyof typeof PERIOD_LABEL
): Promise<void> {
  const header = ['No', 'Tanggal', 'Tipe', 'Deskripsi', 'Kategori', 'Nominal'];
  const sorted = [...transactions].sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  const rows = sorted.map((tx, i) => [
    String(i + 1),
    tx.date,
    tx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran',
    escCsv(tx.description || tx.note || '-'),
    escCsv(tx.category?.name || 'Umum'),
    String(tx.amount),
  ]);

  const summaryRows = [
    [],
    ['Ringkasan'],
    ['Periode', PERIOD_LABEL[period]],
    ['Rentang', `${summary.periodStart} s/d ${summary.periodEnd}`],
    ['Total Pemasukan', String(summary.totalIncome)],
    ['Total Pengeluaran', String(summary.totalExpenses)],
    ['Saldo', String(summary.balance)],
  ];

  const csv = [
    header.join(','),
    ...rows.map((r) => r.join(',')),
    ...summaryRows.map((r) => r.join(',')),
  ].join('\n');

  const stamp = new Date().toISOString().replace(/[:\-T]/g, '').slice(0, 14);
  const filename = `duitdiary-laporan-${stamp}.csv`;
  const path = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(path, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Laporan DuitDiary',
      UTI: 'public.comma-separated-values-text',
    });
  } else {
    Alert.alert('Export', 'File disimpan ke cache. Sharing tidak tersedia di perangkat ini.');
  }
}
