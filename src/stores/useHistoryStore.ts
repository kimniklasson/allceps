import { create } from "zustand";
import type { WorkoutSession } from "../types/models";
import { sessionRepository } from "../data/repositories/sessionRepository";
import { groupSessionsByMonth } from "../utils/groupByMonth";

export interface MonthGroup {
  label: string;
  sessions: WorkoutSession[];
}

interface HistoryState {
  sessions: WorkoutSession[];
  loadSessions: () => void;
  getGroupedByMonth: () => MonthGroup[];
  getSessionById: (id: string) => WorkoutSession | undefined;
  deleteSession: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>()((set, get) => ({
  sessions: [],

  loadSessions: () => {
    const all = sessionRepository.getAll().filter((s) => s.status === "completed");
    set({ sessions: all });
  },

  getGroupedByMonth: () => {
    return groupSessionsByMonth(get().sessions);
  },

  getSessionById: (id) => {
    return get().sessions.find((s) => s.id === id);
  },

  deleteSession: (id) => {
    sessionRepository.delete(id);
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    }));
  },
}));
