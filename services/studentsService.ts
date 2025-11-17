import { Student } from "../types";
import { MOCK_STUDENTS } from "../constants";

const STUDENTS_STORAGE_KEY = "tutortrack_students";

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STUDENTS_STORAGE_KEY)) {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(MOCK_STUDENTS));
  }
};

const getStoredStudents = (): Student[] => {
  initializeStorage();
  const data = localStorage.getItem(STUDENTS_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveStudents = (students: Student[]) => {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
};

// Simulate API delay for consistency
const simulateDelay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 300));

export const studentsService = {
  getStudents: (): Promise<Student[]> => {
    const students = getStoredStudents();
    return simulateDelay(students);
  },

  getStudentById: (id: string): Promise<Student | undefined> => {
    const students = getStoredStudents();
    const student = students.find((s) => s.id === id);
    return simulateDelay(student);
  },

  createStudent: (
    student: Omit<Student, "id" | "createdAt">
  ): Promise<Student> => {
    const students = getStoredStudents();
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString(),
    };
    students.push(newStudent);
    saveStudents(students);
    return simulateDelay(newStudent);
  },

  updateStudent: (
    id: string,
    updates: Partial<Student>
  ): Promise<Student | undefined> => {
    const students = getStoredStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) {
      return simulateDelay(undefined);
    }
    students[index] = { ...students[index], ...updates };
    saveStudents(students);
    return simulateDelay(students[index]);
  },

  deleteStudent: (id: string): Promise<boolean> => {
    const students = getStoredStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) {
      return simulateDelay(false);
    }
    students.splice(index, 1);
    saveStudents(students);
    return simulateDelay(true);
  },
};
