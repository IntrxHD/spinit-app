import React, { useRef, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SpinWheel, { SpinWheelRef } from '@/components/SpinWheel';
import ResultModal from '@/components/ResultModal';
import GlowButton from '@/components/GlowButton';
import WheelCard from '@/components/WheelCard';
import { useWheels } from '@/hooks/useWheels';
import { Wheel, WheelOption } from '@/types';
import { TEMPLATES } from '@/constants/templates';

export default function SpinScreen() {
  const { wheels, recent, toggleFavorite, markUsed, createFromTemplate } = useWheels();
  const wheelRef = useRef<SpinWheelRef>(null);
  const [activeWheel, setActiveWheel] = useState<Wheel | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelOption | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSpin = useCallback(() => {
    if (!wheelRef.current || !activeWheel) return;
    setIsSpinning(true);
    wheelRef.current.spin((w) => {
      setIsSpinning(false);
      setWinner(w);
      setShowResult(true);
      if (activeWheel) markUsed(activeWheel.id);
    });
  }, [activeWheel, markUsed]);

  const handleSelectWheel = (w: Wheel) => {
    setActiveWheel(w);
    setShowResult(false);
    setWinner(null);
  };

  const loadTemplate = async (idx: number) => {
    const t = TEMPLATES[idx];
    const w = await createFromTemplate(t.id, t.name, t.emoji, t.options);
    setActiveWheel(w);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LinearGradient colors={['#FF3CAC', '#784BA0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logoAccent} />
          <Text style={styles.logo}>SpinIt</Text>
          <Text style={styles.tagline}>Deja que el destino decida ✨</Text>
        </View>
        <View style={styles.wheelSection}>
          {activeWheel ? (
            <>
              <Text style={styles.wheelTitle}>{activeWheel.emoji} {activeWheel.name}</Text>
              <SpinWheel ref={wheelRef} options={activeWheel.options} />
              <GlowButton label={isSpinning ? '🔄 Girando...' : '¡GIRAR!'} onPress={handleSpin} disabled={isSpinning} size="lg" style={styles.spinBtn} />
            </>
          ) : (
            <View style={styles.emptyWheel}>
              <Text style={styles.emptyEmoji}>🎡</Text>
              <Text style={styles.emptyTitle}>Selecciona una ruleta</Text>
              <Text style={styles.emptySubtitle}>Elige una plantilla abajo o crea la tuya propia</Text>
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plantillas rápidas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {TEMPLATES.map((t, i) => (
              <TouchableOpacity key={t.id} style={styles.chip} onPress={() => loadTemplate(i)} activeOpacity={0.7}>
                <LinearGradient colors={['#1A1A28', '#12121A']} style={styles.chipGrad}>
                  <Text style={styles.chipEmoji}>{t.emoji}</Text>
                  <Text style={styles.chipName}>{t.name.replace(/.*\s/, '')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {recent.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recientes</Text>
            {recent.map((w) => (
              <WheelCard key={w.id} wheel={w} onPress={() => handleSelectWheel(w)} onFavorite={() => toggleFavorite(w.id)} />
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
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  logoAccent: { width: 40, height: 4, borderRadius: 2, marginBottom: 8 },
  logo: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  tagline: { color: '#4A4A6A', fontSize: 14, marginTop: 2 },
  wheelSection: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 32, minHeight: 420, justifyContent: 'center' },
  wheelTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 24 },
  spinBtn: { marginTop: 32, alignSelf: 'stretch' },
  emptyWheel: { alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { color: '#4A4A6A', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  section: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: { color: '#A0A0B8', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 },
  chips: { marginHorizontal: -24, paddingHorizontal: 24 },
  chip: { marginRight: 8, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A3E' },
  chipGrad: { paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center', minWidth: 80 },
  chipEmoji: { fontSize: 24, marginBottom: 4 },
  chipName: { color: '#A0A0B8', fontSize: 11, fontWeight: '600' },
});
