import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export default function GlowButton({ label, onPress, disabled, size = 'md', style }: Props) {
  const heights = { sm: 44, md: 56, lg: 68 };
  const fontSizes = { sm: 14, md: 17, lg: 20 };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[styles.wrapper, { opacity: disabled ? 0.5 : 1, height: heights[size] }, style]}
    >
      <LinearGradient
        colors={disabled ? ['#333', '#222'] : ['#FF3CAC', '#784BA0', '#2B86C5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.label, { fontSize: fontSizes[size] }]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 9999,
    shadowColor: '#FF3CAC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    borderRadius: 9999,
  },
  label: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
