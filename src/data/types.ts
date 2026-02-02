export type HallType = 'children' | 'youth' | 'future' | 'skills' | 'career' | 'makers';
export type FloorType = 'M' | '3' | '2' | '1';
export type DurationType = 15 | 20 | 25 | 30 | 35 | 40;
export type InterestCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface ExperienceRoom {
  id: string;
  name: string;
  hall: HallType;
  floor: FloorType;
  mapNumber: number;
  duration: DurationType;
  minAge: number; // months
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

export interface HallInfo {
  id: HallType;
  name: string;
  nameEn: string;
  color: string;
  icon: string;
  ageRange: string;
  roomCount: string;
  session1: { start: string; end: string };
  session2: { start: string; end: string };
}

export interface CourseItem {
  roomId: string;
  room?: ExperienceRoom;
  startTime: string;
  endTime: string;
  type: 'experience' | 'break';
}

export interface Course {
  id: string;
  createdAt: Date;
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
