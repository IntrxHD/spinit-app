import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WheelOption } from '@/types';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  winner: WheelOption | null;
  onClose: () => void;
  onSpinAgain: () => void;
}

export default function ResultModal({ visible, winner, onClose, onSpinAgain }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!winner) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <LinearGradient colors={['#1A1A28', '#12121A']} style={styles.gradient}>
            <View style={[styles.colorBar, { backgroundColor: winner.color ?? '#FF3CAC' }]} />
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.label}>¡El ganador es!</Text>
            <Text style={[styles.winner, { color: winner.color ?? '#FF3CAC' }]}>{winner.label}</Text>
            <View style={styles.divider} />
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
                <Text style={styles.btnSecondaryText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: winner.color ?? '#FF3CAC' }]} onPress={onSpinAgain}>
                <Text style={styles.btnPrimaryText}>Girar otra vez 🔄</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center', padding: 32 },
  card: { width: '100%', maxWidth: 360, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A3E' },
  gradient: { padding: 32, alignItems: 'center' },
  colorBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  emoji: { fontSize: 48, marginTop: 16, marginBottom: 8 },
  label: { color: '#A0A0B8', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  winner: { fontSize: 32, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5, marginBottom: 24 },
  divider: { width: '100%', height: 1, backgroundColor: '#2A2A3E', marginBottom: 24 },
  actions: { flexDirection: 'row', gap: 8, width: '100%' },
  btnSecondary: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#1A1A28', borderWidth: 1, borderColor: '#2A2A3E' },
  btnSecondaryText: { color: '#A0A0B8', fontWeight: '600', fontSize: 15 },
  btnPrimary: { flex: 2, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
