import type { HallIconType } from './types';

// Session time constants (single source of truth)
export const SESSION_TIMES = {
  1: { start: '09:30', end: '13:30' },
  2: { start: '14:30', end: '18:30' },
} as const;

// Course generation constants
export const COURSE_GENERATION = {
  MAX_ITERATIONS: 20,
  MIN_REMAINING_TIME: 15, // minimum minutes before session end to consider adding new experience
  PREFERRED_BONUS: 30, // minutes bonus for preferred rooms (reduces effective wait time)
  POPULAR_BONUS: 15, // minutes bonus for popular rooms
} as const;

// Hall icon emoji mappings with type safety
export const HALL_ICONS: Record<HallIconType, string> = {
  baby: '👶',
  'graduation-cap': '🎓',
  rocket: '🚀',
  wrench: '🔧',
  compass: '🧭',
  blocks: '🧱',
};

// Theme colors (matching halls.ts colors)
export const HALL_COLORS = {
  children: '#F5A623',
  youth: '#4A90D9',
  future: '#1E3A5F',
  skills: '#2E7D32',
  career: '#E91E63',
  makers: '#9C27B0',
} as const;
