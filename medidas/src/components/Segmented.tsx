import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../constants/theme';

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  scrollable?: boolean;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  scrollable = true,
}: SegmentedProps<T>) {
  const content = options.map((option) => {
    const active = option.value === value;
    return (
      <Pressable
        key={option.value}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        onPress={() => onChange(option.value)}
        style={[styles.chip, active && styles.chipActive]}
      >
        <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
      </Pressable>
    );
  });

  if (!scrollable) return <>{content}</>;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.textLight,
  },
});
