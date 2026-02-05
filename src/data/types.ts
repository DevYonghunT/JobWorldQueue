export type HallType = 'children' | 'youth' | 'future' | 'skills' | 'career' | 'makers';
export type FloorType = 'M' | '3' | '2' | '1';
export type DurationType = 15 | 20 | 25 | 30 | 35 | 40;
export type InterestCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

// Hall icon type for type safety
export type HallIconType = 'baby' | 'graduation-cap' | 'rocket' | 'wrench' | 'compass' | 'blocks';

export interface ExperienceRoom {
  id: string;
  name: string;
  hall: HallType;
  floor: FloorType;
  mapNumber: number;
  duration: DurationType;
  minAgeMonths: number; // age in months (e.g., 48 = 4 years old)
  joyCurrency: number;
  interestType: InterestCode[];
  icon: string;
  isPopular?: boolean;
}

export interface ScheduleSlot {
  roomId: string;
  session: 1 | 2;
  startTimes: string[];
}

// HallInfo without session times (use SESSION_TIMES from constants)
export interface HallInfo {
  id: HallType;
  name: string;
  nameEn: string;
  color: string;
  icon: HallIconType;
  ageRange: string;
  roomCount: string;
}

// Discriminated union for CourseItem
export interface ExperienceCourseItem {
  roomId: string;
  room: ExperienceRoom;
  startTime: string;
  endTime: string;
  type: 'experience';
}

export interface BreakCourseItem {
  roomId: 'break';
  startTime: string;
  endTime: string;
  type: 'break';
}

export type CourseItem = ExperienceCourseItem | BreakCourseItem;

export interface Course {
  id: string;
  createdAt: number; // timestamp for serialization
  items: CourseItem[];
  totalExperiences: number;
  totalJoy: number;
  totalDuration: number;
}

export interface InterestTypeInfo {
  code: InterestCode;
  name: string;
  fullName: string;
  color: string;
  bg: string;
}
