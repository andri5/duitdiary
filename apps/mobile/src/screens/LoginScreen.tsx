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
import { login } from '../lib/auth';
import { useAuth, type RootStackParamList } from '../authContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      setUser(result.user);
    } catch (e: unknown) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login gagal. Periksa email/password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.wrap,
        { paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 16) },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.brand}>DuitDiary</Text>
      <Text style={styles.title}>Masuk</Text>
      <Text style={styles.sub}>Lanjutkan pencatatan keuanganmu</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.btn} onPress={onSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Masuk</Text>
        )}
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.secondaryBtnText}>Daftar akun baru</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Lupa password?</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Belum punya akun? Ketuk di sini</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f4f7fb' },
  brand: { fontSize: 14, fontWeight: '700', color: '#0f9b8e', marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  sub: { marginTop: 6, marginBottom: 20, color: '#64748b' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d7e0ea',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#0f9b8e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#0f9b8e',
    backgroundColor: '#fff',
  },
  secondaryBtnText: { color: '#0f9b8e', fontWeight: '700', fontSize: 16 },
  link: { marginTop: 18, textAlign: 'center', color: '#0f9b8e', fontWeight: '600' },
  error: {
    backgroundColor: '#fdecec',
    color: '#e24b4a',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
});
