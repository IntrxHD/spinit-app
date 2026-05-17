import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { TEMPLATES } from '@/constants/templates';
import { useWheels } from '@/hooks/useWheels';
import GlowButton from '@/components/GlowButton';

export default function TemplatesScreen() {
  const { createFromTemplate } = useWheels();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUse = async (idx: number) => {
    const t = TEMPLATES[idx];
    setLoading(t.id);
    await createFromTemplate(t.id, t.name, t.emoji, t.options);
    setLoading(null);
    Alert.alert('✅ Ruleta creada', `"${t.name}" fue añadida. Ve a la pestaña Girar para usarla.`,
