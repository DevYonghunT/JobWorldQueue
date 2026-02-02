import { SESSION_TIMES } from '../data/constants';

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatTimeDisplay(time: string): string {
  const mins = timeToMinutes(time);
  const h = Math.floor(mins / 60);
  return h < 12 ? `오전 ${time}` : h === 12 ? `오후 ${time}` : `오후 ${(h - 12).toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}`;
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
