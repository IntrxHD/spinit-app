import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Wheel } from '@/types';

const NEON = ['#FF3CAC','#FF6B35','#FFD23F','#3BF4FB','#A855F7','#22D3EE','#F59E0B','#10B981','#EC4899','#6366F1'];

interface Props {
  wheel: Wheel;
  onPress: () => void;
  onFavorite?: () => void;
  onDelete?: () => void;
}

export default function WheelCard({ wheel, onPress, onFavorite, onDelete }: Props) {
  const preview = wheel.options.slice(0, 4).map((o) => o.color ?? '#FF3CAC');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.strip}>
        {preview.map((c, i) => (
          <View key={i} style={[styles.stripSegment, { backgroundColor: c }]} />
        ))}
      </View>
      <View style={styles.body}>
        <Text style={styles.emoji}>{wheel.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{wheel.name}</Text>
          <Text style={styles.count}>{wheel.options.length} opciones</Text>
        </View>
        <View style={styles.actions}>
          {onFavorite && (
            <TouchableOpacity onPress={onFavorite} style={styles.actionBtn}>
              <Text style={{ fontSize: 18 }}>{wheel.isFavorite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
              <Text style={{ fontSize: 16, color: '#EF4444' }}>✕</Text>
            </TouchableOpacity>
          )}
          <View style={styles.chevron}>
            <Text style={styles.chevronText}>›</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#12121A', borderRadius: 20, marginBottom: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A3E' },
  strip: { flexDirection: 'row', height: 5 },
  stripSegment: { flex: 1 },
  body: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  name: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  count: { color: '#4A4A6A', fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionBtn: { padding: 4 },
  chevron: { marginLeft: 4 },
  chevronText: { color: '#4A4A6A', fontSize: 22, fontWeight: '300' },
});
