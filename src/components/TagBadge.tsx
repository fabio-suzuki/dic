import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../constants/theme';

const TAG_COLORS: Record<string, string> = {
  identidade: COLORS.tagIdentity,
  moda: COLORS.tagFashion,
  'expressão': COLORS.tagExpression,
  social: COLORS.tagSocial,
  'gíria': COLORS.tagSlang,
  corpo: COLORS.orange,
  cotidiano: COLORS.green,
  'aprovação': COLORS.blue,
  cultura: COLORS.violet,
  linguagem: COLORS.primaryLight,
  dança: COLORS.red,
  'gênero': COLORS.primaryDark,
  'atração': COLORS.red,
};

interface TagBadgeProps {
  tag: string;
}

export function TagBadge({ tag }: TagBadgeProps) {
  const bgColor = TAG_COLORS[tag] ?? COLORS.tagGeneral;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor + '20' }]}>
      <Text style={[styles.text, { color: bgColor }]}>{tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
