import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

const SECTIONS = [
  {
    title: 'Transaksi',
    body: 'Tambah dari Beranda atau tab Transaksi. Tap item untuk edit, tahan untuk hapus. Tanggal dipilih lewat date picker.',
  },
  {
    title: 'Kategori',
    body: 'Kelola dari Profil → Kelola kategori. Setiap transaksi butuh kategori sesuai tipe (masuk/keluar).',
  },
  {
    title: 'Struk',
    body: 'Di form transaksi bisa unggah foto struk dari galeri atau kamera. Struk hanya bisa dilihat oleh akunmu.',
  },
  {
    title: 'Akun',
    body: 'Ubah nama, mata uang, dan foto di Pengaturan. Lupa password tersedia di layar masuk (link dikirim ke email).',
  },
];

export function HelpScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 16) + 32 },
      ]}
    >
      <Text style={styles.lead}>
        Panduan singkat memakai DuitDiary di HP. Fitur lengkap juga tersedia di versi web.
      </Text>
      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.card}>
          <Text style={styles.title}>{section.title}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 16 },
  lead: { color: colors.muted, marginBottom: 16, lineHeight: 20 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  title: { fontWeight: '800', color: colors.text, marginBottom: 6 },
  body: { color: colors.muted, lineHeight: 20 },
});
