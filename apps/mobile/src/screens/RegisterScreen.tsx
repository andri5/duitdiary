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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { register } from '../lib/auth';
import { GENDER_OPTIONS, type Gender } from '../lib/gender';
import { useAuth, type RootStackParamList } from '../authContext';
import { authErrorMessage, AUTH_SAFE } from '../lib/authErrors';
import { useCaptchaConfig } from '../lib/captcha';
import { TurnstileCaptcha } from '../components/TurnstileCaptcha';
import {
  BrandMark,
  AppTextInput,
  PasswordInput,
  PrimaryButton,
  Card,
  FormLabel,
} from '../components/ui';
import { FadeInUp, ScalePress } from '../components/motion';
import { type ThemeColors } from '../theme';
import { useColors } from '../themeContext';
import { useResponsive } from '../hooks/useResponsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

function toYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatIdDate(ymd: string) {
  const d = new Date(`${ymd}T00:00:00`);
  if (Number.isNaN(d.getTime())) return ymd;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function RegisterScreen({ navigation }: Props) {
  const colors = useColors();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(colors, r), [colors, r]);
  const insets = useSafeAreaInsets();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const { config: captcha, required: captchaRequired, error: captchaConfigError, loading: captchaLoading } =
    useCaptchaConfig();

  const isStrongPassword = (pwd: string) => {
    return pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /\d/.test(pwd);
  };

  const onSubmit = async () => {
    setError(null);
    if (!termsAccepted) {
      setError('Setujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }
    if (!gender) {
      setError('Pilih jenis kelamin.');
      return;
    }
    if (!birthDate) {
      setError('Isi tanggal lahir.');
      return;
    }
    if (!isStrongPassword(password)) {
      setError('Password minimal 8 karakter dan mengandung huruf serta angka.');
      return;
    }
    if (captchaRequired && !captchaToken) {
      setError('Selesaikan verifikasi captcha dulu.');
      return;
    }
    setLoading(true);
    try {
      const result = await register(name.trim(), email.trim(), password, {
        gender,
        birthDate,
        captchaToken: captchaToken ?? undefined,
      });
      setUser(result.user);
    } catch (e: unknown) {
      setError(authErrorMessage(e, AUTH_SAFE.registerFailed));
      setCaptchaToken(null);
      setCaptchaReset((n) => n + 1);
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
          paddingHorizontal: r.pagePadding,
          paddingBottom: Math.max(insets.bottom, 16) + 24,
          paddingTop: 8,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <FadeInUp>
          <ScalePress onPress={() => navigation.navigate('Login')} style={styles.back}>
            <Ionicons name="arrow-back" size={r.ms(16)} color={colors.brand} />
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

          <FormLabel>Jenis kelamin</FormLabel>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((opt) => {
              const active = gender === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setGender(opt.value)}
                  style={[styles.genderChip, active && styles.genderChipOn]}
                >
                  <Text style={[styles.genderChipText, active && styles.genderChipTextOn]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <FormLabel>Tanggal lahir</FormLabel>
          <Pressable style={styles.dateBtn} onPress={() => setShowBirthPicker(true)}>
            <Ionicons name="calendar-outline" size={18} color={colors.muted} />
            <Text style={[styles.dateBtnText, !birthDate && { color: colors.faint }]}>
              {birthDate ? formatIdDate(birthDate) : 'Pilih tanggal lahir'}
            </Text>
          </Pressable>
          {showBirthPicker ? (
            <DateTimePicker
              value={birthDate ? new Date(`${birthDate}T00:00:00`) : new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(_e, date) => {
                if (Platform.OS !== 'ios') setShowBirthPicker(false);
                if (date) setBirthDate(toYmd(date));
              }}
            />
          ) : null}
          {Platform.OS === 'ios' && showBirthPicker ? (
            <Pressable style={styles.dateDone} onPress={() => setShowBirthPicker(false)}>
              <Text style={styles.dateDoneText}>Selesai</Text>
            </Pressable>
          ) : null}

          <FormLabel>Password</FormLabel>
          <PasswordInput
            placeholder="Min. 8 karakter + huruf & angka"
            value={password}
            onChangeText={setPassword}
            autoComplete="new-password"
            textContentType="newPassword"
          />

          <Text
            style={{
              marginTop: 8,
              marginBottom: 14,
              color: colors.muted,
              fontSize: r.ms(12),
              fontWeight: '600',
            }}
          >
            Contoh: RapatKamis7!
          </Text>

          {captchaLoading ? (
            <Text
              style={{
                color: colors.muted,
                fontSize: r.ms(12),
                fontWeight: '600',
                marginBottom: 10,
              }}
            >
              Memuat captcha…
            </Text>
          ) : null}
          {captcha?.misconfigured ? (
            <Text
              style={{
                color: colors.amber,
                fontSize: r.ms(12),
                fontWeight: '700',
                marginBottom: 10,
              }}
            >
              Captcha aktif di admin, tetapi kunci Turnstile belum diset di server.
            </Text>
          ) : null}
          {captchaConfigError ? (
            <Text
              style={{
                color: colors.expense,
                fontSize: r.ms(12),
                fontWeight: '700',
                marginBottom: 10,
              }}
            >
              {captchaConfigError}. Pastikan HP satu Wi‑Fi dengan PC dan API jalan.
            </Text>
          ) : null}
          {captchaRequired && captcha?.siteKey ? (
            <TurnstileCaptcha
              siteKey={captcha.siteKey}
              onToken={setCaptchaToken}
              resetKey={captchaReset}
            />
          ) : null}

          <Pressable style={styles.termsRow} onPress={() => setTermsAccepted((v) => !v)}>
            <View style={[styles.checkbox, termsAccepted && styles.checkboxOn]}>
              {termsAccepted ? (
                <Ionicons name="checkmark" size={r.ms(14)} color={colors.onBrand} />
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
            disabled={loading || !termsAccepted || (captchaRequired && !captchaToken)}
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

function createStyles(colors: ThemeColors, r: ReturnType<typeof useResponsive>) {
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
    backText: { color: colors.brand, fontWeight: '800', fontSize: r.ms(13) },
    title: {
      marginTop: 18,
      fontSize: r.ms(32),
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.6,
    },
    sub: {
      marginTop: 6,
      marginBottom: 18,
      color: colors.muted,
      fontSize: r.ms(15),
      lineHeight: r.ms(22),
    },
    genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    genderChip: {
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    genderChipOn: { borderColor: colors.brand, backgroundColor: colors.brandSoft },
    genderChipText: { color: colors.muted, fontWeight: '700', fontSize: r.ms(13) },
    genderChipTextOn: { color: colors.brand },
    dateBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.bg,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 12,
    },
    dateBtnText: { flex: 1, color: colors.text, fontWeight: '700', fontSize: r.ms(14) },
    dateDone: {
      alignSelf: 'flex-end',
      marginBottom: 12,
      paddingVertical: 6,
      paddingHorizontal: 10,
    },
    dateDoneText: { color: colors.brand, fontWeight: '800', fontSize: r.ms(13) },
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
    termsText: {
      flex: 1,
      color: colors.muted,
      lineHeight: r.ms(20),
      fontSize: r.ms(13),
      fontWeight: '600',
    },
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
    error: { flex: 1, color: colors.expense, fontWeight: '700', fontSize: r.ms(13) },
  });
}
