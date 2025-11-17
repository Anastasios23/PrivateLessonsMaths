
import { MOCK_STUDENTS, MOCK_SESSIONS, MOCK_HOMEWORK, MOCK_PROGRESS_NOTES } from '../constants';
import { Student, Session, Homework, ProgressNote } from '../types';

const simulateDelay = <T,>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), 500));

export const api = {
  getStudents: (): Promise<Student[]> => simulateDelay(MOCK_STUDENTS),
  getStudent: (id: string): Promise<Student | undefined> =>
    simulateDelay(MOCK_STUDENTS.find(s => s.id === id)),
  
  getSessions: (): Promise<Session[]> => simulateDelay(MOCK_SESSIONS),
  getSessionsByStudentId: (studentId: string): Promise<Session[]> =>
    simulateDelay(MOCK_SESSIONS.filter(s => s.studentId === studentId)),

  getHomework: (): Promise<Homework[]> => simulateDelay(MOCK_HOMEWORK),
  getHomeworkByStudentId: (studentId: string): Promise<Homework[]> =>
    simulateDelay(MOCK_HOMEWORK.filter(h => h.studentId === studentId)),

  updateHomework: (updatedHomework: Homework): Promise<Homework> => {
    const index = MOCK_HOMEWORK.findIndex(h => h.id === updatedHomework.id);
    if (index !== -1) {
      MOCK_HOMEWORK[index] = updatedHomework;
    }
    return simulateDelay(updatedHomework);
  },

  getProgressNotesByStudentId: (studentId: string): Promise<ProgressNote[]> =>
    simulateDelay(MOCK_PROGRESS_NOTES.filter(p => p.studentId === studentId)),
};
