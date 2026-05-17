import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { useWheels } from '@/hooks/useWheels';
import GlowButton from '@/components/GlowButton';

const EMOJIS = ['🎡', '⭐', '🔥', '💎', '🌈', '🎯', '🎮', '🚀', '🏆', '✨'];
const NEON = ['#FF3CAC','#FF6B35','#FFD23F','#3BF4FB','#A855F7','#22D3EE','#F59E0B','#10B981','#EC4899','#6366F1'];

export default function CustomScreen() {
  const { createCustomWheel } = useWheels();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎡');
  const [optionInput, setOptionInput] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (!trimmed) return;
    if (options.includes(trimmed)) { Alert.alert('Duplicado', 'Esa opción ya existe.'); return; }
    if (options.length >= 20) { Alert.alert('Límite', 'Máximo 20 opciones.'); return; }
    setOptions([...options, trimmed]);
    setOptionInput('');
  };

  const removeOption = (idx: number) => setOptions(options.filter((_, i) => i !== idx));

  const handleCreate = async () => {
    if (!name.trim()) { Alert.alert('Falta el nombre', 'Ponle un nombre a tu ruleta.'); return; }
    if (options.length < 2) { Alert.alert('Pocas opciones', 'Añade al menos 2 opciones.'); return; }
    setSaving(true);
    await createCustomWheel(name.trim(), emoji, options);
    setSaving(false);
    Alert.alert('✅ ¡Ruleta creada!', 'Ya puedes usarla en la pestaña Girar.');
    setName(''); setOptions([]); setOptionInput(''); setEmoji('🎡');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <LinearGradient colors={['#10B981', '#2B86C5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.accent} />
            <Text style={styles.title}>Crear Ruleta</Text>
            <Text style={styles.subtitle}>Personaliza cada detalle</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>NOMBRE</Text>
            <TextInput style={styles.input} placeholder="Ej. Películas del fin de semana" placeholderTextColor="#4A4A6A" value={name} onChangeText={setName} maxLength={40} />
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>EMOJI</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {EMOJIS.map((e) => (
                <TouchableOpacity key={e} style={[styles.emojiBtn, emoji === e && styles.emojiBtnActive]} onPress={() => setEmoji(e)}>
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>OPCIONES ({options.length}/20)</Text>
            <View style={styles.optionRow}>
              <TextInput style={[styles.input, styles.optionInput]} placeholder="Escribe una opción..." placeholderTextColor="#4A4A6A" value={optionInput} onChangeText={setOptionInput} onSubmitEditing={addOption} returnKeyType="done" maxLength={30} />
              <TouchableOpacity style={styles.addBtn} onPress={addOption}>
                <LinearGradient colors={['#FF3CAC', '#784BA0']} style={styles.addBtnGrad}>
                  <Text style={styles.addBtnText}>+</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          {options.length > 0 && (
            <View style={styles.optionsList}>
              {options.map((opt, i) => (
                <View key={i} style={styles.optionItem}>
                  <View style={[styles.optionDot, { backgroundColor: NEON[i % NEON.length] }]} />
                  <Text style={styles.optionLabel} numberOfLines={1}>{opt}</Text>
                  <TouchableOpacity onPress={() => removeOption(i)} style={styles.iconBtn}>
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <GlowButton label={saving ? 'Guardando...' : '💾 Crear ruleta'} onPress={handleCreate} disabled={saving} size="md" style={{ marginTop: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0F' },
  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 32 },
  accent: { width: 40, height: 4, borderRadius: 2, marginBottom: 8 },
  title: { color: '#FFFFFF', fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#4A4A6A', fontSize: 14, marginTop: 4 },
  field: { marginBottom: 24 },
  fieldLabel: { color: '#4A4A6A', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  input: { backgroundColor: '#1E1E2E', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A3E', color: '#FFFFFF', fontSize: 15, paddingHorizontal: 16, paddingVertical: 14, flex: 1 },
  emojiBtn: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#12121A', alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 1, borderColor: '#2A2A3E' },
  emojiBtnActive: { borderColor: '#FF3CAC', backgroundColor: 'rgba(255,60,172,0.15)' },
  emojiText: { fontSize: 22 },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionInput: { flex: 1 },
  addBtn: { width: 52, height: 52, borderRadius: 12, overflow: 'hidden' },
  addBtnGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 26, fontWeight: '300' },
  optionsList: { backgroundColor: '#12121A', borderRadius: 20, borderWidth: 1, borderColor: '#2A2A3E', overflow: 'hidden', marginBottom: 8 },
  optionItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#2A2A3E', gap: 8 },
  optionDot: { width: 10, height: 10, borderRadius: 5 },
  optionLabel: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  iconBtn: { padding: 4 },
  deleteIcon: { fontSize: 15 },
});
