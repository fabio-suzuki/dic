import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../src/constants/theme';
import { useMeasurements } from '../../src/hooks/useMeasurements';
import { buildInsights, Insight, InsightTone } from '../../src/lib/insights';
import { formatDateBr } from '../../src/lib/calculations';

const TONE_COLORS: Record<InsightTone, string> = {
  positivo: COLORS.success,
  atencao: COLORS.warning,
  alerta: COLORS.danger,
  neutro: COLORS.info,
};

export default function InsightsScreen() {
  const { records, profile, latestRecord } = useMeasurements();
  const insights = useMemo(() => buildInsights(records, profile), [records, profile]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card
        title="Leitura das suas medidas"
        subtitle={
          latestRecord
            ? `Baseado na medição de ${formatDateBr(latestRecord.date)} e em ${records.length} registro${records.length > 1 ? 's' : ''}`
            : 'Registre medições para gerar insights'
        }
      />
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
      <Text style={styles.disclaimer}>
        As estimativas são orientativas e não substituem avaliação de profissional de saúde.
      </Text>
    </ScrollView>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <View style={[styles.card, { borderLeftColor: TONE_COLORS[insight.tone] }]}>
      <Text style={styles.title}>
        {insight.emoji} {insight.title}
      </Text>
      <Text style={styles.description}>{insight.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 5,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: { fontSize: FONT_SIZES.md, fontWeight: '700', color: COLORS.text },
  description: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  disclaimer: {
    marginTop: SPACING.md,
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
