import type { WorkoutSession } from "../../types/models";
import type { SessionRepository } from "../types";
import { getItem, setItem } from "../storage";

const STORAGE_KEY = "sessions";

function loadSessions(): WorkoutSession[] {
  return getItem<WorkoutSession[]>(STORAGE_KEY) ?? [];
}

function saveSessions(sessions: WorkoutSession[]): void {
  setItem(STORAGE_KEY, sessions);
}

export const sessionRepository: SessionRepository = {
  async getAll() {
    return loadSessions().sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  },

  async getById(id: string) {
    return loadSessions().find((s) => s.id === id) ?? null;
  },

  async getActive() {
    return loadSessions().find((s) => s.status === "active") ?? null;
  },

  async save(session: WorkoutSession) {
    const sessions = loadSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    saveSessions(sessions);
  },

  async delete(id: string) {
    const sessions = loadSessions().filter((s) => s.id !== id);
    saveSessions(sessions);
  },
};
