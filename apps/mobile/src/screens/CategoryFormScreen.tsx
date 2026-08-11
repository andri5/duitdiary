import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  createCategory,
  getCategories,
  updateCategory,
  type TxType,
} from '../lib/finance';
import { colors } from '../theme';
import type { MainStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'CategoryForm'>;

export function CategoryFormScreen({ navigation, route }: Props) {
  const editId = route.params?.id;
  const isEdit = Boolean(editId);
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [type, setType] = useState<TxType>('EXPENSE');
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);
  const [icon, setIcon] = useState<string>(CATEGORY_ICONS[0]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Edit kategori' : 'Tambah kategori' });
  }, [isEdit, navigation]);

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await getCategories();
        const found = list.find((c) => c.id === editId);
        if (!found) throw new Error('not found');
        if (cancelled) return;
        setName(found.name);
        setType(found.type);
        setColor(found.color || CATEGORY_COLORS[0]);
        setIcon(found.icon || CATEGORY_ICONS[0]);
      } catch {
        if (!cancelled) {
          Alert.alert('Gagal', 'Kategori tidak ditemukan.', [
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

  const onSave = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        type,
        color,
        icon,
      };
      if (isEdit && editId) {
        await updateCategory(editId, payload);
        Alert.alert('Berhasil', 'Kategori diperbarui.');
      } else {
        await createCategory(payload);
        Alert.alert('Berhasil', 'Kategori ditambahkan.');
      }
      navigation.goBack();
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menyimpan kategori.';
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
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          placeholder="Misal: Makanan"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Tipe</Text>
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

        <Text style={styles.label}>Warna</Text>
        <View style={styles.swatchWrap}>
          {CATEGORY_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.swatch,
                { backgroundColor: c },
                color === c && styles.swatchActive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.label}>Ikon</Text>
        <View style={styles.iconWrap}>
          {CATEGORY_ICONS.map((ic) => (
            <Pressable
              key={ic}
              onPress={() => setIcon(ic)}
              style={[styles.iconChip, icon === ic && styles.iconChipActive]}
            >
              <Text style={[styles.iconText, icon === ic && styles.iconTextActive]}>{ic}</Text>
            </Pressable>
          ))}
        </View>

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
  label: { fontWeight: '600', color: colors.muted, marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  typeRow: { flexDirection: 'row', gap: 8 },
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
  swatchWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  swatchActive: { borderWidth: 3, borderColor: colors.text },
  iconWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconChipActive: { backgroundColor: '#ecfdf8', borderColor: colors.brand },
  iconText: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  iconTextActive: { color: colors.brand },
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
