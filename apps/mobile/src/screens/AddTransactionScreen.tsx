import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  createTransaction,
  getCategories,
  type Category,
  type TxType,
} from '../lib/finance';
import { todayISO } from '../lib/format';
import { colors } from '../theme';
import type { MainStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'AddTransaction'>;

export function AddTransactionScreen({ navigation }: Props) {
  const [type, setType] = useState<TxType>('EXPENSE');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayISO());
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingCats(true);
      setCategoryId(null);
      try {
        const list = await getCategories(type);
        if (!cancelled) {
          setCategories(list);
          setCategoryId(list[0]?.id ?? null);
        }
      } catch {
        if (!cancelled) setError('Gagal memuat kategori.');
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [type]);

  const onSave = async () => {
    setError(null);
    const parsed = Number(String(amount).replace(/\./g, '').replace(',', '.'));
    if (!parsed || parsed <= 0) {
      setError('Masukkan jumlah yang valid.');
      return;
    }
    if (!categoryId) {
      setError('Pilih kategori.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError('Tanggal harus format YYYY-MM-DD.');
      return;
    }

    setSaving(true);
    try {
      await createTransaction({
        amount: parsed,
        categoryId,
        type,
        date,
        description: note.trim() || undefined,
      });
      navigation.goBack();
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menyimpan transaksi.';
      setError(message);
      Alert.alert('Gagal', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tambah transaksi</Text>

        <View style={styles.typeRow}>
          {(['EXPENSE', 'INCOME'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[styles.typeChip, type === t && styles.typeChipActive]}
            >
              <Text style={[styles.typeText, type === t && styles.typeTextActive]}>
                {t === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}
              </Text>
            </Pressable>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Jumlah (Rp)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="50000"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Tanggal (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} autoCapitalize="none" />

        <Text style={styles.label}>Catatan (opsional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Misal: makan siang"
          value={note}
          onChangeText={setNote}
        />

        <Text style={styles.label}>Kategori</Text>
        {loadingCats ? (
          <ActivityIndicator color={colors.brand} />
        ) : categories.length === 0 ? (
          <Text style={styles.hint}>Belum ada kategori. Buat dulu di web/settings.</Text>
        ) : (
          <View style={styles.catWrap}>
            {categories.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setCategoryId(c.id)}
                style={[
                  styles.catChip,
                  categoryId === c.id && {
                    borderColor: c.color || colors.brand,
                    backgroundColor: '#ecfdf8',
                  },
                ]}
              >
                <View style={[styles.catDot, { backgroundColor: c.color || colors.brand }]} />
                <Text style={styles.catName}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable style={styles.saveBtn} onPress={onSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Simpan</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 14 }}>
          <Text style={styles.cancel}>Batal</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 24, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 16 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  typeText: { fontWeight: '700', color: colors.muted },
  typeTextActive: { color: '#fff' },
  label: { fontWeight: '600', color: colors.muted, marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 4,
  },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  catName: { fontWeight: '600', color: colors.text, fontSize: 13 },
  hint: { color: colors.muted, marginBottom: 8 },
  saveBtn: {
    marginTop: 24,
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancel: { textAlign: 'center', color: colors.muted, fontWeight: '600' },
  error: {
    backgroundColor: colors.dangerBg,
    color: colors.dangerText,
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
});
