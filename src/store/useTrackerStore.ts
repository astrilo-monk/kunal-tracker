import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProblemState {
  status: 'unsolved' | 'solved' | 'revising';
  notes: string;
  bookmarked: boolean;
  important: boolean;
}

interface TrackerStore {
  problemStates: Record<string, ProblemState>;
  markStatus: (id: string, status: ProblemState['status']) => void;
  updateNotes: (id: string, notes: string) => void;
  toggleBookmark: (id: string) => void;
  toggleImportant: (id: string) => void;
  resetProgress: () => void;
}

export const useTrackerStore = create<TrackerStore>()(
  persist(
    (set) => ({
      problemStates: {},
      markStatus: (id, status) => set((state) => ({
        problemStates: {
          ...state.problemStates,
          [id]: { ...state.problemStates[id], status, notes: state.problemStates[id]?.notes || '', bookmarked: !!state.problemStates[id]?.bookmarked, important: !!state.problemStates[id]?.important }
        }
      })),
      updateNotes: (id, notes) => set((state) => ({
        problemStates: {
          ...state.problemStates,
          [id]: { ...state.problemStates[id], notes, status: state.problemStates[id]?.status || 'unsolved', bookmarked: !!state.problemStates[id]?.bookmarked, important: !!state.problemStates[id]?.important }
        }
      })),
      toggleBookmark: (id) => set((state) => ({
        problemStates: {
          ...state.problemStates,
          [id]: { ...state.problemStates[id], bookmarked: !state.problemStates[id]?.bookmarked, status: state.problemStates[id]?.status || 'unsolved', notes: state.problemStates[id]?.notes || '', important: !!state.problemStates[id]?.important }
        }
      })),
      toggleImportant: (id) => set((state) => ({
        problemStates: {
          ...state.problemStates,
          [id]: { ...state.problemStates[id], important: !state.problemStates[id]?.important, status: state.problemStates[id]?.status || 'unsolved', notes: state.problemStates[id]?.notes || '', bookmarked: !!state.problemStates[id]?.bookmarked }
        }
      })),
      resetProgress: () => set({ problemStates: {} })
    }),
    {
      name: 'dsa-tracker-storage', // key in local storage
    }
  )
);
