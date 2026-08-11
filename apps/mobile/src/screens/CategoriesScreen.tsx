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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  deleteCategory,
  getCategories,
  type Category,
  type TxType,
} from '../lib/finance';
import { colors } from '../theme';
import type { MainStackParamList } from '../navigation/types';

export function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [items, setItems] = useState<Category[]>([]);
  const [filter, setFilter] = useState<TxType | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getCategories(filter === 'ALL' ? undefined : filter);
      setItems(data);
    } catch {
      setError('Gagal memuat kategori.');
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

  const onDelete = (item: Category) => {
    Alert.alert('Hapus kategori?', item.name, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(item.id);
            Alert.alert('Berhasil', 'Kategori dihapus.');
            setItems((prev) => prev.filter((c) => c.id !== item.id));
          } catch (e: unknown) {
            const message =
              (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              'Tidak bisa menghapus kategori.';
            Alert.alert('Gagal', message);
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.filterRow}>
        {([
          ['ALL', 'Semua'],
          ['EXPENSE', 'Keluar'],
          ['INCOME', 'Masuk'],
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

      <Pressable
        style={styles.addBtn}
        onPress={() => navigation.navigate('CategoryForm')}
      >
        <Text style={styles.addBtnText}>+ Tambah kategori</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && items.length === 0 ? (
        <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
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
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Belum ada kategori</Text>
              <Text style={styles.emptyBody}>
                Buat kategori pemasukan/pengeluaran supaya bisa mencatat transaksi.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => navigation.navigate('CategoryForm', { id: item.id })}
              onLongPress={() => onDelete(item)}
            >
              <View style={[styles.dot, { backgroundColor: item.color || colors.brand }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  {item.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                  {item.icon ? ` · ${item.icon}` : ''}
                </Text>
              </View>
              <Text style={styles.editHint}>Edit</Text>
            </Pressable>
          )}
        />
      )}
      <Text style={styles.footerHint}>Tap untuk edit · Tahan untuk hapus</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20, paddingTop: 12 },
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
  addBtn: {
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  addBtnText: { color: '#fff', fontWeight: '700' },
  empty: { marginTop: 48, paddingHorizontal: 12, alignItems: 'center' },
  emptyTitle: { fontWeight: '800', fontSize: 16, color: colors.text },
  emptyBody: { marginTop: 8, color: colors.muted, textAlign: 'center', lineHeight: 20 },
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
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  rowTitle: { fontWeight: '700', color: colors.text },
  rowMeta: { color: colors.faint, fontSize: 12, marginTop: 2 },
  editHint: { color: colors.brand, fontWeight: '600', fontSize: 12 },
  footerHint: {
    textAlign: 'center',
    color: colors.faint,
    fontSize: 12,
    paddingVertical: 8,
  },
});
