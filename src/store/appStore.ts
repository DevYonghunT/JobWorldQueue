import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HallType, Course } from '../data/types';

function getInitialTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

interface AppState {
  currentTime: string;
  selectedHall: HallType;
  selectedSession: 1 | 2;
  childAge: number;
  preferredRooms: string[];
  breakInterval: number;
  breakDuration: number;
  currentCourse: Course | null;

  setCurrentTime: (time: string) => void;
  setSelectedHall: (hall: HallType) => void;
  setSelectedSession: (session: 1 | 2) => void;
  setChildAge: (age: number) => void;
  togglePreferredRoom: (roomId: string) => void;
  clearPreferredRooms: () => void;
  setBreakInterval: (interval: number) => void;
  setBreakDuration: (duration: number) => void;
  setCurrentCourse: (course: Course | null) => void;
  resetCourseSettings: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentTime: getInitialTime(),
      selectedHall: 'children',
      selectedSession: 1,
      childAge: 6,
      preferredRooms: [],
      breakInterval: 2,
      breakDuration: 10,
      currentCourse: null,

      setCurrentTime: (time) => set({ currentTime: time }),
      setSelectedHall: (hall) => set({ selectedHall: hall, preferredRooms: [] }),
      setSelectedSession: (session) => set({ selectedSession: session }),
      setChildAge: (age) => set({ childAge: age }),
      togglePreferredRoom: (roomId) => set((state) => ({
        preferredRooms: state.preferredRooms.includes(roomId)
          ? state.preferredRooms.filter(id => id !== roomId)
          : [...state.preferredRooms, roomId],
      })),
      clearPreferredRooms: () => set({ preferredRooms: [] }),
      setBreakInterval: (interval) => set({ breakInterval: interval }),
      setBreakDuration: (duration) => set({ breakDuration: duration }),
      setCurrentCourse: (course) => set({ currentCourse: course }),
      resetCourseSettings: () => set({
        preferredRooms: [],
        breakInterval: 2,
        breakDuration: 10,
        currentCourse: null,
      }),
    }),
    {
      name: 'jobworld-storage', // 로컬 스토리지에 저장될 이름
    }
  )
);
