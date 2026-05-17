import { useCallback, useMemo } from 'react';
import { useStorage } from './useStorage';
import { Wheel, WheelOption } from '@/types';

const STORAGE_KEY = 'spinit_wheels_v1';

const NEON = ['#FF3CAC','#FF6B35','#FFD23F','#3BF4FB','#A855F7','#22D3EE','#F59E0B','#10B981','#EC4899','#6366F1'];

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function makeOptions(labels: string[]): WheelOption[] {
  return labels.map((label, i) => ({
    id: generateId(),
    label,
    color: NEON[i % NEON.length],
  }));
}

export function useWheels() {
  const { value: wheels, save, loading } = useStorage<Wheel[]>(STORAGE_KEY, []);

  const saveWheel = useCallback(async (wheel: Wheel) => {
    const exists = wheels.findIndex((w) => w.id === wheel.id);
    const next = exists >= 0 ? wheels.map((w) => (w.id === wheel.id ? wheel : w)) : [wheel, ...wheels];
    await save(next);
  }, [wheels, save]);

  const deleteWheel = useCallback(async (id: string) => {
    await save(wheels.filter((w) => w.id !== id));
  }, [wheels, save]);

  const toggleFavorite = useCallback(async (id: string) => {
    await save(wheels.map((w) => w.id === id ? { ...w, isFavorite: !w.isFavorite } : w));
  }, [wheels, save]);

  const createFromTemplate = useCallback(async (templateId: string, name: string, emoji: string, labels: string[]) => {
    const wheel: Wheel = {
      id: generateId(),
      name,
      emoji,
      options: makeOptions(labels),
      isFavorite: false,
      createdAt: Date.now(),
    };
    await save([wheel, ...wheels]);
    return wheel;
  }, [wheels, save]);

  const createCustomWheel = useCallback(async (name: string, emoji: string, labels: string[]) => {
    const wheel: Wheel = {
      id: generateId(),
      name,
      emoji,
      options: makeOptions(labels),
      isFavorite: false,
      createdAt: Date.now(),
    };
    await save([wheel, ...wheels]);
    return wheel;
  }, [wheels, save]);

  const updateWheelOptions = useCallback(async (wheelId: string, options: WheelOption[]) => {
    await save(wheels.map((w) => (w.id === wheelId ? { ...w, options } : w)));
  }, [wheels, save]);

  const markUsed = useCallback(async (id: string) => {
    await save(wheels.map((w) => w.id === id ? { ...w, lastUsed: Date.now() } : w));
  }, [wheels, save]);

  const favorites = useMemo(() => wheels.filter((w) => w.isFavorite), [wheels]);
  const recent = useMemo(() => [...wheels].sort((a, b) => (b.lastUsed ?? 0) - (a.lastUsed ?? 0)).slice(0, 5), [wheels]);

  return {
    wheels, favorites, recent, loading,
    saveWheel, deleteWheel, toggleFavorite,
    createFromTemplate, createCustomWheel,
    updateWheelOptions, markUsed, makeOptions,
  };
}
