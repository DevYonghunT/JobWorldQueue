import type { ExperienceRoom, CourseItem, Course, DurationType, ExperienceCourseItem, BreakCourseItem } from '../data/types';
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

// Pre-compute schedule times in minutes for performance
function getScheduleTimesInMinutes(duration: DurationType, session: 1 | 2): number[] {
  const schedule = schedules[duration];
  if (!schedule) return [];
  const times = session === 1 ? schedule.times1 : schedule.times2;
  return times.map(timeToMinutes);
}

// Calculate room score (lower is better): waitTime - bonuses for preferred/popular
function calculateRoomScore(
  waitTime: number,
  isPreferred: boolean,
  isPopular: boolean
): number {
  let score = waitTime;
  if (isPreferred) score -= COURSE_GENERATION.PREFERRED_BONUS;
  if (isPopular) score -= COURSE_GENERATION.POPULAR_BONUS;
  return score;
}

export function generateCourse(options: CourseOptions): Course {
  const { currentTime, session, preferredRooms, breakInterval, breakDuration, rooms } = options;
  const items: CourseItem[] = [];
  const usedRoomIds = new Set<string>();
  let lastEndMinutes = timeToMinutes(currentTime);
  let experienceCount = 0;
  const endTime = timeToMinutes(SESSION_TIMES[session].end);

  // Pre-compute schedule times in minutes for each duration type
  const scheduleCache = new Map<DurationType, number[]>();
  for (const room of rooms) {
    const dur = room.duration as DurationType;
    if (!scheduleCache.has(dur)) {
      scheduleCache.set(dur, getScheduleTimesInMinutes(dur, session));
    }
  }

  // [P2 fix] Changed < to <= to include exactly MIN_REMAINING_TIME case
  for (let iteration = 0; iteration < COURSE_GENERATION.MAX_ITERATIONS && lastEndMinutes <= endTime - COURSE_GENERATION.MIN_REMAINING_TIME; iteration++) {
    // Check if break is due
    if (breakInterval > 0 && experienceCount > 0 && experienceCount % breakInterval === 0) {
      const breakEnd = lastEndMinutes + breakDuration;
      if (breakEnd >= endTime) break;

      // [P2 fix] Before adding break, verify at least one room is available after break
      const hasNextExperience = rooms.some(room => {
        if (usedRoomIds.has(room.id)) return false;
        const timesInMins = scheduleCache.get(room.duration as DurationType) || [];
        return timesInMins.some(startMins =>
          startMins >= breakEnd && startMins + room.duration <= endTime
        );
      });

      if (!hasNextExperience) break; // Don't add break if no experience can follow

      const breakItem: BreakCourseItem = {
        roomId: 'break',
        startTime: minutesToTime(lastEndMinutes),
        endTime: minutesToTime(breakEnd),
        type: 'break',
      };
      items.push(breakItem);
      lastEndMinutes = breakEnd;
    }

    let bestRoom: ExperienceRoom | null = null;
    let bestStartTime = '';
    let bestStartMins = 0;
    let bestScore = Infinity;

    // [P3 fix] Use weighted score instead of just waitTime
    for (const room of rooms) {
      if (usedRoomIds.has(room.id)) continue;
      const timesInMins = scheduleCache.get(room.duration as DurationType);
      if (!timesInMins) continue;

      for (const startMins of timesInMins) {
        if (startMins < lastEndMinutes) continue;
        if (startMins + room.duration > endTime) continue;

        const waitTime = startMins - lastEndMinutes;
        const isPreferred = preferredRooms.includes(room.id);
        const score = calculateRoomScore(waitTime, isPreferred, room.isPopular ?? false);

        if (score < bestScore) {
          bestScore = score;
          bestRoom = room;
          bestStartMins = startMins;
          bestStartTime = minutesToTime(startMins);
        }
        break; // Only consider first available time for each room
      }
    }

    if (!bestRoom || !bestStartTime) break;

    const roomEndMins = bestStartMins + bestRoom.duration;

    const experienceItem: ExperienceCourseItem = {
      roomId: bestRoom.id,
      room: bestRoom,
      startTime: bestStartTime,
      endTime: minutesToTime(roomEndMins),
      type: 'experience',
    };
    items.push(experienceItem);

    usedRoomIds.add(bestRoom.id);
    lastEndMinutes = roomEndMins;
    experienceCount++;
  }

  // [P2 fix] Remove trailing break if exists (edge case safety)
  if (items.length > 0 && items[items.length - 1].type === 'break') {
    items.pop();
  }

  const experiences = items.filter((i): i is ExperienceCourseItem => i.type === 'experience');
  return {
    id: Date.now().toString(),
    createdAt: Date.now(),
    items,
    totalExperiences: experiences.length,
    totalJoy: experiences.reduce((sum, i) => sum + i.room.joyCurrency, 0),
    totalDuration: items.reduce((sum, i) => {
      return sum + (timeToMinutes(i.endTime) - timeToMinutes(i.startTime));
    }, 0),
  };
}
