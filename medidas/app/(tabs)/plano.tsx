import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { Segmented } from '../../src/components/Segmented';
import { FOCUS_OPTIONS } from '../../src/constants/fields';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../src/constants/theme';
import { useMeasurements } from '../../src/hooks/useMeasurements';
import { energyPlan, formatMetric } from '../../src/lib/calculations';
import { NUTRITION_PLANS, TRAINING_PLANS } from '../../src/lib/plans';

export default function PlanScreen() {
  const { profile, updateProfile, latestRecord } = useMeasurements();
  const training = TRAINING_PLANS[profile.focus];
  const nutrition = NUTRITION_PLANS[profile.focus];
  const energy = energyPlan(profile, latestRecord?.values.peso);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card title="Seu foco" subtitle="O plano de treino e alimentação se adapta a esta escolha">
        <Segmented
          options={FOCUS_OPTIONS.map((f) => ({ value: f.value, label: `${f.emoji} ${f.label}` }))}
          value={profile.focus}
          onChange={(focus) => updateProfile({ focus })}
        />
      </Card>

      <Card title={`🏋️ ${training.headline}`} subtitle={training.summary}>
        {training.weeklySplit.map((day) => (
          <View key={day.day} style={styles.dayRow}>
            <Text style={styles.dayBadge}>{day.day}</Text>
            <View style={styles.dayContent}>
              <Text style={styles.dayTitle}>{day.title}</Text>
              {day.exercises.map((exercise) => (
                <Text key={exercise} style={styles.item}>
                  • {exercise}
                </Text>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.note}>Cardio: {training.cardio}</Text>
        <Text style={styles.note}>Progressão: {training.progression}</Text>
      </Card>

      <Card title={`🍽️ ${nutrition.headline}`} subtitle={nutrition.summary}>
        {energy ? (
          <View style={styles.macroRow}>
            <Macro label="Meta diária" value={`${Math.round(energy.target)} kcal`} />
            <Macro label="Proteína" value={`${Math.round(energy.proteinG)} g`} />
            <Macro label="Carboidrato" value={`${Math.round(energy.carbG)} g`} />
            <Macro label="Gordura" value={`${Math.round(energy.fatG)} g`} />
          </View>
        ) : (
          <Text style={styles.warning}>
            Informe peso, altura e ano de nascimento no perfil para calcular calorias e macros.
          </Text>
        )}
        {energy ? (
          <Text style={styles.note}>
            TMB {Math.round(energy.bmr)} kcal · gasto total {Math.round(energy.tdee)} kcal · água{' '}
            {formatMetric(energy.waterMl / 1000)} L/dia
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>Prioridades</Text>
        {nutrition.priorities.map((priority) => (
          <Text key={priority} style={styles.item}>
            • {priority}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Sugestão de cardápio</Text>
        {nutrition.meals.map((meal) => (
          <Text key={meal.name} style={styles.item}>
            <Text style={styles.mealName}>{meal.name}: </Text>
            {meal.suggestion}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Evite</Text>
        {nutrition.avoid.map((avoid) => (
          <Text key={avoid} style={styles.item}>
            • {avoid}
          </Text>
        ))}
      </Card>

      <Text style={styles.disclaimer}>
        Sugestões gerais baseadas em diretrizes de treino e nutrição. Consulte profissionais para
        prescrição individualizada.
      </Text>
    </ScrollView>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroBox}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: SPACING.md, paddingBottom: SPACING.xl },
  dayRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  dayBadge: {
    width: 40,
    paddingVertical: SPACING.xs,
    textAlign: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: BORDER_RADIUS.sm,
    color: COLORS.primaryDark,
    fontWeight: '800',
    fontSize: FONT_SIZES.xs,
  },
  dayContent: { flex: 1 },
  dayTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text },
  item: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  mealName: { fontWeight: '700', color: COLORS.text },
  note: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  macroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  macroBox: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  macroLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontWeight: '600' },
  macroValue: { fontSize: FONT_SIZES.lg, fontWeight: '800', color: COLORS.primaryDark },
  warning: { fontSize: FONT_SIZES.sm, color: COLORS.warning, fontWeight: '600' },
  disclaimer: {
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
