import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Card } from '../../src/components/Card';
import { LineChart } from '../../src/components/LineChart';
import { Segmented } from '../../src/components/Segmented';
import { FIELD_UNITS, MEASUREMENT_FIELDS } from '../../src/constants/fields';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../src/constants/theme';
import { useMeasurements } from '../../src/hooks/useMeasurements';
import {
  bmi,
  bodyFatNavy,
  formatMetric,
  formatSigned,
  seriesFor,
} from '../../src/lib/calculations';
import { MeasurementKey } from '../../src/types/measurements';

export default function EvolutionScreen() {
  const { records, profile } = useMeasurements();
  const { width } = useWindowDimensions();
  const [metric, setMetric] = useState<MeasurementKey>('peso');

  const chartWidth = width - SPACING.md * 2 - SPACING.md * 2;
  const series = useMemo(() => seriesFor(records, metric), [records, metric]);

  const derived = useMemo(() => {
    const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
    return {
      imc: sorted
        .map((r) => ({ date: r.date, value: bmi(r.values.peso, profile.heightCm) }))
        .filter((p): p is { date: string; value: number } => p.value !== undefined),
      bf: sorted
        .map((r) => ({ date: r.date, value: bodyFatNavy(r.values, profile) }))
        .filter((p): p is { date: string; value: number } => p.value !== undefined),
    };
  }, [records, profile]);

  const first = series[0]?.value;
  const last = series[series.length - 1]?.value;
  const total = first !== undefined && last !== undefined ? last - first : undefined;

  if (records.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Sem medições ainda</Text>
        <Text style={styles.emptyText}>
          Registre medições na aba Medir para ver os gráficos de evolução.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.selector}>
        <Segmented
          options={MEASUREMENT_FIELDS.map((f) => ({ value: f.key, label: f.label }))}
          value={metric}
          onChange={setMetric}
        />
      </View>

      <Card
        title={MEASUREMENT_FIELDS.find((f) => f.key === metric)?.label}
        subtitle={
          total === undefined
            ? 'Ao menos duas medições para calcular a variação'
            : `Variação total: ${formatSigned(total)} ${FIELD_UNITS[metric]} (de ${formatMetric(first)} para ${formatMetric(last)})`
        }
      >
        <LineChart data={series} unit={FIELD_UNITS[metric]} width={chartWidth} />
      </Card>

      <Card title="IMC" subtitle="Peso corrigido pela altura ao longo do tempo">
        <LineChart data={derived.imc} unit="kg/m²" width={chartWidth} height={160} />
      </Card>

      <Card title="Gordura corporal estimada" subtitle="Método US Navy por circunferências">
        <LineChart data={derived.bf} unit="%" width={chartWidth} height={160} />
      </Card>

      <Card title="Resumo por medida" subtitle="Primeira vs. última medição registrada">
        {MEASUREMENT_FIELDS.map((field) => {
          const points = seriesFor(records, field.key);
          if (points.length < 2) return null;
          const diff = points[points.length - 1].value - points[0].value;
          return (
            <View key={field.key} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{field.label}</Text>
              <Text style={styles.summaryValues}>
                {formatMetric(points[0].value)} → {formatMetric(points[points.length - 1].value)}{' '}
                {field.unit}
              </Text>
              <Text
                style={[
                  styles.summaryDiff,
                  diff > 0 ? styles.diffUp : diff < 0 ? styles.diffDown : null,
                ]}
              >
                {formatSigned(diff)}
              </Text>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: SPACING.md, paddingBottom: SPACING.xl },
  selector: { marginHorizontal: SPACING.md, marginBottom: SPACING.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  emptyTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: COLORS.text },
  emptyText: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
  },
  summaryLabel: { flex: 1, fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.text },
  summaryValues: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  summaryDiff: {
    width: 56,
    textAlign: 'right',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  diffUp: { color: COLORS.warning },
  diffDown: { color: COLORS.success },
});
