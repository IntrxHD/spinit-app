export interface WheelOption {
  id: string;
  label: string;
  color?: string;
}

export interface Wheel {
  id: string;
  name: string;
  emoji: string;
  options: WheelOption[];
  isFavorite: boolean;
  createdAt: number;
  lastUsed?: number;
}

export interface WheelTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  options: string[];
}

export type TabRoute = 'spin' | 'templates' | 'favorites' | 'custom';
