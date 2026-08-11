import { useMemo } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../authContext';
import { BrandMark } from '../components/ui';
import { FadeInUp, ScalePress } from '../components/motion';
import { spacing, type ThemeColors } from '../theme';
import { useColors } from '../themeContext';
import { useResponsive } from '../hooks/useResponsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Privacy'>;

const SECTIONS = [
  {
    title: 'Data yang kami simpan',
    body: 'DuitDiary menyimpan data akun (nama, email, preferensi) dan data keuangan yang Anda catat (transaksi, kategori, unggahan struk/avatar) untuk menyediakan fitur aplikasi.',
    icon: 'server-outline' as const,
    tint: '#0f9b8e',
    soft: '#d9f5f1',
  },
  {
    title: 'Cara data dipakai',
    body: 'Data digunakan untuk autentikasi, sinkronisasi antar perangkat, dan menampilkan ringkasan dashboard. Kami tidak menjual data pribadi Anda kepada pihak ketiga untuk iklan.',
    icon: 'analytics-outline' as const,
    tint: '#2563eb',
    soft: '#dbeafe',
  },
  {
    title: 'Unggahan & akses',
    body: 'Unggahan (struk, avatar) dilindungi di server dan hanya dapat diakses oleh akun yang berwenang. Anda dapat meminta penghapusan akun dengan menghubungi pengelola layanan.',
    icon: 'cloud-upload-outline' as const,
    tint: '#d97706',
    soft: '#fef3c7',
  },
  {
    title: 'Keamanan',
    body: 'Password di-hash; sesi memakai token yang dapat dibatalkan. Tetap gunakan password yang kuat dan jangan bagikan tautan reset password.',
    icon: 'shield-checkmark-outline' as const,
    tint: '#16a34a',
    soft: '#dcfce7',
  },
];

export function PrivacyScreen({ navigation }: Props) {
  const colors = useColors();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(colors, r), [colors, r]);
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={{
        paddingTop: Math.max(insets.top, 12) + 12,
        paddingBottom: Math.max(insets.bottom, 16) + 28,
        paddingHorizontal: r.pagePadding,
      }}
    >
      <View style={styles.glow} pointerEvents="none" />

      <FadeInUp>
        <ScalePress onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={r.ms(16)} color={colors.brand} />
          <Text style={styles.backText}>Kembali</Text>
        </ScalePress>

        <View style={styles.hero}>
          <BrandMark size="sm" />
          <Text style={styles.badge}>Privasi</Text>
          <Text style={styles.title}>Kebijakan Privasi</Text>
          <Text style={styles.lead}>
            Bagaimana DuitDiary menjaga data akun dan catatan keuanganmu.
          </Text>
        </View>
      </FadeInUp>

      {SECTIONS.map((section, index) => (
        <FadeInUp key={section.title} delay={50 + index * 45}>
          <View style={[styles.card, { borderColor: `${section.tint}33` }]}>
            <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: section.soft }]}>
                <Ionicons name={section.icon} size={r.ms(18)} color={section.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <View style={[styles.accent, { backgroundColor: section.tint }]} />
              </View>
              <Text style={[styles.step, { color: section.tint }]}>
                {String(index + 1).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        </FadeInUp>
      ))}

      <FadeInUp delay={240}>
        <View style={styles.footer}>
          <Ionicons name="time-outline" size={r.ms(14)} color={colors.muted} />
          <Text style={styles.meta}>Terakhir diperbarui: Agustus 2026</Text>
        </View>
      </FadeInUp>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors, r: ReturnType<typeof useResponsive>) {
  return StyleSheet.create({
    wrap: { flex: 1, backgroundColor: colors.bg },
    glow: {
      position: 'absolute',
      top: 20,
      left: -50,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: 'rgba(37,99,235,0.1)',
    },
    back: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 14,
      backgroundColor: colors.brandSoft,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.brandSoftBorder,
    },
    backText: { color: colors.brand, fontWeight: '800', fontSize: r.ms(13) },
    hero: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      marginBottom: 14,
    },
    badge: {
      marginTop: 12,
      alignSelf: 'flex-start',
      color: colors.brand,
      fontWeight: '800',
      fontSize: r.ms(11),
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    title: {
      marginTop: 6,
      fontSize: r.ms(28),
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    lead: {
      marginTop: 8,
      color: colors.muted,
      lineHeight: 21,
      fontSize: r.ms(14),
      fontWeight: '600',
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      borderWidth: 1.5,
      padding: 14,
      marginBottom: 10,
    },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: { fontWeight: '800', color: colors.text, fontSize: r.ms(15) },
    accent: { marginTop: 6, width: 24, height: 3, borderRadius: 999 },
    step: { fontWeight: '900', fontSize: r.ms(15) },
    body: { color: colors.muted, lineHeight: 21, fontSize: r.ms(13), fontWeight: '600' },
    footer: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      justifyContent: 'center',
    },
    meta: { fontSize: r.ms(12), color: colors.muted, fontWeight: '600' },
  });
}
