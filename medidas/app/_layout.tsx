import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../src/constants/theme';
import { MeasurementsProvider } from '../src/hooks/useMeasurements';

export default function RootLayout() {
  return (
    <MeasurementsProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.textLight,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="historico" options={{ title: 'Histórico' }} />
      </Stack>
    </MeasurementsProvider>
  );
}
