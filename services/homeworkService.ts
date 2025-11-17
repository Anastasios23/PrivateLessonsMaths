import { Homework, HomeworkStatus } from "../types";

const HOMEWORK_STORAGE_KEY = "tutortrack_homework";

export const homeworkService = {
  /**
   * Get all homework for a specific student
   * Returns homework sorted by due date (most recent first)
   */
  getHomeworkByStudent: (studentId: string): Promise<Homework[]> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(HOMEWORK_STORAGE_KEY);
        const homework: Homework[] = data ? JSON.parse(data) : [];
        const studentHomework = homework
          .filter((h) => h.studentId === studentId)
          .sort((a, b) => {
            return (
              new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
            );
          });
        resolve(studentHomework);
      } catch (error) {
        console.error("Error fetching homework:", error);
        resolve([]);
      }
    });
  },

  /**
   * Get all homework across all students
   */
  getAllHomework: (): Promise<Homework[]> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(HOMEWORK_STORAGE_KEY);
        const homework: Homework[] = data ? JSON.parse(data) : [];
        resolve(homework);
      } catch (error) {
        console.error("Error fetching all homework:", error);
        resolve([]);
      }
    });
  },

  /**
   * Get a single homework item by ID
   */
  getHomeworkById: (id: string): Promise<Homework | undefined> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(HOMEWORK_STORAGE_KEY);
        const homework: Homework[] = data ? JSON.parse(data) : [];
        const item = homework.find((h) => h.id === id);
        resolve(item);
      } catch (error) {
        console.error("Error fetching homework:", error);
        resolve(undefined);
      }
    });
  },

  /**
   * Create new homework
   */
  createHomework: (
    homework: Omit<Homework, "id" | "createdAt">
  ): Promise<Homework> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(HOMEWORK_STORAGE_KEY);
        const homeworkList: Homework[] = data ? JSON.parse(data) : [];

        const newHomework: Homework = {
          ...homework,
          id: `hw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        homeworkList.push(newHomework);
        localStorage.setItem(
          HOMEWORK_STORAGE_KEY,
          JSON.stringify(homeworkList)
        );
        resolve(newHomework);
      } catch (error) {
        console.error("Error creating homework:", error);
        reject(error);
      }
    });
  },

  /**
   * Update homework (e.g., change status or score)
   */
  updateHomework: (
    id: string,
    updates: Partial<Homework>
  ): Promise<Homework | undefined> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(HOMEWORK_STORAGE_KEY);
        const homeworkList: Homework[] = data ? JSON.parse(data) : [];

        const index = homeworkList.findIndex((h) => h.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }

        homeworkList[index] = {
          ...homeworkList[index],
          ...updates,
          id: homeworkList[index].id, // preserve original id
          createdAt: homeworkList[index].createdAt, // preserve original createdAt
        };

        localStorage.setItem(
          HOMEWORK_STORAGE_KEY,
          JSON.stringify(homeworkList)
        );
        resolve(homeworkList[index]);
      } catch (error) {
        console.error("Error updating homework:", error);
        reject(error);
      }
    });
  },

  /**
   * Update homework status (assigned → submitted → checked)
   */
  updateHomeworkStatus: (
    id: string,
    status: HomeworkStatus
  ): Promise<Homework | undefined> => {
    return homeworkService.updateHomework(id, { status });
  },

  /**
   * Delete homework
   */
  deleteHomework: (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(HOMEWORK_STORAGE_KEY);
        const homeworkList: Homework[] = data ? JSON.parse(data) : [];

        const initialLength = homeworkList.length;
        const filtered = homeworkList.filter((h) => h.id !== id);

        localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(filtered));
        resolve(filtered.length < initialLength);
      } catch (error) {
        console.error("Error deleting homework:", error);
        reject(error);
      }
    });
  },
};
