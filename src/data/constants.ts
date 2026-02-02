// Session time constants
export const SESSION_TIMES = {
  1: { start: '09:30', end: '13:30' },
  2: { start: '14:30', end: '18:30' },
} as const;

// Course generation constants
export const COURSE_GENERATION = {
  MAX_ITERATIONS: 20,
  MIN_REMAINING_TIME: 15, // minimum minutes before session end to consider adding new experience
} as const;

// Hall icon emoji mappings
export const HALL_ICONS: Record<string, string> = {
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
