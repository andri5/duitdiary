import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { buildDashboardInsights, getInsightToneColor } from '../lib/dashboardInsights';
import { formatIDR, formatDateShort } from '../lib/format';
import { BrandMark } from '../components/ui';
import { CategoryIcon } from '../components/CategoryIcon';
import { CollapsibleSection } from '../components/CollapsibleSection';
import {
  FadeInUp,
  ScalePress,
  PopIn,
  AnimatedBar,
  PrivacyEyeToggle,
} from '../components/motion';
import { PageLoader } from '../components/PageStatus';
import { radii, type ThemeColors } from '../theme';
import { useColors } from '../themeContext';
import { useResponsive } from '../hooks/useResponsive';
import type { MainStackParamList } from '../navigation/types';

const HIDDEN_AMOUNT = '••••';

function TxRow({
  item,
  onPress,
  amountsVisible,
  delay = 0,
}: {
  item: Transaction;
  onPress: () => void;
  amountsVisible: boolean;
  delay?: number;
}) {
  const colors = useColors();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(colors, r), [colors, r]);
  const isIncome = item.type === 'INCOME';
  return (
    <FadeInUp delay={delay} distance={10}>
      <ScalePress style={styles.row} onPress={onPress}>
        <CategoryIcon icon={item.category.icon} color={item.category.color} size={14} box={32} />
        <View style={styles.rowBody}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {item.description || item.category.name || 'Transaksi'}
          </Text>
          <Text style={styles.rowMeta}>
            {item.category.name || '—'} · {formatDateShort(item.date)}
          </Text>
        </View>
        <Text style={[styles.rowAmount, { color: isIncome ? colors.income : colors.expense }]}>
          {amountsVisible ? (
            <>
              {isIncome ? '+' : '−'}
              {formatIDR(item.amount)}
            </>
          ) : (
            HIDDEN_AMOUNT
          )}
        </Text>
      </ScalePress>
    </FadeInUp>
  );
}

export function DashboardScreen({ user }: { user: User }) {
  const colors = useColors();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(colors, r), [colors, r]);
  const insightToneColor = useMemo(() => getInsightToneColor(colors), [colors]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [market, setMarket] = useState<MarketQuotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [amountsVisible, setAmountsVisible] = useState(true);

  const showAmount = (n: number) => (amountsVisible ? formatIDR(n) : HIDDEN_AMOUNT);

  const openEdit = (id: string) => navigation.navigate('TransactionForm', { id });

  const load = useCallback(
    async (silent = false) => {
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
    },
    [period]
  );

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
    .slice(0, 5);

  const breakdown =
    summary?.expenseCategoryBreakdown ||
    summary?.categoryBreakdown ||
    summary?.topCategories ||
    [];
  const maxBreakdown = Math.max(...breakdown.map((b) => b.total), 1);
  const insights = summary ? buildDashboardInsights(summary).slice(0, 2) : [];
  const categoryItems = breakdown.slice(0, 4);

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={[
        styles.content,
        r.pageStyle,
        {
          paddingTop: Math.max(insets.top, 10) + 8,
          paddingBottom: 28,
        },
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
      <View style={r.contentStyle}>
      <FadeInUp>
        <View style={styles.topBar}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <BrandMark size="sm" />
            <Text style={styles.hello} numberOfLines={1}>
              Halo, {user.name.split(' ')[0]}
            </Text>
          </View>
          <View style={styles.topActions}>
            <PrivacyEyeToggle
              visible={amountsVisible}
              onToggle={() => setAmountsVisible((v) => !v)}
            />
          </View>
        </View>
      </FadeInUp>

      {(market?.usdIdr || market?.gold) && (
        <FadeInUp delay={40}>
          <View style={styles.marketStrip}>
            {market.usdIdr ? (
              <View style={styles.marketChip}>
                <Text style={styles.marketLabel}>USD</Text>
                <Text style={styles.marketValue}>{formatIDR(market.usdIdr.rate)}</Text>
              </View>
            ) : null}
            {market.gold ? (
              <View style={styles.marketChip}>
                <Text style={styles.marketLabel}>Emas</Text>
                <Text style={styles.marketValue}>{formatIDR(market.gold.sellPerGram)}</Text>
              </View>
            ) : null}
          </View>
        </FadeInUp>
      )}

      <FadeInUp delay={70}>
        <View style={styles.periodSeg}>
          {(['week', 'month', 'year'] as const).map((p) => {
            const active = period === p;
            return (
              <Pressable
                key={p}
                style={[styles.periodItem, active && styles.periodItemActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.periodText, active && styles.periodTextActive]}>
                  {p === 'week' ? 'Minggu' : p === 'month' ? 'Bulan' : 'Tahun'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </FadeInUp>

      {loading && !summary ? (
        <PageLoader label="Memuat beranda…" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : summary ? (
        <>
          <PopIn delay={90}>
            <View style={styles.balanceCard}>
              <View style={styles.balanceTop}>
                <Text style={styles.balanceLabel}>Saldo</Text>
                <Text style={styles.balanceRange}>
                  {formatDateShort(summary.periodStart)} – {formatDateShort(summary.periodEnd)}
                </Text>
              </View>
              <Text
                style={[
                  styles.balanceValue,
                  { color: summary.balance >= 0 ? colors.income : colors.expense },
                ]}
              >
                {showAmount(summary.balance)}
              </Text>
              <ScalePress
                style={styles.quickAdd}
                onPress={() => navigation.navigate('TransactionForm', { captureReceipt: true })}
              >
                <Ionicons name="camera" size={14} color={colors.brandDark} />
                <Text style={styles.quickAddText}>Foto struk</Text>
              </ScalePress>
            </View>
          </PopIn>

          <FadeInUp delay={130}>
            <View style={styles.statRow}>
              <View style={[styles.statCard, { borderColor: colors.incomeBorder }]}>
                <View style={styles.statHead}>
                  <Ionicons name="arrow-down-circle" size={16} color={colors.income} />
                  <Text style={styles.statLabel}>Masuk</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.income }]}>
                  {showAmount(summary.totalIncome)}
                </Text>
              </View>
              <View style={[styles.statCard, { borderColor: colors.expenseBorder }]}>
                <View style={styles.statHead}>
                  <Ionicons name="arrow-up-circle" size={16} color={colors.expense} />
                  <Text style={styles.statLabel}>Keluar</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.expense }]}>
                  {showAmount(summary.totalExpenses)}
                </Text>
              </View>
            </View>
          </FadeInUp>

          {amountsVisible && insights.length > 0 ? (
            <FadeInUp delay={160}>
              <CollapsibleSection title="Saran AI" count={insights.length} defaultOpen>
                {insights.map((insight) => (
                  <View key={insight.id} style={styles.insightCard}>
                    <Text
                      style={[styles.insightTitle, { color: insightToneColor[insight.tone] }]}
                      numberOfLines={1}
                    >
                      {insight.title}
                    </Text>
                    <Text style={styles.insightBody} numberOfLines={2}>
                      {insight.message}
                    </Text>
                  </View>
                ))}
              </CollapsibleSection>
            </FadeInUp>
          ) : null}

          {categoryItems.length > 0 ? (
            <FadeInUp delay={190}>
              <CollapsibleSection title="Per kategori" count={categoryItems.length} defaultOpen>
                {categoryItems.map((item) => (
                  <View key={item.categoryId || item.categoryName} style={styles.barRow}>
                    <View style={styles.barMeta}>
                      <Text style={styles.barName} numberOfLines={1}>
                        {item.categoryName}
                      </Text>
                      <Text style={styles.barAmount}>{showAmount(item.total)}</Text>
                    </View>
                    <AnimatedBar
                      progress={item.total / maxBreakdown}
                      color={item.categoryColor || item.color || colors.brand}
                    />
                  </View>
                ))}
              </CollapsibleSection>
            </FadeInUp>
          ) : null}

          <FadeInUp delay={220}>
            <Text style={styles.sectionTitle}>Terbaru</Text>
          </FadeInUp>
          {recent.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
              <Text style={styles.emptyBody}>Tap + untuk mulai mencatat.</Text>
            </View>
          ) : (
            recent.map((item, i) => (
              <TxRow
                key={`${item.type}-${item.id}`}
                item={item}
                amountsVisible={amountsVisible}
                delay={240 + i * 45}
                onPress={() => openEdit(item.id)}
              />
            ))
          )}
        </>
      ) : null}
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors, r: ReturnType<typeof useResponsive>) {
  return StyleSheet.create({
    wrap: { flex: 1, backgroundColor: colors.bg },
    content: { flexGrow: 1 },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },
    hello: {
      marginTop: 4,
      fontSize: r.ms(22),
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.4,
    },
    topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    marketStrip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
    marketChip: {
      flexGrow: 1,
      flexBasis: r.isCompact ? '100%' : '45%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 8,
      paddingHorizontal: 12,
      minWidth: r.isCompact ? '100%' : 140,
    },
    marketLabel: { color: colors.muted, fontSize: r.ms(11), fontWeight: '700' },
    marketValue: { fontWeight: '800', color: colors.text, fontSize: r.ms(12) },
    periodSeg: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 3,
      marginBottom: 12,
    },
    periodItem: {
      flex: 1,
      paddingVertical: r.vs(8),
      borderRadius: radii.sm,
      alignItems: 'center',
    },
    periodItemActive: { backgroundColor: colors.brand },
    periodText: { fontWeight: '700', fontSize: r.ms(12), color: colors.muted },
    periodTextActive: { color: colors.onBrand },
    balanceCard: {
      backgroundColor: colors.surface,
      borderRadius: radii.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: r.ms(14),
      marginBottom: 10,
    },
    balanceTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    balanceLabel: { color: colors.muted, fontWeight: '700', fontSize: r.ms(12) },
    balanceValue: { fontSize: r.ms(26), fontWeight: '800', marginTop: 4, letterSpacing: -0.6 },
    balanceRange: { color: colors.faint, fontSize: r.ms(11) },
    quickAdd: {
      marginTop: 10,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.brandSoft,
      borderRadius: radii.pill,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.brandSoftBorder,
    },
    quickAddText: { color: colors.brandDark, fontWeight: '800', fontSize: r.ms(12) },
    statRow: {
      flexDirection: r.isCompact ? 'column' : 'row',
      gap: 8,
      marginBottom: 14,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      padding: 10,
    },
    statHead: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    statLabel: { color: colors.muted, fontSize: r.ms(11), fontWeight: '700' },
    statValue: { fontSize: r.ms(14), fontWeight: '800', marginTop: 6 },
    sectionTitle: {
      fontSize: r.ms(13),
      fontWeight: '800',
      color: colors.text,
      marginBottom: 8,
      marginTop: 4,
      letterSpacing: 0.2,
    },
    insightCard: {
      backgroundColor: colors.bg,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      marginBottom: 6,
    },
    insightTitle: { fontWeight: '800', fontSize: r.ms(13), marginBottom: 2 },
    insightBody: { color: colors.muted, fontSize: r.ms(12), lineHeight: 16 },
    barRow: { marginBottom: 8 },
    barMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    barName: { flex: 1, fontWeight: '600', color: colors.text, fontSize: r.ms(12), marginRight: 8 },
    barAmount: { fontWeight: '700', color: colors.muted, fontSize: r.ms(11) },
    emptyBox: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    emptyTitle: { fontWeight: '800', color: colors.text, fontSize: r.ms(14) },
    emptyBody: { marginTop: 4, color: colors.muted, fontSize: r.ms(12) },
    error: {
      backgroundColor: colors.dangerBg,
      color: colors.dangerText,
      padding: 10,
      borderRadius: 12,
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 9,
      paddingHorizontal: 10,
      marginBottom: 6,
      gap: 10,
    },
    rowBody: { flex: 1, minWidth: 0 },
    rowTitle: { fontWeight: '700', color: colors.text, fontSize: r.ms(13) },
    rowMeta: { color: colors.faint, fontSize: r.ms(11), marginTop: 1 },
    rowAmount: { fontWeight: '800', fontSize: r.ms(12) },
  });
}
