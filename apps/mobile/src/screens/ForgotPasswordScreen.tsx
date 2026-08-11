import { useState } from 'react';
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { forgotPassword } from '../lib/auth';
import type { RootStackParamList } from '../authContext';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!email.trim()) {
      setError('Masukkan email.');
      return;
    }
    setLoading(true);
    try {
      const message = await forgotPassword(email.trim());
      setSuccess(message);
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengirim link reset.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.wrap,
        { paddingTop: Math.max(insets.top, 16) + 36, paddingBottom: Math.max(insets.bottom, 16) },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable
        style={[styles.backBtn, { top: Math.max(insets.top, 12) + 8 }]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.backText}>← Kembali ke masuk</Text>
      </Pressable>

      <Text style={styles.brand}>DuitDiary</Text>
      <Text style={styles.title}>Lupa password</Text>
      <Text style={styles.sub}>
        Kami kirim link reset ke email (buka di browser/web untuk ganti password).
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Pressable style={styles.btn} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Kirim link reset</Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.bg },
  backBtn: { position: 'absolute', left: 24, zIndex: 1 },
  backText: { color: colors.brand, fontWeight: '700', fontSize: 15 },
  brand: { fontSize: 14, fontWeight: '700', color: colors.brand, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  sub: { marginTop: 6, marginBottom: 20, color: colors.muted, lineHeight: 20 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  error: {
    backgroundColor: colors.dangerBg,
    color: colors.dangerText,
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  success: {
    backgroundColor: '#ecfdf8',
    color: colors.income,
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
});
