import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text style={styles.iconEmoji}>{emoji}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FF3CAC',
        tabBarInactiveTintColor: '#4A4A6A',
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Girar', tabBarIcon: ({ focused }) => <TabIcon emoji="🎡" focused={focused} /> }} />
      <Tabs.Screen name="templates" options={{ title: 'Plantillas', tabBarIcon: ({ focused }) => <TabIcon emoji="✨" focused={focused} /> }} />
      <Tabs.Screen name="custom" options={{ title: 'Crear', tabBarIcon: ({ focused }) => <TabIcon emoji="➕" focused={focused} /> }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favoritas', tabBarIcon: ({ focused }) => <TabIcon emoji="❤️" focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#12121A',
    borderTopColor: '#2A2A3E',
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
  iconWrap: { padding: 4, borderRadius: 12 },
  iconWrapActive: { backgroundColor: 'rgba(255,60,172,0.15)' },
  iconEmoji: { fontSize: 22 },
});
