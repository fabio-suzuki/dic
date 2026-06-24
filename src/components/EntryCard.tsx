import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../constants/theme';
import { TagBadge } from './TagBadge';
import { DictionaryEntry } from '../types/dictionary';

interface EntryCardProps {
  entry: DictionaryEntry;
  onPress: () => void;
}

export function EntryCard({ entry, onPress }: EntryCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        {entry.illustration != null && (
          <Text style={styles.emoji}>{entry.illustration}</Text>
        )}
        <View style={styles.headerText}>
          <Text style={styles.term}>{entry.term}</Text>
          <Text style={styles.definition} numberOfLines={2}>
            {entry.definition}
          </Text>
        </View>
      </View>
      <View style={styles.tags}>
        {entry.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  emoji: {
    fontSize: 36,
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  term: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  definition: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
});
