import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { User } from '../lib/auth';
import { logout } from '../lib/auth';
import { genderLabel } from '../lib/gender';
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
      sub: 'Profil, tema, feedback, password',
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
            <View style={styles.metaRow}>
              {user.currency ? (
                <View style={styles.currencyPill}>
                  <Text style={styles.currencyText}>{user.currency}</Text>
                </View>
              ) : null}
              {genderLabel(user.gender) ? (
                <View style={styles.currencyPill}>
                  <Text style={styles.currencyText}>{genderLabel(user.gender)}</Text>
                </View>
              ) : null}
              {user.birthDate ? (
                <View style={styles.currencyPill}>
                  <Text style={styles.currencyText}>
                    {new Date(`${user.birthDate}T00:00:00`).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              ) : null}
            </View>
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

      {user.role === 'ADMIN' && (
        <FadeInUp delay={250}>
          <AdminSection colors={colors} r={r} />
        </FadeInUp>
      )}

      <FadeInUp delay={300}>
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
      backgroundColor: colors.brandSoft,
      borderRadius: radii.pill,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    metaRow: {
      marginTop: 6,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
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
  });
}

interface AdminStats {
  users: number;
  transactions: number;
  feedback: number;
  savingsGoals: number;
  todayUsers: number;
}

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  _count: { expenses: number };
}

interface FeedbackItem {
  id: string;
  name: string | null;
  message: string;
  rating: number;
  isPublished?: boolean;
  createdAt: string;
}

function AdminSection({ colors, r }: { colors: ThemeColors; r: ReturnType<typeof useResponsive> }) {
  const { showDialog } = useDialog();
  const [tab, setTab] = useState<'stats' | 'users' | 'feedback'>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [traffic, setTraffic] = useState<{ activeUsersToday: number; totalVisits: number } | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const as = useMemo(() => adminStyles(colors, r), [colors, r]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (tab === 'stats') {
          const [statsRes, trafficRes] = await Promise.all([
            apiClient.get('/admin/stats'),
            apiClient.get('/admin/traffic', { params: { days: 7 } }).catch(() => null),
          ]);
          setStats(statsRes.data?.data);
          setTraffic(trafficRes?.data?.data ?? null);
        } else if (tab === 'users') {
          const res = await apiClient.get('/admin/users');
          setUsers(res.data?.data || []);
        } else {
          const res = await apiClient.get('/admin/feedback');
          setFeedbacks(res.data?.data || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [tab]);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await apiClient.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } catch (e: any) {
      showDialog({
        variant: 'error',
        title: 'Gagal ubah role',
        message: e?.response?.data?.message || 'Coba lagi beberapa saat.',
        confirmLabel: 'Saya mengerti',
      });
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      await apiClient.delete(`/admin/feedback/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch { /* ignore */ }
  };

  const togglePublishFeedback = async (id: string, current: boolean) => {
    try {
      await apiClient.patch(`/admin/feedback/${id}`, { isPublished: !current });
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isPublished: !current } : f))
      );
    } catch {
      showDialog({
        variant: 'error',
        title: 'Gagal update',
        message: 'Tidak bisa mengubah status publish testimoni.',
        confirmLabel: 'Mengerti',
      });
    }
  };

  const tabs: { key: typeof tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'stats', label: 'Stats', icon: 'stats-chart' },
    { key: 'users', label: 'Users', icon: 'people' },
    { key: 'feedback', label: 'Feedback', icon: 'chatbubbles' },
  ];

  return (
    <View style={as.card}>
      <View style={as.header}>
        <View style={as.badge}>
          <Ionicons name="shield-checkmark" size={14} color="#fff" />
        </View>
        <Text style={as.headerText}>Admin Panel</Text>
      </View>

      <View style={as.tabs}>
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            style={[as.tab, tab === t.key && as.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Ionicons name={t.icon} size={13} color={tab === t.key ? '#fff' : colors.muted} />
            <Text style={[as.tabText, tab === t.key && as.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.brand} style={{ marginVertical: 16 }} />
      ) : tab === 'stats' && stats ? (
        <View style={as.statsGrid}>
          {[
            { label: 'Users', value: stats.users, icon: 'people' as const },
            { label: 'Hari Ini', value: stats.todayUsers, icon: 'person-add' as const },
            { label: 'Transaksi', value: stats.transactions, icon: 'receipt' as const },
            { label: 'Feedback', value: stats.feedback, icon: 'chatbubbles' as const },
            { label: 'Visitor', value: traffic?.activeUsersToday ?? 0, icon: 'eye' as const },
            { label: '7 Hari', value: traffic?.totalVisits ?? 0, icon: 'analytics' as const },
          ].map((s) => (
            <View key={s.label} style={as.statItem}>
              <Ionicons name={s.icon} size={16} color={colors.brand} />
              <Text style={as.statValue}>{s.value}</Text>
              <Text style={as.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      ) : tab === 'users' ? (
        <View>
          {users.map((u) => (
            <View key={u.id} style={as.userRow}>
              <View style={{ flex: 1 }}>
                <Text style={as.userName}>{u.name}</Text>
                <Text style={as.userEmail}>{u.email}</Text>
              </View>
              <Pressable
                style={[as.roleBadge, u.role === 'ADMIN' && as.roleBadgeAdmin]}
                onPress={() => toggleRole(u.id, u.role)}
              >
                <Text style={[as.roleText, u.role === 'ADMIN' && as.roleTextAdmin]}>
                  {u.role}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : tab === 'feedback' ? (
        <View>
          {feedbacks.length === 0 ? (
            <Text style={as.emptyText}>Belum ada feedback</Text>
          ) : (
            feedbacks.slice(0, 10).map((f) => (
              <View key={f.id} style={as.fbItem}>
                <View style={{ flex: 1 }}>
                  {f.rating > 0 && (
                    <View style={as.fbStars}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <Ionicons
                          key={v}
                          name={v <= f.rating ? 'star' : 'star-outline'}
                          size={10}
                          color={v <= f.rating ? '#f59e0b' : colors.faint}
                        />
                      ))}
                    </View>
                  )}
                  <Text style={as.fbMessage} numberOfLines={2}>"{f.message}"</Text>
                  <Text style={as.fbName}>{f.name || 'Anonim'}</Text>
                  <Pressable
                    onPress={() => togglePublishFeedback(f.id, !!f.isPublished)}
                    style={[as.publishBtn, f.isPublished && as.publishBtnOn]}
                  >
                    <Ionicons
                      name={f.isPublished ? 'globe' : 'globe-outline'}
                      size={12}
                      color={f.isPublished ? colors.onBrand : colors.brand}
                    />
                    <Text style={[as.publishText, f.isPublished && as.publishTextOn]}>
                      {f.isPublished ? 'Di landing' : 'Publish'}
                    </Text>
                  </Pressable>
                </View>
                <Pressable onPress={() => deleteFeedback(f.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={14} color={colors.dangerText} />
                </Pressable>
              </View>
            ))
          )}
        </View>
      ) : null}
    </View>
  );
}

function adminStyles(colors: ThemeColors, r: ReturnType<typeof useResponsive>) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: '#7c3aed30',
      padding: 14,
      marginBottom: 8,
    },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    badge: {
      width: 26, height: 26, borderRadius: 8,
      backgroundColor: '#7c3aed',
      alignItems: 'center', justifyContent: 'center',
    },
    headerText: { fontSize: r.ms(15), fontWeight: '800', color: colors.text },
    tabs: {
      flexDirection: 'row', gap: 6, marginBottom: 12,
    },
    tab: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
      backgroundColor: colors.bg,
    },
    tabActive: { backgroundColor: '#7c3aed' },
    tabText: { fontSize: 11, fontWeight: '700', color: colors.muted },
    tabTextActive: { color: '#fff' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    statItem: {
      width: '47%' as any,
      backgroundColor: colors.bg,
      borderRadius: radii.md,
      padding: 10,
      alignItems: 'center',
      gap: 2,
    },
    statValue: { fontSize: r.ms(18), fontWeight: '800', color: colors.text },
    statLabel: { fontSize: 10, fontWeight: '600', color: colors.muted },
    userRow: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    userName: { fontSize: 13, fontWeight: '700', color: colors.text },
    userEmail: { fontSize: 11, color: colors.muted },
    roleBadge: {
      paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
      backgroundColor: colors.bg,
    },
    roleBadgeAdmin: { backgroundColor: '#7c3aed20' },
    roleText: { fontSize: 10, fontWeight: '700', color: colors.muted },
    roleTextAdmin: { color: '#7c3aed' },
    emptyText: { fontSize: 12, color: colors.muted, textAlign: 'center', paddingVertical: 16 },
    fbItem: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 8,
      paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    fbStars: { flexDirection: 'row', gap: 1, marginBottom: 2 },
    fbMessage: { fontSize: 12, color: colors.text, lineHeight: 16 },
    fbName: { fontSize: 10, fontWeight: '600', color: colors.muted, marginTop: 2 },
    publishBtn: {
      marginTop: 6,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.brandSoftBorder,
      backgroundColor: colors.brandSoft,
    },
    publishBtnOn: {
      backgroundColor: colors.brand,
      borderColor: colors.brand,
    },
    publishText: { fontSize: 10, fontWeight: '800', color: colors.brand },
    publishTextOn: { color: colors.onBrand },
  });
}
