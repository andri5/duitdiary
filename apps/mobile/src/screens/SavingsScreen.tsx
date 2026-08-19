import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useColors } from '../themeContext';
import { useResponsive } from '../hooks/useResponsive';
import { radii, spacing, type ThemeColors } from '../theme';
import { FadeInUp, ScalePress } from '../components/motion';
import { PageLoader } from '../components/PageStatus';
import {
  getSavingsGoals,
  createSavingsGoal,
  addSavingsAmount,
  deleteSavingsGoal,
  type SavingsGoal,
} from '../lib/savings';

function fmtN(n: number) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n);
}

export function SavingsScreen() {
  const colors = useColors();
  const r = useResponsive();
  const styles = useMemo(() => createStyles(colors, r), [colors, r]);
  const insets = useSafeAreaInsets();

  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [creating, setCreating] = useState(false);

  const [addGoal, setAddGoal] = useState<SavingsGoal | null>(null);
  const [addAmt, setAddAmt] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getSavingsGoals();
      setGoals(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleCreate = async () => {
    const parsed = Number(target);
    if (!name.trim() || !parsed) return Alert.alert('Error', 'Nama dan target harus diisi');
    setCreating(true);
    try {
      await createSavingsGoal({ name: name.trim(), targetAmount: parsed, deadline: deadline || null });
      setShowCreate(false);
      setName('');
      setTarget('');
      setDeadline('');
      load();
    } catch {
      Alert.alert('Error', 'Gagal membuat target');
    } finally {
      setCreating(false);
    }
  };

  const handleAdd = async () => {
    if (!addGoal) return;
    const parsed = Number(addAmt);
    if (!parsed || parsed <= 0) return Alert.alert('Error', 'Jumlah harus lebih dari 0');
    setAdding(true);
    try {
      const updated = await addSavingsAmount(addGoal.id, parsed);
      if (updated.isCompleted) Alert.alert('🎉 Selamat!', `Target "${updated.name}" tercapai!`);
      setAddGoal(null);
      setAddAmt('');
      load();
    } catch {
      Alert.alert('Error', 'Gagal menambah tabungan');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (goal: SavingsGoal) => {
    Alert.alert('Hapus Target', `Hapus "${goal.name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSavingsGoal(goal.id);
            load();
          } catch { /* ignore */ }
        },
      },
    ]);
  };

  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  if (loading) return <PageLoader />;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <FlatList
        data={goals}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.brand} />}
        ListHeaderComponent={
          goals.length > 0 ? (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryLabel}>Terkumpul</Text>
                  <Text style={[styles.summaryValue, { color: colors.brand }]}>{fmtN(totalSaved)}</Text>
                </View>
                <View>
                  <Text style={styles.summaryLabel}>Target</Text>
                  <Text style={styles.summaryValue}>{fmtN(totalTarget)}</Text>
                </View>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="flag-outline" size={48} color={colors.textSoft} />
            <Text style={styles.emptyTitle}>Belum ada target tabungan</Text>
            <Text style={styles.emptyHint}>Buat target untuk menabung</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <FadeInUp delay={index * 60}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Ionicons name="flag" size={16} color={colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                  {item.deadline && <Text style={styles.cardDeadline}>Deadline: {item.deadline}</Text>}
                </View>
                {item.isCompleted && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.progressText}>{fmtN(item.savedAmount)} terkumpul</Text>
                <Text style={styles.progressPct}>{item.percentSaved}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${Math.min(100, item.percentSaved)}%` as `${number}%`, backgroundColor: item.isCompleted ? '#22c55e' : colors.brand }]} />
              </View>
              <Text style={styles.remaining}>Target: {fmtN(item.targetAmount)} · Sisa: {fmtN(item.remaining)}</Text>

              <View style={styles.cardActions}>
                {!item.isCompleted && (
                  <ScalePress>
                    <Pressable style={styles.addBtn} onPress={() => { setAddGoal(item); setAddAmt(''); }}>
                      <Ionicons name="add" size={14} color={colors.brand} />
                      <Text style={styles.addBtnText}>Tambah</Text>
                    </Pressable>
                  </ScalePress>
                )}
                <ScalePress>
                  <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                    <Ionicons name="trash-outline" size={14} color={colors.danger || '#ef4444'} />
                  </Pressable>
                </ScalePress>
              </View>
            </View>
          </FadeInUp>
        )}
      />

      <Pressable style={styles.fab} onPress={() => setShowCreate(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      {/* Create modal */}
      <Modal visible={showCreate} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buat Target Tabungan</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama target"
              placeholderTextColor={colors.textSoft}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Target nominal"
              placeholderTextColor={colors.textSoft}
              keyboardType="numeric"
              value={target}
              onChangeText={(v) => setTarget(v.replace(/[^0-9]/g, ''))}
            />
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancel} onPress={() => setShowCreate(false)}>
                <Text style={styles.modalCancelText}>Batal</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={handleCreate} disabled={creating}>
                <Text style={styles.modalSaveText}>{creating ? 'Menyimpan...' : 'Simpan'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add amount modal */}
      <Modal visible={!!addGoal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Tabungan</Text>
            <Text style={styles.modalHint}>Sisa: {fmtN(addGoal?.remaining || 0)}</Text>
            <TextInput
              style={styles.input}
              placeholder="Jumlah"
              placeholderTextColor={colors.textSoft}
              keyboardType="numeric"
              value={addAmt}
              onChangeText={(v) => setAddAmt(v.replace(/[^0-9]/g, ''))}
            />
            <View style={styles.modalBtns}>
              <Pressable style={styles.modalCancel} onPress={() => setAddGoal(null)}>
                <Text style={styles.modalCancelText}>Batal</Text>
              </Pressable>
              <Pressable style={styles.modalSave} onPress={handleAdd} disabled={adding}>
                <Text style={styles.modalSaveText}>{adding ? 'Menambah...' : 'Tambah'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(colors: ThemeColors, r: ReturnType<typeof useResponsive>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    list: { padding: spacing.md },
    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: radii.xl,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { fontSize: 11, fontWeight: '600', color: colors.textSoft, marginBottom: 2 },
    summaryValue: { fontSize: 18, fontWeight: '800', color: colors.text },
    empty: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 12 },
    emptyHint: { fontSize: 13, color: colors.textSoft, marginTop: 4 },
    card: {
      backgroundColor: colors.card,
      borderRadius: radii.xl,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    cardIcon: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.brandSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardName: { fontSize: 14, fontWeight: '700', color: colors.text },
    cardDeadline: { fontSize: 11, color: colors.textSoft },
    completedBadge: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: '#22c55e',
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    progressText: { fontSize: 11, color: colors.textSoft },
    progressPct: { fontSize: 11, fontWeight: '700', color: colors.text },
    progressBg: { height: 8, borderRadius: 4, backgroundColor: colors.border, marginBottom: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
    remaining: { fontSize: 11, color: colors.textSoft, marginBottom: 10 },
    cardActions: { flexDirection: 'row', gap: 8 },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: colors.brandSoft,
    },
    addBtnText: { fontSize: 12, fontWeight: '700', color: colors.brand },
    deleteBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      backgroundColor: `${colors.danger || '#ef4444'}15`,
    },
    fab: {
      position: 'absolute',
      bottom: 80,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.brand,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: radii.xl,
      padding: spacing.lg,
    },
    modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 12 },
    modalHint: { fontSize: 13, color: colors.textSoft, marginBottom: 12 },
    input: {
      backgroundColor: colors.bg,
      borderRadius: radii.lg,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },
    modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
    modalCancel: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
    modalCancelText: { fontSize: 14, fontWeight: '600', color: colors.textSoft },
    modalSave: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.brand },
    modalSaveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  });
}
