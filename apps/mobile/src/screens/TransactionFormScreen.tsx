import { useCallback, useEffect, useState } from 'react';
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
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createTransaction,
  getCategories,
  getTransaction,
  updateTransaction,
  type Category,
  type TxType,
} from '../lib/finance';
import { authImageSource, uploadReceipt } from '../lib/upload';
import { formatDateShort, todayISO } from '../lib/format';
import { colors } from '../theme';
import type { MainStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'TransactionForm'>;

function parseAmount(raw: string): number {
  return Number(String(raw).replace(/\./g, '').replace(',', '.'));
}

function isoToDate(iso: string): Date {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function dateToISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function TransactionFormScreen({ navigation, route }: Props) {
  const editId = route.params?.id;
  const isEdit = Boolean(editId);
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<TxType>('EXPENSE');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayISO());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilling, setPrefilling] = useState(isEdit);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<{
    uri: string;
    headers?: { Authorization: string };
  } | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Edit transaksi' : 'Tambah transaksi',
    });
  }, [isEdit, navigation]);

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const tx = await getTransaction(editId);
        if (cancelled) return;
        setType(tx.type);
        setAmount(String(Math.round(tx.amount)));
        setNote(tx.description || '');
        setDate(tx.date.slice(0, 10));
        setCategoryId(tx.categoryId);
        setReceiptUrl(tx.receiptUrl || null);
        setPrefilling(true);
      } catch {
        if (!cancelled) {
          setError('Gagal memuat transaksi.');
          Alert.alert('Gagal', 'Transaksi tidak ditemukan.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editId, navigation]);

  const loadCategories = useCallback(async () => {
    setLoadingCats(true);
    try {
      const list = await getCategories(type);
      setCategories(list);
      setCategoryId((prev) => {
        if (prev && list.some((c) => c.id === prev)) return prev;
        return list[0]?.id ?? null;
      });
    } catch {
      setError('Gagal memuat kategori.');
    } finally {
      setLoadingCats(false);
      setPrefilling(false);
    }
  }, [type]);

  useEffect(() => {
    if (loading && isEdit) return;
    void loadCategories();
  }, [type, loading, isEdit, loadCategories]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const src = await authImageSource(receiptUrl);
      if (!cancelled) setReceiptPreview(src);
    })();
    return () => {
      cancelled = true;
    };
  }, [receiptUrl]);

  const pickReceipt = async (fromCamera: boolean) => {
    if (fromCamera) {
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      if (!cam.granted) {
        Alert.alert('Izin diperlukan', 'Izinkan kamera untuk foto struk.');
        return;
      }
    } else {
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!lib.granted) {
        Alert.alert('Izin diperlukan', 'Izinkan galeri untuk unggah struk.');
        return;
      }
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.7,
        });

    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setUploadingReceipt(true);
    try {
      const uploaded = await uploadReceipt(
        asset.uri,
        asset.mimeType || 'image/jpeg',
        asset.fileName || undefined
      );
      setReceiptUrl(uploaded.url);
      Alert.alert('Berhasil', 'Struk diunggah. Simpan transaksi untuk menyimpan.');
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengunggah struk.';
      Alert.alert('Gagal', message);
    } finally {
      setUploadingReceipt(false);
    }
  };

  const onSave = async () => {
    setError(null);
    const parsed = parseAmount(amount);
    if (!parsed || parsed <= 0) {
      setError('Masukkan jumlah yang valid.');
      return;
    }
    if (!categoryId) {
      setError('Pilih kategori. Buat dulu di Profil → Kelola kategori.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        amount: parsed,
        categoryId,
        type,
        date,
        description: note.trim() || undefined,
        receiptUrl,
      };
      if (isEdit && editId) {
        await updateTransaction(editId, payload);
        Alert.alert('Berhasil', 'Transaksi diperbarui.');
      } else {
        await createTransaction(payload);
        Alert.alert('Berhasil', 'Transaksi ditambahkan.');
      }
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.wrap}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.typeRow}>
          {(['EXPENSE', 'INCOME'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => {
                if (!prefilling) setCategoryId(null);
                setType(t);
              }}
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

        <Text style={styles.label}>Tanggal</Text>
        <Pressable style={styles.dateBtn} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateBtnText}>{formatDateShort(date)}</Text>
          <Text style={styles.dateBtnHint}>Ubah</Text>
        </Pressable>
        {showPicker ? (
          <DateTimePicker
            value={isoToDate(date)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              if (Platform.OS === 'android') setShowPicker(false);
              if (selected) setDate(dateToISO(selected));
            }}
          />
        ) : null}
        {Platform.OS === 'ios' && showPicker ? (
          <Pressable onPress={() => setShowPicker(false)} style={{ marginBottom: 8 }}>
            <Text style={styles.donePicker}>Selesai pilih tanggal</Text>
          </Pressable>
        ) : null}

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
          <View style={styles.emptyBox}>
            <Text style={styles.hint}>Belum ada kategori untuk tipe ini.</Text>
            <Pressable onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.link}>Kelola kategori →</Text>
            </Pressable>
          </View>
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

        <Text style={styles.label}>Struk (opsional)</Text>
        <View style={styles.receiptActions}>
          <Pressable
            style={styles.receiptBtn}
            onPress={() => pickReceipt(false)}
            disabled={uploadingReceipt}
          >
            <Text style={styles.receiptBtnText}>Galeri</Text>
          </Pressable>
          <Pressable
            style={styles.receiptBtn}
            onPress={() => pickReceipt(true)}
            disabled={uploadingReceipt}
          >
            <Text style={styles.receiptBtnText}>Kamera</Text>
          </Pressable>
          {receiptUrl ? (
            <Pressable
              style={[styles.receiptBtn, styles.receiptBtnDanger]}
              onPress={() => setReceiptUrl(null)}
            >
              <Text style={styles.receiptBtnTextDanger}>Hapus</Text>
            </Pressable>
          ) : null}
        </View>
        {uploadingReceipt ? (
          <ActivityIndicator color={colors.brand} style={{ marginVertical: 8 }} />
        ) : null}
        {receiptPreview ? (
          <Image source={receiptPreview} style={styles.receiptImage} resizeMode="cover" />
        ) : (
          <Text style={styles.hint}>Belum ada struk terlampir.</Text>
        )}

        <Pressable style={styles.saveBtn} onPress={onSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>{isEdit ? 'Simpan perubahan' : 'Simpan'}</Text>
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
  content: { padding: 20, paddingTop: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
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
  dateBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBtnText: { fontWeight: '700', color: colors.text },
  dateBtnHint: { color: colors.brand, fontWeight: '600' },
  donePicker: { color: colors.brand, fontWeight: '700', textAlign: 'right' },
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
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  hint: { color: colors.muted, marginBottom: 8 },
  link: { color: colors.brand, fontWeight: '700' },
  receiptActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  receiptBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  receiptBtnDanger: { borderColor: '#fecaca', backgroundColor: '#fef2f2' },
  receiptBtnText: { fontWeight: '700', color: colors.brand },
  receiptBtnTextDanger: { fontWeight: '700', color: colors.expense },
  receiptImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    backgroundColor: colors.border,
    marginBottom: 8,
  },
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
