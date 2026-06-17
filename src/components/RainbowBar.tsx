import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RAINBOW_GRADIENT } from '../constants/theme';

export function RainbowBar() {
  return (
    <View style={styles.container}>
      {RAINBOW_GRADIENT.map((color) => (
        <View key={color} style={[styles.stripe, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
  },
  stripe: {
    flex: 1,
  },
});
