import { Session, SessionType } from "../types";

const SESSIONS_STORAGE_KEY = "tutortrack_sessions";

export const sessionsService = {
  /**
   * Get all sessions for a specific student
   * Returns sessions sorted by date (most recent first)
   */
  getSessionsByStudent: (studentId: string): Promise<Session[]> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const sessions: Session[] = data ? JSON.parse(data) : [];
        const studentSessions = sessions
          .filter((s) => s.studentId === studentId)
          .sort((a, b) => {
            // Sort by date descending (most recent first)
            const dateA = new Date(a.date + "T" + a.startTime);
            const dateB = new Date(b.date + "T" + b.startTime);
            return dateB.getTime() - dateA.getTime();
          });
        resolve(studentSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        resolve([]);
      }
    });
  },

  /**
   * Get all sessions (across all students)
   */
  getAllSessions: (): Promise<Session[]> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const sessions: Session[] = data ? JSON.parse(data) : [];
        resolve(sessions);
      } catch (error) {
        console.error("Error fetching all sessions:", error);
        resolve([]);
      }
    });
  },

  /**
   * Get a single session by ID
   */
  getSessionById: (id: string): Promise<Session | undefined> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const sessions: Session[] = data ? JSON.parse(data) : [];
        const session = sessions.find((s) => s.id === id);
        resolve(session);
      } catch (error) {
        console.error("Error fetching session:", error);
        resolve(undefined);
      }
    });
  },

  /**
   * Create a new session
   */
  createSession: (
    session: Omit<Session, "id" | "createdAt">
  ): Promise<Session> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const sessions: Session[] = data ? JSON.parse(data) : [];

        const newSession: Session = {
          ...session,
          id: `session_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        sessions.push(newSession);
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
        resolve(newSession);
      } catch (error) {
        console.error("Error creating session:", error);
        reject(error);
      }
    });
  },

  /**
   * Update an existing session
   */
  updateSession: (
    id: string,
    updates: Partial<Session>
  ): Promise<Session | undefined> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const sessions: Session[] = data ? JSON.parse(data) : [];

        const index = sessions.findIndex((s) => s.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }

        sessions[index] = {
          ...sessions[index],
          ...updates,
          id: sessions[index].id, // preserve original id
          createdAt: sessions[index].createdAt, // preserve original createdAt
        };

        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
        resolve(sessions[index]);
      } catch (error) {
        console.error("Error updating session:", error);
        reject(error);
      }
    });
  },

  /**
   * Delete a session
   */
  deleteSession: (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const sessions: Session[] = data ? JSON.parse(data) : [];

        const initialLength = sessions.length;
        const filtered = sessions.filter((s) => s.id !== id);

        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
        resolve(filtered.length < initialLength);
      } catch (error) {
        console.error("Error deleting session:", error);
        reject(error);
      }
    });
  },
};
