import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { User } from '../lib/auth';
import { logout } from '../lib/auth';
import { API_BASE_URL } from '../lib/api';
import { colors } from '../theme';
import type { MainStackParamList } from '../navigation/types';

export function ProfileScreen({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: Math.max(insets.top, 12) + 12,
          paddingBottom: 24,
        },
      ]}
    >
      <Text style={styles.brand}>DuitDiary</Text>
      <Text style={styles.title}>Profil</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.currency ? (
          <Text style={styles.meta}>Mata uang: {user.currency}</Text>
        ) : null}
      </View>

      <Pressable style={styles.menuBtn} onPress={() => navigation.navigate('Categories')}>
        <Text style={styles.menuTitle}>Kelola kategori</Text>
        <Text style={styles.menuSub}>Tambah, edit, atau hapus kategori</Text>
      </Pressable>

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
  wrap: { flex: 1, paddingHorizontal: 20, backgroundColor: colors.bg },
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
  menuBtn: {
    backgroundColor: '#ecfdf8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#99f6e4',
    padding: 16,
    marginBottom: 12,
  },
  menuTitle: { fontWeight: '800', color: colors.brandDark, fontSize: 16 },
  menuSub: { marginTop: 4, color: colors.muted, fontSize: 13 },
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
