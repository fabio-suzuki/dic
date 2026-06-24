import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { dictionaryData } from '../../src/data/dictionary';
import { RainbowBar } from '../../src/components/RainbowBar';
import { TagBadge } from '../../src/components/TagBadge';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  RAINBOW_GRADIENT,
} from '../../src/constants/theme';

export default function TermScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = dictionaryData.find((e) => e.id === id);

  if (entry == null) {
    return (
      <>
        <Stack.Screen options={{ title: 'Não encontrado' }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>😕</Text>
          <Text style={styles.notFoundText}>Verbete não encontrado</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: entry.term }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <RainbowBar />

        {entry.illustration != null && (
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
              <Text style={styles.illustrationEmoji}>{entry.illustration}</Text>
            </View>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.term}>{entry.term}</Text>

          <View style={styles.tags}>
            {entry.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: RAINBOW_GRADIENT[0] }]} />
              <Text style={styles.sectionTitle}>Definição</Text>
            </View>
            <Text style={styles.sectionText}>{entry.definition}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: RAINBOW_GRADIENT[2] }]} />
              <Text style={styles.sectionTitle}>Semântica</Text>
            </View>
            <Text style={styles.sectionText}>{entry.semantics}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionDot, { backgroundColor: RAINBOW_GRADIENT[4] }]} />
              <Text style={styles.sectionTitle}>Exemplo de uso</Text>
            </View>
            <View style={styles.exampleBox}>
              <Text style={styles.exampleText}>{entry.example}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  illustrationEmoji: {
    fontSize: 48,
  },
  term: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
    paddingLeft: SPACING.lg + 2,
  },
  exampleBox: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginLeft: SPACING.lg + 2,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
  },
  exampleText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primaryDark,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  notFoundEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  notFoundText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
});
