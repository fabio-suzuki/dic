import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { Card } from '../../src/components/Card';
import { Segmented } from '../../src/components/Segmented';
import { ACTIVITY_OPTIONS, FOCUS_OPTIONS } from '../../src/constants/fields';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../src/constants/theme';
import { useMeasurements } from '../../src/hooks/useMeasurements';
import { Sex } from '../../src/types/measurements';

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
];

export default function ProfileScreen() {
  const { profile, updateProfile, records } = useMeasurements();

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Card title="Perfil" subtitle="Cada alteração é salva na hora, sem botão de confirmar">
        <Field label="Nome">
          <TextInput
            accessibilityLabel="Nome"
            style={styles.input}
            value={profile.name}
            onChangeText={(name) => updateProfile({ name })}
            placeholder="Como quer ser chamada(o)"
            placeholderTextColor={COLORS.textSecondary}
          />
        </Field>

        <Field label="Altura (cm)">
          <TextInput
            accessibilityLabel="Altura em centímetros"
            style={styles.input}
            value={profile.heightCm ? String(profile.heightCm) : ''}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, '').slice(0, 3);
              updateProfile({ heightCm: digits ? Number(digits) : undefined });
            }}
            keyboardType="number-pad"
            placeholder="170"
            placeholderTextColor={COLORS.textSecondary}
          />
        </Field>

        <Field label="Ano de nascimento">
          <TextInput
            accessibilityLabel="Ano de nascimento"
            style={styles.input}
            value={profile.birthYear ? String(profile.birthYear) : ''}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, '').slice(0, 4);
              updateProfile({ birthYear: digits ? Number(digits) : undefined });
            }}
            keyboardType="number-pad"
            placeholder="1990"
            placeholderTextColor={COLORS.textSecondary}
          />
        </Field>

        <Text style={styles.label}>Sexo biológico (usado nas fórmulas)</Text>
        <Segmented options={SEX_OPTIONS} value={profile.sex} onChange={(sex) => updateProfile({ sex })} />

        <Text style={styles.label}>Nível de atividade</Text>
        <Segmented
          options={ACTIVITY_OPTIONS.map((a) => ({ value: a.value, label: a.label }))}
          value={profile.activity}
          onChange={(activity) => updateProfile({ activity })}
        />

        <Text style={styles.label}>Foco</Text>
        <Segmented
          options={FOCUS_OPTIONS.map((f) => ({ value: f.value, label: `${f.emoji} ${f.label}` }))}
          value={profile.focus}
          onChange={(focus) => updateProfile({ focus })}
        />
      </Card>

      <Card title="Dados" subtitle="Tudo fica apenas neste aparelho">
        <Text style={styles.info}>
          {records.length} {records.length === 1 ? 'medição armazenada' : 'medições armazenadas'}{' '}
          localmente.
        </Text>
        <Link href="/historico" style={styles.link}>
          Abrir histórico →
        </Link>
      </Card>
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: SPACING.md, paddingBottom: SPACING.xl },
  field: { marginBottom: SPACING.sm },
  label: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  info: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  link: { marginTop: SPACING.sm, color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZES.md },
});
