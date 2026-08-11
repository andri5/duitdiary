import { useMemo, useState } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { register } from '../lib/auth';
import { useAuth, type RootStackParamList } from '../authContext';
import {
  BrandMark,
  AppTextInput,
  PasswordInput,
  PrimaryButton,
  Card,
  FormLabel,
} from '../components/ui';
import { FadeInUp, ScalePress } from '../components/motion';
import { spacing, type ThemeColors } from '../theme';
import { useColors } from '../themeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const onSubmit = async () => {
    setError(null);
    if (!termsAccepted) {
      setError('Setujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }
    setLoading(true);
    try {
      const result = await register(name.trim(), email.trim(), password);
      setUser(result.user);
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Pendaftaran gagal.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.wrap, { paddingTop: Math.max(insets.top, 12) }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.glowA} pointerEvents="none" />
      <View style={styles.glowB} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingBottom: Math.max(insets.bottom, 16) + 24,
          paddingTop: 8,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <FadeInUp>
          <ScalePress onPress={() => navigation.navigate('Login')} style={styles.back}>
            <Ionicons name="arrow-back" size={16} color={colors.brand} />
            <Text style={styles.backText}>Kembali ke masuk</Text>
          </ScalePress>
          <BrandMark size="lg" />
          <Text style={styles.title}>Buat akun</Text>
          <Text style={styles.sub}>Mulai catat pemasukan & pengeluaran dari HP</Text>
        </FadeInUp>

        <Card>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={colors.expense} />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : null}

          <FormLabel>Nama</FormLabel>
          <AppTextInput
            icon="person-outline"
            placeholder="Nama lengkap"
            value={name}
            onChangeText={setName}
          />

          <FormLabel>Email</FormLabel>
          <AppTextInput
            icon="mail-outline"
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
          />

          <FormLabel>Password</FormLabel>
          <PasswordInput
            placeholder="Minimal 6 karakter"
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
            textContentType="newPassword"
          />

          <Pressable style={styles.termsRow} onPress={() => setTermsAccepted((v) => !v)}>
            <View style={[styles.checkbox, termsAccepted && styles.checkboxOn]}>
              {termsAccepted ? (
                <Ionicons name="checkmark" size={14} color={colors.onBrand} />
              ) : null}
            </View>
            <Text style={styles.termsText}>
              Saya setuju dengan{' '}
              <Text style={styles.termsLink} onPress={() => navigation.navigate('Terms')}>
                Syarat & Ketentuan
              </Text>{' '}
              dan{' '}
              <Text style={styles.termsLink} onPress={() => navigation.navigate('Privacy')}>
                Kebijakan Privasi
              </Text>
            </Text>
          </Pressable>

          <PrimaryButton
            label="Daftar sekarang"
            icon="sparkles"
            onPress={onSubmit}
            loading={loading}
            disabled={loading || !termsAccepted}
          />
        </Card>

        <FadeInUp delay={130}>
          <Pressable onPress={() => navigation.navigate('Login')} style={styles.footer}>
            <Text style={styles.footerMuted}>Sudah punya akun? </Text>
            <Text style={styles.link}>Masuk</Text>
          </Pressable>
        </FadeInUp>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, overflow: 'hidden' },
  glowA: {
    position: 'absolute',
    top: -40,
    left: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(15,155,142,0.12)',
  },
  glowB: {
    position: 'absolute',
    bottom: 40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(37,99,235,0.08)',
  },
  back: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    backgroundColor: colors.brandSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.brandSoftBorder,
  },
  backText: { color: colors.brand, fontWeight: '800', fontSize: 13 },
  title: {
    marginTop: 18,
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.6,
  },
  sub: { marginTop: 6, marginBottom: 18, color: colors.muted, fontSize: 15, lineHeight: 22 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  termsText: { flex: 1, color: colors.muted, lineHeight: 20, fontSize: 13, fontWeight: '600' },
  termsLink: { color: colors.brand, fontWeight: '800' },
  footer: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerMuted: { color: colors.muted, fontWeight: '600' },
  link: { color: colors.brand, fontWeight: '800' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.expenseSoft,
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  error: { flex: 1, color: colors.expense, fontWeight: '700', fontSize: 13 },
});
}
