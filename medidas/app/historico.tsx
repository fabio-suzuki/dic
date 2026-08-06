import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FIELD_LABELS, FIELD_UNITS } from '../src/constants/fields';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../src/constants/theme';
import { useMeasurements } from '../src/hooks/useMeasurements';
import { formatDateBr, formatMetric } from '../src/lib/calculations';
import { MeasurementKey, MeasurementRecord } from '../src/types/measurements';

export default function HistoryScreen() {
  const { records, editRecord, deleteRecord } = useMeasurements();
  const router = useRouter();

  const handleEdit = (record: MeasurementRecord) => {
    editRecord(record.id);
    router.push('/');
  };

  const handleDelete = (record: MeasurementRecord) => {
    Alert.alert('Excluir medição', `Remover o registro de ${formatDateBr(record.date)}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteRecord(record.id) },
    ]);
  };

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <Text style={styles.empty}>Nenhuma medição registrada até agora.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.date}>{formatDateBr(item.date)}</Text>
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>Editar</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => handleDelete(item)}>
                <Text style={styles.delete}>Excluir</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.values}>
            {(Object.keys(item.values) as MeasurementKey[]).map((key) => (
              <Text key={key} style={styles.value}>
                <Text style={styles.valueLabel}>{FIELD_LABELS[key]}: </Text>
                {formatMetric(item.values[key])} {FIELD_UNITS[key]}
              </Text>
            ))}
          </View>
          {item.note ? <Text style={styles.note}>“{item.note}”</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.text },
  actions: { flexDirection: 'row', gap: SPACING.md },
  edit: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZES.sm },
  delete: { color: COLORS.danger, fontWeight: '700', fontSize: FONT_SIZES.sm },
  values: { marginTop: SPACING.sm, gap: 2 },
  value: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  valueLabel: { fontWeight: '600', color: COLORS.text },
  note: { marginTop: SPACING.sm, fontStyle: 'italic', color: COLORS.textSecondary },
});
