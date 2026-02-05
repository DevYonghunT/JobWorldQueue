import { SESSION_TIMES } from '../data/constants';

// Time format regex: HH:MM
const TIME_REGEX = /^([01]?\d|2[0-3]):([0-5]\d)$/;

/**
 * Convert time string (HH:MM) to minutes since midnight
 * Returns 0 for invalid input to prevent NaN propagation
 */
export function timeToMinutes(time: string): number {
  if (!time || !TIME_REGEX.test(time)) {
    console.warn(`Invalid time format: "${time}", defaulting to 0`);
    return 0;
  }
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert minutes since midnight to time string (HH:MM)
 * Clamps to valid range [0, 1439]
 */
export function minutesToTime(mins: number): string {
  if (!Number.isFinite(mins)) {
    console.warn(`Invalid minutes: "${mins}", defaulting to 00:00`);
    return '00:00';
  }
  // Clamp to valid range (0 to 23:59)
  const clampedMins = Math.max(0, Math.min(1439, Math.floor(mins)));
  const h = Math.floor(clampedMins / 60);
  const m = clampedMins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Format time for display with AM/PM in Korean
 * Handles midnight (00:xx) as "오전 12:xx"
 */
export function formatTimeDisplay(time: string): string {
  const mins = timeToMinutes(time);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const minuteStr = m.toString().padStart(2, '0');

  if (h === 0) {
    // Midnight: 00:xx -> 오전 12:xx
    return `오전 12:${minuteStr}`;
  } else if (h < 12) {
    // Morning: 01:xx - 11:xx -> 오전 HH:MM
    return `오전 ${time}`;
  } else if (h === 12) {
    // Noon: 12:xx -> 오후 12:xx
    return `오후 ${time}`;
  } else {
    // Afternoon/Evening: 13:xx - 23:xx -> 오후 (H-12):MM
    return `오후 ${(h - 12).toString().padStart(2, '0')}:${minuteStr}`;
  }
}

export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export function getCurrentSession(currentTime: string): 1 | 2 | null {
  const mins = timeToMinutes(currentTime);
  const session1 = SESSION_TIMES[1];
  const session2 = SESSION_TIMES[2];
  if (mins >= timeToMinutes(session1.start) && mins < timeToMinutes(session1.end)) return 1;
  if (mins >= timeToMinutes(session2.start) && mins < timeToMinutes(session2.end)) return 2;
  return null;
}

export function getRemainingTime(currentTime: string, session: 1 | 2): string {
  const endTime = SESSION_TIMES[session].end;
  const remaining = timeToMinutes(endTime) - timeToMinutes(currentTime);
  if (remaining <= 0) return '0분';
  const h = Math.floor(remaining / 60);
  const m = remaining % 60;
  if (h > 0) return `${h}시간 ${m.toString().padStart(2, '0')}분`;
  return `${m}분`;
}
