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

// Storage version for migration
const STORAGE_VERSION = 1;

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
      name: 'jobworld-storage',
      version: STORAGE_VERSION,
      // Exclude currentTime from persistence - always use fresh time
      partialize: (state) => ({
        selectedHall: state.selectedHall,
        selectedSession: state.selectedSession,
        childAge: state.childAge,
        preferredRooms: state.preferredRooms,
        breakInterval: state.breakInterval,
        breakDuration: state.breakDuration,
        currentCourse: state.currentCourse,
      }),
      // Migration for future schema changes
      migrate: (persistedState, version) => {
        if (version < STORAGE_VERSION) {
          // Handle migrations here when schema changes
          return persistedState as AppState;
        }
        return persistedState as AppState;
      },
      // Reset currentTime to fresh value on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.currentTime = getInitialTime();
        }
      },
    }
  )
);
