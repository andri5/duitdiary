import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  getTransactions,
  deleteTransaction,
  type Transaction,
  type TxType,
} from '../lib/finance';
import { formatIDR, formatDateShort } from '../lib/format';
import { colors } from '../theme';
import type { MainStackParamList } from '../navigation/types';

export function TransactionsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [items, setItems] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TxType | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { items: data } = await getTransactions({
        limit: 50,
        type: filter === 'ALL' ? undefined : filter,
      });
      setItems(data);
    } catch {
      setError('Gagal memuat transaksi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onDelete = (item: Transaction) => {
    Alert.alert('Hapus transaksi?', item.description || item.category.name || 'Transaksi', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransaction(item.id);
            setItems((prev) => prev.filter((t) => t.id !== item.id));
          } catch {
            Alert.alert('Gagal', 'Tidak bisa menghapus transaksi.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transaksi</Text>
          <Text style={styles.sub}>Pemasukan & pengeluaran</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={() => navigation.navigate('AddTransaction')}>
          <Text style={styles.addBtnText}>+ Tambah</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {([
          ['ALL', 'Semua'],
          ['INCOME', 'Masuk'],
          ['EXPENSE', 'Keluar'],
        ] as const).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setFilter(key)}
            style={[styles.chip, filter === key && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === key && styles.chipTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && items.length === 0 ? (
        <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
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
          ListEmptyComponent={
            <Text style={styles.empty}>Belum ada transaksi. Tap + Tambah untuk mulai.</Text>
          }
          renderItem={({ item }) => {
            const isIncome = item.type === 'INCOME';
            return (
              <Pressable style={styles.row} onLongPress={() => onDelete(item)}>
                <View
                  style={[styles.dot, { backgroundColor: item.category.color || colors.brand }]}
                />
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {item.description || item.category.name || 'Transaksi'}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {item.category.name || '—'} · {formatDateShort(item.date)}
                  </Text>
                </View>
                <Text
                  style={[styles.rowAmount, { color: isIncome ? colors.income : colors.expense }]}
                >
                  {isIncome ? '+' : '−'}
                  {formatIDR(item.amount)}
                </Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 56 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  sub: { marginTop: 4, color: colors.muted },
  addBtn: {
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  chipTextActive: { color: '#fff' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 48, paddingHorizontal: 24 },
  error: {
    backgroundColor: colors.dangerBg,
    color: colors.dangerText,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
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
