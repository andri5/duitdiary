import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { User } from '../lib/auth';
import {
  getDashboardSummary,
  getMarketQuotes,
  type DashboardSummary,
  type MarketQuotes,
  type Transaction,
} from '../lib/finance';
import { formatIDR, formatDateShort } from '../lib/format';
import { colors } from '../theme';
import type { MainStackParamList } from '../navigation/types';

function TxRow({
  item,
  onPress,
}: {
  item: Transaction;
  onPress: () => void;
}) {
  const isIncome = item.type === 'INCOME';
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: item.category.color || colors.brand }]} />
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.description || item.category.name || 'Transaksi'}
        </Text>
        <Text style={styles.rowMeta}>
          {item.category.name || '—'} · {formatDateShort(item.date)}
        </Text>
      </View>
      <Text style={[styles.rowAmount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? '+' : '−'}
        {formatIDR(item.amount)}
      </Text>
    </Pressable>
  );
}

export function DashboardScreen({ user }: { user: User }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [market, setMarket] = useState<MarketQuotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const openAdd = () => navigation.navigate('TransactionForm', undefined);
  const openEdit = (id: string) => navigation.navigate('TransactionForm', { id });

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [data, quotes] = await Promise.all([
        getDashboardSummary(period),
        getMarketQuotes(),
      ]);
      setSummary(data);
      setMarket(quotes);
    } catch {
      setError('Gagal memuat ringkasan. Tarik untuk refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const recent = [
    ...(summary?.recentIncomes || []).map((t) => ({ ...t, type: 'INCOME' as const })),
    ...(summary?.recentExpenses || []).map((t) => ({ ...t, type: 'EXPENSE' as const })),
  ]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 8);

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Math.max(insets.top, 12) + 12, paddingBottom: 24 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load(true);
          }}
          tintColor={colors.brand}
        />
      }
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hello}>Halo, {user.name.split(' ')[0]}</Text>
          <Text style={styles.sub}>Ringkasan keuanganmu</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Tambah</Text>
        </Pressable>
      </View>

      <Pressable style={styles.cta} onPress={openAdd}>
        <Text style={styles.ctaTitle}>Catat transaksi</Text>
        <Text style={styles.ctaSub}>Tambah pemasukan atau pengeluaran</Text>
      </Pressable>

      {market?.usdIdr || market?.gold ? (
        <View style={styles.marketRow}>
          {market.usdIdr ? (
            <View style={styles.marketCard}>
              <Text style={styles.marketLabel}>USD/IDR</Text>
              <Text style={styles.marketValue}>{formatIDR(market.usdIdr.rate)}</Text>
            </View>
          ) : null}
          {market.gold ? (
            <View style={styles.marketCard}>
              <Text style={styles.marketLabel}>Emas/gr</Text>
              <Text style={styles.marketValue}>{formatIDR(market.gold.sellPerGram)}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.periodRow}>
        {(['week', 'month', 'year'] as const).map((p) => (
          <Pressable
            key={p}
            onPress={() => setPeriod(p)}
            style={[styles.periodChip, period === p && styles.periodChipActive]}
          >
            <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
              {p === 'week' ? 'Minggu' : p === 'month' ? 'Bulan' : 'Tahun'}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading && !summary ? (
        <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : summary ? (
        <>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo periode</Text>
            <Text
              style={[
                styles.balanceValue,
                { color: summary.balance >= 0 ? colors.income : colors.expense },
              ]}
            >
              {formatIDR(summary.balance)}
            </Text>
            <Text style={styles.balanceRange}>
              {formatDateShort(summary.periodStart)} – {formatDateShort(summary.periodEnd)}
            </Text>
          </View>

          <View style={styles.statRow}>
            <View style={[styles.statCard, { borderColor: '#bbf7d0' }]}>
              <Text style={styles.statLabel}>Pemasukan</Text>
              <Text style={[styles.statValue, { color: colors.income }]}>
                {formatIDR(summary.totalIncome)}
              </Text>
              <Text style={styles.statCount}>{summary.incomeCount} transaksi</Text>
            </View>
            <View style={[styles.statCard, { borderColor: '#fecaca' }]}>
              <Text style={styles.statLabel}>Pengeluaran</Text>
              <Text style={[styles.statValue, { color: colors.expense }]}>
                {formatIDR(summary.totalExpenses)}
              </Text>
              <Text style={styles.statCount}>{summary.expenseCount} transaksi</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Terbaru</Text>
          {recent.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
              <Text style={styles.emptyBody}>Tap + Tambah untuk mulai mencatat.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.hint}>Tap item untuk edit</Text>
              {recent.map((item) => (
                <TxRow
                  key={`${item.type}-${item.id}`}
                  item={item}
                  onPress={() => openEdit(item.id)}
                />
              ))}
            </>
          )}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  hello: { fontSize: 26, fontWeight: '800', color: colors.text },
  sub: { marginTop: 4, color: colors.muted },
  addBtn: {
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  cta: {
    backgroundColor: '#ecfdf8',
    borderWidth: 1,
    borderColor: '#99f6e4',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  ctaTitle: { fontWeight: '800', color: colors.brandDark, fontSize: 15 },
  ctaSub: { marginTop: 4, color: colors.muted, fontSize: 13 },
  marketRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  marketCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  marketLabel: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  marketValue: { marginTop: 4, fontWeight: '800', color: colors.text, fontSize: 14 },
  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  periodChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  periodText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  periodTextActive: { color: '#fff' },
  balanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 12,
  },
  balanceLabel: { color: colors.muted, fontWeight: '600', fontSize: 13 },
  balanceValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  balanceRange: { marginTop: 6, color: colors.faint, fontSize: 12 },
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  statLabel: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  statValue: { fontSize: 15, fontWeight: '800', marginTop: 6 },
  statCount: { marginTop: 4, fontSize: 11, color: colors.faint },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  hint: { color: colors.faint, fontSize: 12, marginBottom: 10 },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 8,
  },
  emptyTitle: { fontWeight: '800', color: colors.text },
  emptyBody: { marginTop: 6, color: colors.muted },
  error: {
    backgroundColor: colors.dangerBg,
    color: colors.dangerText,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { fontWeight: '700', color: colors.text, fontSize: 14 },
  rowMeta: { color: colors.faint, fontSize: 12, marginTop: 2 },
  rowAmount: { fontWeight: '700', fontSize: 13, marginLeft: 8 },
});
