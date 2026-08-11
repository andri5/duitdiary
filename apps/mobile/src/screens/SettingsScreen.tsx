import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateProfile, changePassword } from '../lib/auth';
import { useAuth } from '../authContext';
import { authImageSource, uploadAvatar } from '../lib/upload';
import { PasswordInput, AppTextInput } from '../components/ui';
import { FadeInUp, ScalePress, PopIn } from '../components/motion';
import { useDialog } from '../components/AppDialog';
import { THEME_OPTIONS, type ThemeColors } from '../theme';
import { useColors, useTheme } from '../themeContext';
import { useResponsive } from '../hooks/useResponsive';
import type { MainStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

const CURRENCIES = [
  {
    code: 'IDR' as const,
    label: 'Rupiah',
    hint: 'Indonesia',
    symbol: 'Rp',
    icon: 'cash-outline' as const,
    tint: '#0f9b8e',
    soft: '#d9f5f1',
  },
  {
    code: 'USD' as const,
    label: 'US Dollar',
    hint: 'United States',
    symbol: '$',
    icon: 'logo-usd' as const,
    tint: '#2563eb',
    soft: '#dbeafe',
  },
];

export function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { showDialog } = useDialog();
  const { user, setUser } = useAuth();
  const colors = useColors();
  const { theme, setTheme } = useTheme();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(colors, r), [colors, r]);
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(
    user?.currency === 'USD' ? 'USD' : 'IDR'
  );
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarSource, setAvatarSource] = useState<{
    uri: string;
    headers?: { Authorization: string };
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setCurrency(user.currency === 'USD' ? 'USD' : 'IDR');
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
        currency,
      });
      setUser(updated);
      showDialog({
        variant: 'success',
        title: 'Profil diperbarui',
        message: 'Perubahan nama dan mata uang sudah disimpan.',
        confirmLabel: 'Selesai',
        onConfirm: () => navigation.goBack(),
      });
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal menyimpan profil.';
      setError(message);
      showDialog({ variant: 'error', title: 'Gagal menyimpan', message });
    } finally {
      setSaving(false);
    }
  };

  const onPickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      showDialog({
        variant: 'warning',
        title: 'Izin diperlukan',
        message: 'Izinkan akses galeri untuk mengganti foto.',
      });
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
      showDialog({
        variant: 'success',
        title: 'Foto diperbarui',
        message: 'Foto profil berhasil diunggah.',
      });
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengunggah foto.';
      showDialog({ variant: 'error', title: 'Upload gagal', message });
    } finally {
      setUploading(false);
    }
  };

  const onChangePassword = async () => {
    setError(null);
    if (!currentPassword || newPassword.length < 6) {
      setError('Isi password lama & baru (min. 6).');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setSavingPassword(true);
    try {
      const message = await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwOpen(false);
      showDialog({ variant: 'success', title: 'Password diubah', message });
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengubah password.';
      setError(message);
      showDialog({ variant: 'error', title: 'Gagal', message });
    } finally {
      setSavingPassword(false);
    }
  };

  const activeCurrency = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.wrap}
        contentContainerStyle={[
          styles.content,
          r.pageStyle,
          { paddingBottom: Math.max(insets.bottom, 16) + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={r.contentStyle}>
        <FadeInUp>
          <View style={styles.heroCard}>
            <View style={styles.avatarRing}>
              {avatarSource ? (
                <Image source={avatarSource} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarLetter}>
                    {(name || user?.email || 'U').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <ScalePress style={styles.cameraFab} onPress={onPickAvatar} disabled={uploading}>
                {uploading ? (
                  <ActivityIndicator color={colors.onBrand} size="small" />
                ) : (
                  <Ionicons name="camera" size={16} color={colors.onBrand} />
                )}
              </ScalePress>
            </View>
            <Text style={styles.heroName} numberOfLines={1}>
              {name || 'Profil kamu'}
            </Text>
            <Text style={styles.heroEmail} numberOfLines={1}>
              {user?.email || '—'}
            </Text>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillSymbol}>{activeCurrency.symbol}</Text>
              <Text style={styles.heroPillText}>
                {activeCurrency.code} · {activeCurrency.label}
              </Text>
            </View>
          </View>
        </FadeInUp>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FadeInUp delay={50}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionIcon}>
                <Ionicons name="person-outline" size={16} color={colors.brand} />
              </View>
              <Text style={styles.sectionTitle}>Identitas</Text>
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.emailReadonly}>
              <Ionicons name="mail-outline" size={16} color={colors.faint} />
              <Text style={styles.emailText}>{user?.email || '—'}</Text>
            </View>

            <Text style={styles.label}>Nama tampilan</Text>
            <AppTextInput
              icon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Nama lengkap"
            />
          </View>
        </FadeInUp>

        <PopIn delay={90}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={[styles.sectionIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="wallet-outline" size={16} color="#2563eb" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Mata uang</Text>
                <Text style={styles.sectionSub}>Pilih format nominal di seluruh app</Text>
              </View>
            </View>

            <View style={styles.currencyRow}>
              {CURRENCIES.map((c) => {
                const active = currency === c.code;
                return (
                  <ScalePress
                    key={c.code}
                    onPress={() => setCurrency(c.code)}
                    style={[
                      styles.currencyCard,
                      active && {
                        borderColor: c.tint,
                        backgroundColor: c.soft,
                      },
                    ]}
                  >
                    {active ? (
                      <View style={[styles.checkBadge, { backgroundColor: c.tint }]}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      </View>
                    ) : null}

                    <View style={[styles.currencyGlyph, { backgroundColor: active ? colors.surface : c.soft }]}>
                      <Text style={[styles.currencySymbol, { color: c.tint }]}>{c.symbol}</Text>
                    </View>

                    <Text style={[styles.currencyCode, active && { color: c.tint }]}>{c.code}</Text>
                    <Text style={styles.currencyLabel}>{c.label}</Text>
                    <Text style={styles.currencyHint}>{c.hint}</Text>

                    <View style={styles.currencyFooter}>
                      <Ionicons
                        name={c.icon}
                        size={14}
                        color={active ? c.tint : colors.faint}
                      />
                      <Text style={[styles.currencyPick, active && { color: c.tint }]}>
                        {active ? 'Dipilih' : 'Pilih'}
                      </Text>
                    </View>
                  </ScalePress>
                );
              })}
            </View>
          </View>
        </PopIn>

        <PopIn delay={110}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.amberSoft }]}>
                <Ionicons name="color-palette-outline" size={16} color={colors.amber} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Tema</Text>
                <Text style={styles.sectionSub}>Tampilan terang atau gelap</Text>
              </View>
            </View>

            <View style={styles.currencyRow}>
              {THEME_OPTIONS.map((option) => {
                const active = theme === option.id;
                return (
                  <ScalePress
                    key={option.id}
                    onPress={() => setTheme(option.id)}
                    style={[
                      styles.themeCard,
                      active && {
                        borderColor: option.accent,
                        backgroundColor:
                          option.id === 'midnight' ? '#12352f' : '#d9f5f1',
                      },
                    ]}
                  >
                    {active ? (
                      <View style={[styles.checkBadge, { backgroundColor: option.accent }]}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      </View>
                    ) : null}

                    <View
                      style={[
                        styles.themePreview,
                        {
                          backgroundColor: option.previewFrom,
                          borderColor: option.accent + '55',
                        },
                      ]}
                    >
                      <View
                        style={[styles.themePreviewSurface, { backgroundColor: option.previewTo }]}
                      />
                      <View
                        style={[styles.themePreviewAccent, { backgroundColor: option.accent }]}
                      />
                    </View>

                    <View style={styles.themeIconRow}>
                      <Ionicons
                        name={option.icon}
                        size={16}
                        color={active ? option.accent : colors.faint}
                      />
                      <Text style={[styles.themeName, active && { color: option.accent }]}>
                        {option.name}
                      </Text>
                    </View>
                    <Text style={styles.themeHint}>{option.hint}</Text>
                    <Text style={[styles.currencyPick, active && { color: option.accent }]}>
                      {active ? 'Dipakai' : 'Pakai'}
                    </Text>
                  </ScalePress>
                );
              })}
            </View>
          </View>
        </PopIn>

        <FadeInUp delay={130}>
          <ScalePress style={styles.saveBtn} onPress={onSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.saveInner}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.saveText}>Simpan profil</Text>
              </View>
            )}
          </ScalePress>
        </FadeInUp>

        <FadeInUp delay={170}>
          <Pressable style={styles.pwToggle} onPress={() => setPwOpen((v) => !v)}>
            <View style={styles.pwToggleLeft}>
              <View style={styles.pwIconBox}>
                <Ionicons name="key-outline" size={16} color={colors.brand} />
              </View>
              <View>
                <Text style={styles.pwToggleTitle}>Ganti password</Text>
                <Text style={styles.pwToggleSub}>Amankan akunmu</Text>
              </View>
            </View>
            <Ionicons
              name={pwOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.muted}
            />
          </Pressable>

          {pwOpen ? (
            <View style={styles.pwBox}>
              <PasswordInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Password saat ini"
              />
              <PasswordInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Password baru (min. 6)"
              />
              <PasswordInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Ulangi password baru"
              />
              <Pressable
                style={styles.pwSave}
                onPress={onChangePassword}
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <ActivityIndicator color={colors.onBrand} />
                ) : (
                  <Text style={styles.pwSaveText}>Simpan password</Text>
                )}
              </Pressable>
            </View>
          ) : null}
        </FadeInUp>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors, r: ReturnType<typeof useResponsive>) {
  return StyleSheet.create({
    wrap: { flex: 1, backgroundColor: colors.bg },
    content: { flexGrow: 1, paddingTop: 12 },
    heroCard: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 20,
      paddingHorizontal: 16,
      marginBottom: 14,
      overflow: 'hidden',
    },
    avatarRing: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 3,
      borderColor: colors.brandSoftBorder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: colors.border },
    avatarFallback: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.brand,
    },
    avatarLetter: { color: '#fff', fontSize: 32, fontWeight: '800' },
    cameraFab: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.brand,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.surface,
    },
    heroName: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
    heroEmail: { marginTop: 2, color: colors.muted, fontSize: 13 },
    heroPill: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.brandSoft,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.brandSoftBorder,
    },
    heroPillSymbol: { fontWeight: '900', color: colors.brandDark, fontSize: 13 },
    heroPillText: { fontWeight: '700', color: colors.brandDark, fontSize: 12 },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 12,
    },
    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },
    sectionIcon: {
      width: 34,
      height: 34,
      borderRadius: 12,
      backgroundColor: colors.brandSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionTitle: { fontWeight: '800', color: colors.text, fontSize: 15 },
    sectionSub: { marginTop: 1, color: colors.muted, fontSize: 11, fontWeight: '600' },
    label: {
      fontWeight: '700',
      color: colors.muted,
      marginBottom: 6,
      marginTop: 4,
      fontSize: 11,
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    emailReadonly: {
      backgroundColor: colors.bg,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emailText: { color: colors.muted, fontSize: 14, flex: 1, fontWeight: '600' },
    currencyRow: {
      flexDirection: r.isCompact ? 'column' : 'row',
      gap: 10,
    },
    currencyCard: {
      flex: 1,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      padding: 12,
      minHeight: r.isCompact ? 140 : 168,
      overflow: 'hidden',
    },
    themeCard: {
      flex: 1,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      padding: 12,
      minHeight: r.isCompact ? 140 : 156,
      overflow: 'hidden',
    },
    themePreview: {
      height: 52,
      borderRadius: 14,
      borderWidth: 1,
      overflow: 'hidden',
      marginBottom: 10,
      justifyContent: 'flex-end',
      padding: 8,
    },
    themePreviewSurface: {
      position: 'absolute',
      right: 8,
      top: 8,
      width: 28,
      height: 20,
      borderRadius: 6,
    },
    themePreviewAccent: {
      width: 36,
      height: 8,
      borderRadius: 999,
    },
    themeIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    themeName: { fontWeight: '900', color: colors.text, fontSize: 14 },
    themeHint: {
      marginTop: 4,
      marginBottom: 10,
      color: colors.faint,
      fontSize: 11,
      fontWeight: '600',
    },
    checkBadge: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    currencyGlyph: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    currencySymbol: { fontSize: 20, fontWeight: '900' },
    currencyCode: {
      fontWeight: '900',
      color: colors.text,
      fontSize: 18,
      letterSpacing: -0.3,
    },
    currencyLabel: { marginTop: 2, fontWeight: '700', color: colors.textSoft, fontSize: 13 },
    currencyHint: { marginTop: 2, color: colors.faint, fontSize: 11, fontWeight: '600' },
    currencyFooter: {
      marginTop: 'auto',
      paddingTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    currencyPick: { fontWeight: '800', color: colors.faint, fontSize: 11 },
    saveBtn: {
      marginTop: 4,
      marginBottom: 8,
      backgroundColor: colors.brand,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveInner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    saveText: {
      color: '#fff',
      fontWeight: '800',
      fontSize: 15,
      lineHeight: 20,
      textAlign: 'center',
      includeFontPadding: false,
    },
    pwToggle: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    pwToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    pwIconBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.brandSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pwToggleTitle: { fontWeight: '800', color: colors.text, fontSize: 14 },
    pwToggleSub: { color: colors.muted, fontSize: 11, fontWeight: '600', marginTop: 1 },
    pwBox: {
      marginTop: 8,
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
    pwSave: {
      marginTop: 4,
      backgroundColor: colors.brand,
      borderRadius: 14,
      paddingVertical: 12,
      alignItems: 'center',
    },
    pwSaveText: { color: colors.onBrand, fontWeight: '800', fontSize: 14 },
    error: {
      backgroundColor: colors.dangerBg,
      color: colors.dangerText,
      padding: 10,
      borderRadius: 12,
      marginBottom: 10,
    },
  });
}
