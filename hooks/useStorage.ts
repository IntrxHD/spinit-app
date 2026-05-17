import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw !== null) {
          setValue(JSON.parse(raw));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [key]);

  const save = useCallback(
    async (next: T) => {
      setValue(next);
      await AsyncStorage.setItem(key, JSON.stringify(next));
    },
    [key]
  );

  return { value, save, loading };
}
