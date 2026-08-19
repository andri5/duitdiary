import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { User } from '../lib/auth';
import { logout } from '../lib/auth';
import { apiClient } from '../lib/api';
import { BrandMark, PrimaryButton } from '../components/ui';
import { FadeInUp, ScalePress, PopIn } from '../components/motion';
import { useDialog } from '../components/AppDialog';
import { radii, spacing, type ThemeColors } from '../theme';
import { useColors } from '../themeContext';
import { useResponsive } from '../hooks/useResponsive';
import type { MainStackParamList } from '../navigation/types';

export function ProfileScreen({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const colors = useColors();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(colors, r), [colors, r]);
  const insets = useSafeAreaInsets();
  const { showDialog } = useDialog();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleLogout = () => {
    showDialog({
      variant: 'danger',
      title: 'Keluar dari akun?',
      message: 'Kamu perlu masuk lagi untuk mengakses data.',
      confirmLabel: 'Keluar',
      cancelLabel: 'Batal',
      showCancel: true,
      onConfirm: async () => {
        await logout();
        onLogout();
      },
    });
  };

  const menus = [
    {
      key: 'recurring',
      title: 'Transaksi Otomatis',
      sub: 'Atur pengeluaran & pemasukan rutin',
      icon: 'repeat-outline' as const,
      soft: true,
      onPress: () => navigation.navigate('Recurring'),
    },
    {
      key: 'budget',
      title: 'Budget',
      sub: 'Limit pengeluaran bulanan',
      icon: 'wallet-outline' as const,
      soft: true,
      onPress: () => navigation.navigate('Budget'),
    },
    {
      key: 'savings',
      title: 'Target Tabungan',
      sub: 'Atur target saving & pantau progres',
      icon: 'flag-outline' as const,
      soft: true,
      onPress: () => navigation.navigate('Savings'),
    },
    {
      key: 'settings',
      title: 'Pengaturan',
      sub: 'Nama, mata uang, foto struk',
      icon: 'settings-outline' as const,
      soft: true,
      onPress: () => navigation.navigate('Settings'),
    },
    {
      key: 'categories',
      title: 'Kategori',
      sub: 'Tambah & kelola',
      icon: 'pricetags-outline' as const,
      soft: true,
      onPress: () => navigation.navigate('Categories'),
    },
    {
      key: 'help',
      title: 'Bantuan',
      sub: 'Panduan singkat',
      icon: 'help-circle-outline' as const,
      soft: false,
      onPress: () => navigation.navigate('Help'),
    },
  ];

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 10) + 8,
        paddingBottom: Math.max(insets.bottom, 16) + 24,
        paddingHorizontal: r.pagePadding,
      }}
    >
      <FadeInUp>
        <View style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <BrandMark size="sm" />
            <Text style={styles.title}>Profil</Text>
          </View>
        </View>
      </FadeInUp>

      <PopIn delay={50}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.name} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user.email}
            </Text>
            {user.currency ? (
              <View style={styles.currencyPill}>
                <Text style={styles.currencyText}>{user.currency}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </PopIn>

      {menus.map((item, i) => (
        <FadeInUp key={item.key} delay={90 + i * 55} distance={12}>
          <ScalePress
            onPress={item.onPress}
            style={[styles.menuBtn, item.soft ? styles.menuSoft : styles.menuPlain]}
          >
            <View style={[styles.menuIcon, item.soft && styles.menuIconSoft]}>
              <Ionicons
                name={item.icon}
                size={17}
                color={item.soft ? colors.brandDark : colors.muted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuTitle, item.soft && { color: colors.brandDark }]}>
                {item.title}
              </Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.faint} />
          </ScalePress>
        </FadeInUp>
      ))}

      <FadeInUp delay={260}>
        <FeedbackCard colors={colors} r={r} />
      </FadeInUp>

      <FadeInUp delay={300}>
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>DuitDiary 1.0.0</Text>
          <Text style={styles.versionDot}>·</Text>
          <Text style={styles.versionText}>release</Text>
        </View>
      </FadeInUp>

      <FadeInUp delay={340}>
        <PrimaryButton label="Keluar" onPress={handleLogout} variant="danger" />
      </FadeInUp>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors, r: ReturnType<typeof useResponsive>) {
  return StyleSheet.create({
    wrap: { flex: 1, backgroundColor: colors.bg },
    topBar: { marginBottom: 12 },
    title: {
      marginTop: 4,
      fontSize: r.ms(22),
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.4,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      marginBottom: 12,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: colors.brand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarLetter: { color: colors.onBrand, fontSize: r.ms(20), fontWeight: '800' },
    name: { fontSize: r.ms(16), fontWeight: '800', color: colors.text },
    email: { marginTop: 1, color: colors.muted, fontSize: r.ms(13) },
    currencyPill: {
      alignSelf: 'flex-start',
      marginTop: 6,
      backgroundColor: colors.brandSoft,
      borderRadius: radii.pill,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    currencyText: { color: colors.brandDark, fontWeight: '800', fontSize: r.ms(11) },
    menuBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: radii.lg,
      borderWidth: 1,
      paddingVertical: 11,
      paddingHorizontal: 12,
      marginBottom: 8,
    },
    menuSoft: {
      backgroundColor: colors.brandSoft,
      borderColor: colors.brandSoftBorder,
    },
    menuPlain: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    menuIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.mistDeep,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuIconSoft: { backgroundColor: colors.surface },
    menuTitle: { fontWeight: '800', color: colors.text, fontSize: r.ms(14) },
    menuSub: { marginTop: 1, color: colors.muted, fontSize: r.ms(11) },
    versionRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      marginVertical: 12,
    },
    versionText: { color: colors.faint, fontSize: r.ms(12), fontWeight: '600' },
    versionDot: { color: colors.faint },
  });
}

function FeedbackCard({ colors, r }: { colors: ThemeColors; r: ReturnType<typeof useResponsive> }) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return Alert.alert('Info', 'Tulis saran atau masukan dulu ya');
    setSending(true);
    try {
      await apiClient.post('/feedback', { message: message.trim(), rating });
      setSent(true);
      setMessage('');
      setRating(0);
      setTimeout(() => setSent(false), 3000);
    } catch {
      Alert.alert('Error', 'Gagal mengirim masukan');
    } finally {
      setSending(false);
    }
  };

  const fs = useMemo(() => fbStyles(colors, r), [colors, r]);

  if (sent) {
    return (
      <View style={fs.card}>
        <Ionicons name="checkmark-circle" size={36} color={colors.brand} />
        <Text style={fs.sentTitle}>Terima kasih!</Text>
        <Text style={fs.sentHint}>Masukan kamu sudah kami terima.</Text>
      </View>
    );
  }

  return (
    <View style={fs.card}>
      <View style={fs.header}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.brand} />
        <Text style={fs.headerText}>Saran & Masukan</Text>
      </View>
      <Text style={fs.hint}>Bantu kami jadi lebih baik</Text>

      <View style={fs.stars}>
        {[1, 2, 3, 4, 5].map((v) => (
          <Pressable key={v} onPress={() => setRating(v)} hitSlop={6}>
            <Ionicons
              name={v <= rating ? 'star' : 'star-outline'}
              size={24}
              color={v <= rating ? '#f59e0b' : colors.faint}
            />
          </Pressable>
        ))}
      </View>

      <TextInput
        style={fs.input}
        placeholder="Tulis saran, kritik, atau fitur harapan..."
        placeholderTextColor={colors.faint}
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Pressable style={[fs.sendBtn, sending && { opacity: 0.6 }]} onPress={handleSend} disabled={sending}>
        <Ionicons name="send" size={14} color="#fff" />
        <Text style={fs.sendText}>{sending ? 'Mengirim...' : 'Kirim Masukan'}</Text>
      </Pressable>
    </View>
  );
}

function fbStyles(colors: ThemeColors, r: ReturnType<typeof useResponsive>) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 8,
      alignItems: 'center',
    },
    header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2, alignSelf: 'flex-start' },
    headerText: { fontSize: r.ms(14), fontWeight: '800', color: colors.text },
    hint: { fontSize: r.ms(11), color: colors.muted, alignSelf: 'flex-start', marginBottom: 10 },
    stars: { flexDirection: 'row', gap: 6, marginBottom: 10, alignSelf: 'flex-start' },
    input: {
      width: '100%',
      backgroundColor: colors.bg,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: r.ms(13),
      color: colors.text,
      minHeight: 72,
      marginBottom: 10,
    },
    sendBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      width: '100%',
      backgroundColor: colors.brand,
      borderRadius: radii.md,
      paddingVertical: 11,
    },
    sendText: { fontSize: r.ms(13), fontWeight: '700', color: '#fff' },
    sentTitle: { fontSize: r.ms(16), fontWeight: '800', color: colors.text, marginTop: 8 },
    sentHint: { fontSize: r.ms(12), color: colors.muted, marginTop: 2 },
  });
}
