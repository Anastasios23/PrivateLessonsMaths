import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  Tutor,
  Student,
  Session,
  Homework,
  ProgressNote,
  Assessment,
} from "../types";
import { api } from "../services/api";
import { studentsService } from "../services/studentsService";
import { sessionsService } from "../services/sessionsService";
import { homeworkService } from "../services/homeworkService";
import { assessmentsService } from "../services/assessmentsService";
// Fix: Import MOCK_STUDENTS to resolve reference error.
import { MOCK_STUDENTS } from "../constants";

interface AppContextType {
  user: Tutor | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  loading: boolean;
  students: Student[];
  sessions: Session[];
  homework: Homework[];
  assessments: Assessment[];
  progressNotes: ProgressNote[];
  fetchData: () => void;
  updateHomework: (homework: Homework) => Promise<void>;
  createHomework: (
    homeworkData: Omit<Homework, "id" | "createdAt">
  ) => Promise<Homework>;
  createStudent: (
    studentData: Omit<Student, "id" | "createdAt">
  ) => Promise<Student>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  createSession: (
    sessionData: Omit<Session, "id" | "createdAt">
  ) => Promise<Session>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  createAssessment: (
    assessmentData: Omit<Assessment, "id" | "createdAt">
  ) => Promise<Assessment>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Tutor | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([]);

  const login = (email: string, pass: string) => {
    // Mock login
    console.log(`Login attempt: ${email}, ${pass}`);
    const mockUser: Tutor = {
      id: "tutor1",
      name: "John Doe",
      email: "john.doe@tutortrack.com",
    };
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
      const [
        studentsData,
        sessionsData,
        homeworkData,
        progressNotesData,
        assessmentsData,
      ] = await Promise.all([
        api.getStudents(),
        api.getSessions(),
        api.getHomework(),
        // A bit of a hack for mock, normally you'd fetch all progress notes for the tutor
        Promise.all(
          MOCK_STUDENTS.map((s) => api.getProgressNotesByStudentId(s.id))
        ).then((notes) => notes.flat()),
        assessmentsService.getAllAssessments(),
      ]);
      setStudents(studentsData);
      setSessions(sessionsData);
      setHomework(homeworkData);
      setProgressNotes(progressNotesData);
      setAssessments(assessmentsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHomework = async (updatedHomework: Homework) => {
    try {
      await api.updateHomework(updatedHomework);
      setHomework((prevHomework) =>
        prevHomework.map((h) =>
          h.id === updatedHomework.id ? updatedHomework : h
        )
      );
    } catch (error) {
      console.error("Failed to update homework", error);
      // Optionally, handle the error in the UI
    }
  };

  const createStudent = async (
    studentData: Omit<Student, "id" | "createdAt">
  ) => {
    try {
      const newStudent = await studentsService.createStudent(studentData);
      setStudents((prevStudents) => [...prevStudents, newStudent]);
      return newStudent;
    } catch (error) {
      console.error("Failed to create student", error);
      throw error;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const updatedStudent = await studentsService.updateStudent(id, updates);
      if (updatedStudent) {
        setStudents((prevStudents) =>
          prevStudents.map((s) => (s.id === id ? updatedStudent : s))
        );
      }
    } catch (error) {
      console.error("Failed to update student", error);
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await studentsService.deleteStudent(id);
      setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete student", error);
      throw error;
    }
  };

  const createSession = async (
    sessionData: Omit<Session, "id" | "createdAt">
  ) => {
    try {
      const newSession = await sessionsService.createSession(sessionData);
      setSessions((prevSessions) => [...prevSessions, newSession]);
      return newSession;
    } catch (error) {
      console.error("Failed to create session", error);
      throw error;
    }
  };

  const updateSession = async (id: string, updates: Partial<Session>) => {
    try {
      const updatedSession = await sessionsService.updateSession(id, updates);
      if (updatedSession) {
        setSessions((prevSessions) =>
          prevSessions.map((s) => (s.id === id ? updatedSession : s))
        );
      }
    } catch (error) {
      console.error("Failed to update session", error);
      throw error;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await sessionsService.deleteSession(id);
      setSessions((prevSessions) => prevSessions.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete session", error);
      throw error;
    }
  };

  const createHomework = async (
    homeworkData: Omit<Homework, "id" | "createdAt">
  ) => {
    try {
      const newHomework = await homeworkService.createHomework(homeworkData);
      setHomework((prevHomework) => [...prevHomework, newHomework]);
      return newHomework;
    } catch (error) {
      console.error("Failed to create homework", error);
      throw error;
    }
  };

  const createAssessment = async (
    assessmentData: Omit<Assessment, "id" | "createdAt">
  ) => {
    try {
      const newAssessment = await assessmentsService.createAssessment(
        assessmentData
      );
      setAssessments((prevAssessments) => [...prevAssessments, newAssessment]);
      return newAssessment;
    } catch (error) {
      console.error("Failed to create assessment", error);
      throw error;
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
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        students,
        sessions,
        homework,
        assessments,
        progressNotes,
        fetchData,
        updateHomework,
        createHomework,
        createStudent,
        updateStudent,
        deleteStudent,
        createSession,
        updateSession,
        deleteSession,
        createAssessment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
