import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { MeasurementField } from '../types/measurements';
import { formatSigned } from '../lib/calculations';

interface MeasurementInputProps {
  field: MeasurementField;
  value: string;
  previous?: number;
  onChangeText: (text: string) => void;
}

export function MeasurementInput({ field, value, previous, onChangeText }: MeasurementInputProps) {
  const parsed = Number(value.replace(',', '.'));
  const diff =
    previous !== undefined && Number.isFinite(parsed) && value.trim().length > 0
      ? parsed - previous
      : undefined;

  return (
    <View style={styles.row}>
      <View style={styles.labelBox}>
        <Text style={styles.label}>{field.label}</Text>
        <Text style={styles.hint} numberOfLines={1}>
          {field.hint}
        </Text>
      </View>
      <View style={styles.inputBox}>
        <TextInput
          accessibilityLabel={`${field.label} em ${field.unit}`}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="—"
          placeholderTextColor={COLORS.textSecondary}
          maxLength={6}
        />
        <Text style={styles.unit}>{field.unit}</Text>
      </View>
      <Text
        style={[
          styles.diff,
          diff !== undefined && diff > 0 && styles.diffUp,
          diff !== undefined && diff < 0 && styles.diffDown,
        ]}
      >
        {diff === undefined ? '' : formatSigned(diff)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  labelBox: { flex: 1, paddingRight: SPACING.sm },
  label: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.text },
  hint: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    width: 62,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
  },
  unit: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginLeft: 4 },
  diff: {
    width: 52,
    textAlign: 'right',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  diffUp: { color: COLORS.warning },
  diffDown: { color: COLORS.success },
});
