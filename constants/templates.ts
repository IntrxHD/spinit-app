import { WheelTemplate } from '@/types';

export const TEMPLATES: WheelTemplate[] = [
  {
    id: 'food',
    name: '🍕 Comida',
    emoji: '🍕',
    description: '¿Qué vamos a comer hoy?',
    options: ['Pizza', 'Sushi', 'Tacos', 'Hamburguesa', 'Pasta', 'Ramen', 'Ensalada', 'BBQ', 'Pollo', 'Mariscos'],
  },
  {
    id: 'movies',
    name: '🎬 Películas',
    emoji: '🎬',
    description: 'Escoge un género para esta noche',
    options: ['Acción', 'Comedia', 'Terror', 'Romance', 'Sci-Fi', 'Documental', 'Animación', 'Thriller', 'Drama', 'Aventura'],
  },
  {
    id: 'truth_dare',
    name: '🎭 Verdad o Reto',
    emoji: '🎭',
    description: 'El juego clásico de la noche',
    options: ['Verdad 🗣️', 'Reto 💪', 'Doble Verdad 🔥', 'Doble Reto 😈', 'Pasa el turno 🙃', 'Elige tú 👆'],
  },
  {
    id: 'destinations',
    name: '✈️ Destinos',
    emoji: '✈️',
    description: '¿A dónde viajarías?',
    options: ['París', 'Tokio', 'Nueva York', 'Bali', 'Roma', 'Cancún', 'Barcelona', 'Dubái', 'Sydney', 'Machu Picchu'],
  },
  {
    id: 'sports',
    name: '⚽ Deportes',
    emoji: '⚽',
    description: 'Elige tu actividad física',
    options: ['Fútbol', 'Baloncesto', 'Tennis', 'Natación', 'Ciclismo', 'Yoga', 'Boxeo', 'Correr', 'Volleyball', 'Skateboard'],
  },
];
