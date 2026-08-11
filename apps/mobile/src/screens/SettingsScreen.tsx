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
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateProfile } from '../lib/auth';
import { useAuth } from '../authContext';
import { authImageSource, uploadAvatar } from '../lib/upload';
import { colors } from '../theme';
import type { MainStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

const CURRENCIES = ['IDR', 'USD', 'SGD', 'MYR'] as const;

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'IDR');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarSource, setAvatarSource] = useState<{
    uri: string;
    headers?: { Authorization: string };
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCurrency(user.currency || 'IDR');
      setAvatar(user.avatar || null);
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const src = await authImageSource(avatar);
      if (!cancelled) setAvatarSource(src);
    })();
    return () => {
      cancelled = true;
    };
  }, [avatar]);

  const onSave = async () => {
    setError(null);
    if (name.trim().length < 2) {
      setError('Nama minimal 2 karakter.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateProfile({
        name: name.trim(),
        currency: currency.slice(0, 3).toUpperCase(),
      });
      setUser(updated);
      Alert.alert('Berhasil', 'Profil diperbarui.');
      navigation.goBack();
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menyimpan profil.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const onPickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Izin diperlukan', 'Izinkan akses galeri untuk mengganti foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const uploaded = await uploadAvatar(
        asset.uri,
        asset.mimeType || 'image/jpeg',
        asset.fileName || undefined
      );
      setAvatar(uploaded.user.avatar || uploaded.url);
      setUser(uploaded.user);
      Alert.alert('Berhasil', 'Foto profil diperbarui.');
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengunggah foto.';
      Alert.alert('Gagal', message);
    } finally {
      setUploading(false);
    }
  };

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
        <View style={styles.avatarWrap}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarLetter}>
                {(name || user?.email || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Pressable style={styles.avatarBtn} onPress={onPickAvatar} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.avatarBtnText}>
                {avatar ? 'Ganti foto' : 'Unggah foto'}
              </Text>
            )}
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <Text style={styles.emailReadonly}>{user?.email || '—'}</Text>

        <Text style={styles.label}>Nama</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Mata uang</Text>
        <View style={styles.currencyRow}>
          {CURRENCIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCurrency(c)}
              style={[styles.currencyChip, currency === c && styles.currencyChipActive]}
            >
              <Text
                style={[styles.currencyText, currency === c && styles.currencyTextActive]}
              >
                {c}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.saveBtn} onPress={onSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Simpan</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 16 },
  avatarWrap: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.border },
  avatarFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand },
  avatarLetter: { color: '#fff', fontSize: 36, fontWeight: '800' },
  avatarBtn: {
    marginTop: 12,
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  avatarBtnText: { color: '#fff', fontWeight: '700' },
  label: { fontWeight: '600', color: colors.muted, marginBottom: 6, marginTop: 8 },
  emailReadonly: {
    backgroundColor: '#eef2f7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  currencyChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyChipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  currencyText: { fontWeight: '700', color: colors.muted },
  currencyTextActive: { color: '#fff' },
  saveBtn: {
    marginTop: 28,
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  error: {
    backgroundColor: colors.dangerBg,
    color: colors.dangerText,
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
});
