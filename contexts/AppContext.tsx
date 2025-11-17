
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Tutor, Student, Session, Homework, ProgressNote } from '../types';
import { api } from '../services/api';
// Fix: Import MOCK_STUDENTS to resolve reference error.
import { MOCK_STUDENTS } from '../constants';

interface AppContextType {
  user: Tutor | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  loading: boolean;
  students: Student[];
  sessions: Session[];
  homework: Homework[];
  progressNotes: ProgressNote[];
  fetchData: () => void;
  updateHomework: (homework: Homework) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<Tutor | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([]);

  const login = (email: string, pass: string) => {
    // Mock login
    console.log(`Login attempt: ${email}, ${pass}`);
    const mockUser: Tutor = { id: 'tutor1', name: 'John Doe', email: 'john.doe@tutortrack.com' };
    setUser(mockUser);
    setIsAuthenticated(true);
    fetchData();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const [studentsData, sessionsData, homeworkData, progressNotesData] = await Promise.all([
            api.getStudents(),
            api.getSessions(),
            api.getHomework(),
            // A bit of a hack for mock, normally you'd fetch all progress notes for the tutor
            Promise.all(MOCK_STUDENTS.map(s => api.getProgressNotesByStudentId(s.id))).then(notes => notes.flat())
        ]);
        setStudents(studentsData);
        setSessions(sessionsData);
        setHomework(homeworkData);
        setProgressNotes(progressNotesData);
    } catch (error) {
        console.error("Failed to fetch data", error);
    } finally {
        setLoading(false);
    }
  }, []);
  
  const updateHomework = async (updatedHomework: Homework) => {
    try {
        await api.updateHomework(updatedHomework);
        setHomework(prevHomework => 
            prevHomework.map(h => h.id === updatedHomework.id ? updatedHomework : h)
        );
    } catch (error) {
        console.error("Failed to update homework", error);
        // Optionally, handle the error in the UI
    }
  };

  // On initial load, check for a "logged in" user. 
  // Here we just mock it. In a real app, you'd check localStorage/cookies for a token.
  useEffect(() => {
    // To simulate a logged-out state initially, comment out the next 3 lines.
    // login('test@test.com', 'password');
    setLoading(false);
  }, []);

  return (
    <AppContext.Provider value={{ user, isAuthenticated, login, logout, loading, students, sessions, homework, progressNotes, fetchData, updateHomework }}>
      {children}
    </AppContext.Provider>
  );
};
