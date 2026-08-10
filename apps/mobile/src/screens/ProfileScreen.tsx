import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { User } from '../lib/auth';
import { logout } from '../lib/auth';
import { API_BASE_URL } from '../lib/api';
import { colors } from '../theme';

export function ProfileScreen({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.brand}>DuitDiary</Text>
      <Text style={styles.title}>Profil</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.currency ? (
          <Text style={styles.meta}>Mata uang: {user.currency}</Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>API endpoint</Text>
        <Text style={styles.meta}>{API_BASE_URL}</Text>
        <Text style={styles.hint}>
          Emulator Android: 10.0.2.2 · Device fisik: set EXPO_PUBLIC_API_URL ke IP LAN.
        </Text>
      </View>

      <Pressable style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Keluar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, paddingTop: 56, backgroundColor: colors.bg },
  brand: { fontSize: 14, fontWeight: '700', color: colors.brand, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 20 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: '800', color: colors.text },
  email: { marginTop: 4, color: colors.muted },
  cardTitle: { fontWeight: '700', color: colors.text, marginBottom: 6 },
  meta: { color: colors.faint, fontSize: 12, marginTop: 4 },
  hint: { marginTop: 8, color: colors.muted, fontSize: 12, lineHeight: 18 },
  btn: {
    marginTop: 16,
    backgroundColor: colors.text,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
});
