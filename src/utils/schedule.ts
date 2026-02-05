import type { ExperienceRoom, DurationType } from '../data/types';
import { schedules } from '../data/schedules';
import { timeToMinutes } from './time';

// Cache for pre-computed schedule times in minutes
const scheduleMinutesCache = new Map<string, number[]>();

function getScheduleMinutes(duration: DurationType, session: 1 | 2): number[] {
  const cacheKey = `${duration}-${session}`;
  const cached = scheduleMinutesCache.get(cacheKey);
  if (cached) return cached;

  const schedule = schedules[duration];
  if (!schedule) return [];
  const times = session === 1 ? schedule.times1 : schedule.times2;
  const minutes = times.map(timeToMinutes);
  scheduleMinutesCache.set(cacheKey, minutes);
  return minutes;
}

export function getNextAvailableTime(room: ExperienceRoom, currentTime: string, session: 1 | 2): string | null {
  const schedule = schedules[room.duration as DurationType];
  if (!schedule) return null;

  const times = session === 1 ? schedule.times1 : schedule.times2;
  const timesInMins = getScheduleMinutes(room.duration as DurationType, session);
  const currentMins = timeToMinutes(currentTime);

  for (let i = 0; i < timesInMins.length; i++) {
    if (timesInMins[i] >= currentMins) return times[i];
  }
  return null;
}

export function getAvailableRooms(rooms: ExperienceRoom[], currentTime: string, session: 1 | 2): Array<ExperienceRoom & { nextTime: string; nextTimeMins: number }> {
  const currentMins = timeToMinutes(currentTime);

  return rooms
    .map(room => {
      const schedule = schedules[room.duration as DurationType];
      if (!schedule) return null;

      const times = session === 1 ? schedule.times1 : schedule.times2;
      const timesInMins = getScheduleMinutes(room.duration as DurationType, session);

      for (let i = 0; i < timesInMins.length; i++) {
        if (timesInMins[i] >= currentMins) {
          return { ...room, nextTime: times[i], nextTimeMins: timesInMins[i] };
        }
      }
      return null;
    })
    .filter((r): r is ExperienceRoom & { nextTime: string; nextTimeMins: number } => r !== null)
    .sort((a, b) => a.nextTimeMins - b.nextTimeMins);
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
