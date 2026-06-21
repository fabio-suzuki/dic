import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SearchBar } from '../src/components/SearchBar';
import { EntryCard } from '../src/components/EntryCard';
import { RainbowBar } from '../src/components/RainbowBar';
import { dictionaryData } from '../src/data/dictionary';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/theme';
import { DictionaryEntry } from '../src/types/dictionary';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (query.trim().length === 0) {
      return [...dictionaryData].sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
    }
    const q = normalize(query.trim());
    return dictionaryData
      .filter(
        (e) =>
          normalize(e.term).includes(q) ||
          normalize(e.definition).includes(q) ||
          e.tags.some((t) => normalize(t).includes(q))
      )
      .sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
  }, [query]);

  const handlePress = (entry: DictionaryEntry) => {
    router.push({ pathname: '/term/[id]', params: { id: entry.id } });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>🏳️‍🌈 Pajubá</Text>
              <Text style={styles.headerSubtitle}>Dicionário Ilustrado</Text>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        <RainbowBar />
        <SearchBar value={query} onChangeText={setQuery} />
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {filtered.length} {filtered.length === 1 ? 'verbete' : 'verbetes'}
          </Text>
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EntryCard entry={item} onPress={() => handlePress(item)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>
                Nenhum verbete encontrado para "{query}"
              </Text>
              <Text style={styles.emptyHint}>
                Tente buscar por outro termo ou tag
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    opacity: 0.85,
    marginTop: -2,
  },
  countRow: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  countText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});
