import type { ExperienceRoom, CourseItem, Course, DurationType } from '../data/types';
import { schedules } from '../data/schedules';
import { SESSION_TIMES, COURSE_GENERATION } from '../data/constants';
import { timeToMinutes, minutesToTime } from './time';

interface CourseOptions {
  currentTime: string;
  session: 1 | 2;
  preferredRooms: string[];
  breakInterval: number;
  breakDuration: number;
  rooms: ExperienceRoom[];
}

export function generateCourse(options: CourseOptions): Course {
  const { currentTime, session, preferredRooms, breakInterval, breakDuration, rooms } = options;
  const items: CourseItem[] = [];
  const usedRoomIds = new Set<string>();
  let lastEndMinutes = timeToMinutes(currentTime);
  let experienceCount = 0;
  const endTime = timeToMinutes(SESSION_TIMES[session].end);

  const sortedRooms = [...rooms].sort((a, b) => {
    const aPreferred = preferredRooms.includes(a.id) ? 0 : 1;
    const bPreferred = preferredRooms.includes(b.id) ? 0 : 1;
    if (aPreferred !== bPreferred) return aPreferred - bPreferred;
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    return 0;
  });

  for (let iteration = 0; iteration < COURSE_GENERATION.MAX_ITERATIONS && lastEndMinutes < endTime - COURSE_GENERATION.MIN_REMAINING_TIME; iteration++) {
    if (breakInterval > 0 && experienceCount > 0 && experienceCount % breakInterval === 0) {
      const breakEnd = lastEndMinutes + breakDuration;
      if (breakEnd >= endTime) break;
      items.push({
        roomId: 'break',
        startTime: minutesToTime(lastEndMinutes),
        endTime: minutesToTime(breakEnd),
        type: 'break',
      });
      lastEndMinutes = breakEnd;
    }

    let bestRoom: ExperienceRoom | null = null;
    let bestStartTime = '';
    let bestWaitTime = Infinity;

    for (const room of sortedRooms) {
      if (usedRoomIds.has(room.id)) continue;
      const schedule = schedules[room.duration as DurationType];
      if (!schedule) continue;
      const times = session === 1 ? schedule.times1 : schedule.times2;

      for (const time of times) {
        const startMins = timeToMinutes(time);
        if (startMins < lastEndMinutes) continue;
        if (startMins + room.duration > endTime) continue;

        const waitTime = startMins - lastEndMinutes;
        if (waitTime < bestWaitTime) {
          bestWaitTime = waitTime;
          bestRoom = room;
          bestStartTime = time;
        }
        break;
      }
    }

    if (!bestRoom || !bestStartTime) break;

    const startMins = timeToMinutes(bestStartTime);
    const roomEndMins = startMins + bestRoom.duration;

    items.push({
      roomId: bestRoom.id,
      room: bestRoom,
      startTime: bestStartTime,
      endTime: minutesToTime(roomEndMins),
      type: 'experience',
    });

    usedRoomIds.add(bestRoom.id);
    lastEndMinutes = roomEndMins;
    experienceCount++;
  }

  const experiences = items.filter(i => i.type === 'experience');
  return {
    id: Date.now().toString(),
    createdAt: new Date(),
    items,
    totalExperiences: experiences.length,
    totalJoy: experiences.reduce((sum, i) => sum + (i.room?.joyCurrency || 0), 0),
    totalDuration: items.reduce((sum, i) => {
      return sum + (timeToMinutes(i.endTime) - timeToMinutes(i.startTime));
    }, 0),
  };
}
