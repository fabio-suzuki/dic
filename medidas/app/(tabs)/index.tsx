import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { Card } from '../../src/components/Card';
import { MeasurementInput } from '../../src/components/MeasurementInput';
import { GROUP_LABELS, MEASUREMENT_FIELDS } from '../../src/constants/fields';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../src/constants/theme';
import { useMeasurements } from '../../src/hooks/useMeasurements';
import {
  bmi,
  bmiCategory,
  bodyFatNavy,
  formatMetric,
  maskDateBr,
  parseMetric,
} from '../../src/lib/calculations';
import { MeasurementField, MeasurementKey, MeasurementValues } from '../../src/types/measurements';

const GROUPS: MeasurementField['group'][] = ['geral', 'tronco', 'membros'];

export default function MeasureScreen() {
  const {
    ready,
    draft,
    draftSavedAt,
    profile,
    latestRecord,
    updateDraftValue,
    updateDraftDate,
    updateDraftNote,
    resetDraft,
    commitDraft,
  } = useMeasurements();
  const [feedback, setFeedback] = useState<string | null>(null);

  const draftValues: MeasurementValues = useMemo(() => {
    const parsed: MeasurementValues = {};
    (Object.keys(draft.values) as MeasurementKey[]).forEach((key) => {
      const value = parseMetric(draft.values[key]);
      if (value !== undefined) parsed[key] = value;
    });
    return parsed;
  }, [draft.values]);

  const imc = bmi(draftValues.peso, profile.heightCm);
  const bf = bodyFatNavy(draftValues, profile);
  const filledCount = Object.keys(draftValues).length;

  const handleSave = () => {
    const saved = commitDraft();
    setFeedback(
      saved
        ? `Medição de ${saved.date.split('-').reverse().join('/')} salva.`
        : 'Preencha ao menos uma medida antes de salvar.'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {!ready
              ? 'Recuperando rascunho…'
              : draftSavedAt > 0
                ? `✓ Rascunho salvo automaticamente às ${new Date(draftSavedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                : 'Tudo o que você digita é salvo automaticamente'}
          </Text>
          {draft.editingId ? <Text style={styles.editingBadge}>editando</Text> : null}
        </View>

        <Card title="Medição" subtitle="Valores em escala métrica (kg e cm)">
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Data</Text>
            <TextInput
              accessibilityLabel="Data da medição"
              style={styles.dateInput}
              value={draft.date}
              onChangeText={(text) => updateDraftDate(maskDateBr(text))}
              keyboardType="number-pad"
              placeholder="dd/mm/aaaa"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={10}
            />
          </View>

          <View style={styles.summaryRow}>
            <Summary label="Preenchidas" value={`${filledCount}/${MEASUREMENT_FIELDS.length}`} />
            <Summary label="IMC" value={imc ? formatMetric(imc) : '—'} hint={imc ? bmiCategory(imc).label : 'informe peso e altura'} />
            <Summary label="Gordura" value={bf ? `${formatMetric(bf)}%` : '—'} hint={bf ? 'estimativa US Navy' : 'pescoço + cintura'} />
          </View>
        </Card>

        {GROUPS.map((group) => (
          <Card key={group} title={GROUP_LABELS[group]}>
            {MEASUREMENT_FIELDS.filter((f) => f.group === group).map((field) => (
              <MeasurementInput
                key={field.key}
                field={field}
                value={draft.values[field.key] ?? ''}
                previous={latestRecord?.values[field.key]}
                onChangeText={(text) => updateDraftValue(field.key, text)}
              />
            ))}
          </Card>
        ))}

        <Card title="Observações" subtitle="Treino, sono, ciclo menstrual, retenção…">
          <TextInput
            accessibilityLabel="Observações"
            style={styles.noteInput}
            value={draft.note}
            onChangeText={updateDraftNote}
            multiline
            placeholder="Como você estava nesse dia?"
            placeholderTextColor={COLORS.textSecondary}
          />
        </Card>

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        <View style={styles.actions}>
          <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.primaryButtonText}>
              {draft.editingId ? 'Atualizar medição' : 'Salvar medição'}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.secondaryButton}
            onPress={() => {
              resetDraft();
              setFeedback('Rascunho limpo.');
            }}
          >
            <Text style={styles.secondaryButtonText}>Limpar</Text>
          </Pressable>
        </View>

        <Link href="/historico" style={styles.historyLink}>
          Ver histórico de medições →
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Summary({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
      {hint ? (
        <Text style={styles.summaryHint} numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingTop: SPACING.md, paddingBottom: SPACING.xl },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: { flex: 1, fontSize: FONT_SIZES.xs, color: COLORS.primaryDark, fontWeight: '600' },
  editingBadge: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.accent,
    textTransform: 'uppercase',
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  dateLabel: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  dateInput: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  summaryBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  summaryLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontWeight: '600' },
  summaryValue: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.primaryDark },
  summaryHint: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  noteInput: {
    minHeight: 72,
    backgroundColor: COLORS.inputBg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  feedback: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginHorizontal: SPACING.md },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  primaryButtonText: { color: COLORS.textLight, fontWeight: '700', fontSize: FONT_SIZES.md },
  secondaryButton: {
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  secondaryButtonText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: FONT_SIZES.md },
  historyLink: {
    marginTop: SPACING.md,
    marginHorizontal: SPACING.md,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
  },
});
