import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SpinWheel, { SpinWheelRef } from '@/components/SpinWheel';
import ResultModal from '@/components/ResultModal';
import GlowButton from '@/components/GlowButton';
import WheelCard from '@/components/WheelCard';
import { useWheels } from '@/hooks/useWheels';
import { Wheel, WheelOption } from '@/types';

export default function FavoritesScreen() {
  const { favorites, wheels, toggleFavorite, deleteWheel, markUsed } = useWheels();
  const wheelRef = useRef<SpinWheelRef>(null);
  const [activeWheel, setActiveWheel] = useState<Wheel | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelOption | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSpin = () => {
    if (!wheelRef.current || !activeWheel) return;
    setIsSpinning(true);
    wheelRef.current.spin((w) => {
      setIsSpinning(false);
      setWinner(w);
      setShowResult(true);
      markUsed(activeWheel.id);
    });
  };

  const confirmDelete = (wheel: Wheel) => {
    Alert.alert('¿Eliminar ruleta?', `Se eliminará "${wheel.name}" permanentemente.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { deleteWheel(wheel.id); if (activeWheel?.id === wheel.id) setActiveWheel(null); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient colors={['#EC4899', '#F97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.accent} />
          <Text style={styles.title}>Favoritas</Text>
          <Text style={styles.subtitle}>Tus ruletas guardadas</Text>
        </View>
        {activeWheel && (
          <View style={styles.spinSection}>
            <Text style={styles.wheelTitle}>{activeWheel.emoji} {activeWheel.name}</Text>
            <SpinWheel ref={wheelRef} options={activeWheel.options} />
            <GlowButton label={isSpinning ? '🔄 Girando...' : '¡GIRAR!'} onPress={handleSpin} disabled={isSpinning} size="lg" style={{ marginTop: 24, alignSelf: 'stretch' }} />
          </View>
        )}
        {favorites.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>❤️ Guardadas ({favorites.length})</Text>
            {favorites.map((w) => (
              <WheelCard key={w.id} wheel={w} onPress={() => { setActiveWheel(w); setShowResult(false); }} onFavorite={() => toggleFavorite(w.id)} onDelete={() => confirmDelete(w)} />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🤍</Text>
            <Text style={styles.emptyTitle}>Sin favoritas aún</Text>
            <Text style={styles.emptySubtitle}>Toca el ❤️ en cualquier ruleta para guardarla aquí.</Text>
          </View>
        )}
        {wheels.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Todas las ruletas ({wheels.length})</Text>
            {wheels.map((w) => (
              <WheelCard key={w.id} wheel={w} onPress={() => { setActiveWheel(w); setShowResult(false); }} onFavorite={() => toggleFavorite(w.id)} onDelete={() => confirmDelete(w)} />
            ))}
          </View>
        )}
      </ScrollView>
      <ResultModal visible={showResult} winner={winner} onClose={() => setShowResult(false)} onSpinAgain={() => { setShowResult(false); setTimeout(handleSpin, 300); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0F' },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { padding: 24, paddingBottom: 16 },
  accent: { width: 40, height: 4, borderRadius: 2, marginBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#4A4A6A', fontSize: 14, marginTop: 4 },
  spinSection: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 32 },
  wheelTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 24 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { color: '#A0A0B8', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 },
  empty: { alignItems: 'center', padding: 48 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { color: '#4A4A6A', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
