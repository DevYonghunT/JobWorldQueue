import type { ExperienceRoom, DurationType } from '../data/types';
import { schedules } from '../data/schedules';
import { timeToMinutes } from './time';

export function getNextAvailableTime(room: ExperienceRoom, currentTime: string, session: 1 | 2): string | null {
  const schedule = schedules[room.duration as DurationType];
  if (!schedule) return null;
  const times = session === 1 ? schedule.times1 : schedule.times2;
  const currentMins = timeToMinutes(currentTime);
  for (const time of times) {
    if (timeToMinutes(time) >= currentMins) return time;
  }
  return null;
}

export function getAvailableRooms(rooms: ExperienceRoom[], currentTime: string, session: 1 | 2): Array<ExperienceRoom & { nextTime: string }> {
  return rooms
    .map(room => {
      const nextTime = getNextAvailableTime(room, currentTime, session);
      return nextTime ? { ...room, nextTime } : null;
    })
    .filter((r): r is ExperienceRoom & { nextTime: string } => r !== null)
    .sort((a, b) => timeToMinutes(a.nextTime) - timeToMinutes(b.nextTime));
}

export function getRoomsByDuration(rooms: ExperienceRoom[]): Map<DurationType, ExperienceRoom[]> {
  const map = new Map<DurationType, ExperienceRoom[]>();
  for (const room of rooms) {
    const dur = room.duration as DurationType;
    if (!map.has(dur)) map.set(dur, []);
    map.get(dur)!.push(room);
  }
  return new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
}
