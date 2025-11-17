import { Assessment } from "../types";

const ASSESSMENTS_STORAGE_KEY = "tutortrack_assessments";

export const assessmentsService = {
  /**
   * Get all assessments for a specific student
   * Returns assessments sorted by date (most recent first)
   */
  getAssessmentsByStudent: (studentId: string): Promise<Assessment[]> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
        const assessments: Assessment[] = data ? JSON.parse(data) : [];
        const studentAssessments = assessments
          .filter((a) => a.studentId === studentId)
          .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
        resolve(studentAssessments);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        resolve([]);
      }
    });
  },

  /**
   * Get all assessments across all students
   */
  getAllAssessments: (): Promise<Assessment[]> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
        const assessments: Assessment[] = data ? JSON.parse(data) : [];
        resolve(assessments);
      } catch (error) {
        console.error("Error fetching all assessments:", error);
        resolve([]);
      }
    });
  },

  /**
   * Get a single assessment by ID
   */
  getAssessmentById: (id: string): Promise<Assessment | undefined> => {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
        const assessments: Assessment[] = data ? JSON.parse(data) : [];
        const assessment = assessments.find((a) => a.id === id);
        resolve(assessment);
      } catch (error) {
        console.error("Error fetching assessment:", error);
        resolve(undefined);
      }
    });
  },

  /**
   * Create new assessment
   */
  createAssessment: (
    assessment: Omit<Assessment, "id" | "createdAt">
  ): Promise<Assessment> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
        const assessmentsList: Assessment[] = data ? JSON.parse(data) : [];

        const newAssessment: Assessment = {
          ...assessment,
          id: `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        assessmentsList.push(newAssessment);
        localStorage.setItem(
          ASSESSMENTS_STORAGE_KEY,
          JSON.stringify(assessmentsList)
        );
        resolve(newAssessment);
      } catch (error) {
        console.error("Error creating assessment:", error);
        reject(error);
      }
    });
  },

  /**
   * Update assessment
   */
  updateAssessment: (
    id: string,
    updates: Partial<Assessment>
  ): Promise<Assessment | undefined> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
        const assessmentsList: Assessment[] = data ? JSON.parse(data) : [];

        const index = assessmentsList.findIndex((a) => a.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }

        assessmentsList[index] = {
          ...assessmentsList[index],
          ...updates,
          id: assessmentsList[index].id, // preserve original id
          createdAt: assessmentsList[index].createdAt, // preserve original createdAt
        };

        localStorage.setItem(
          ASSESSMENTS_STORAGE_KEY,
          JSON.stringify(assessmentsList)
        );
        resolve(assessmentsList[index]);
      } catch (error) {
        console.error("Error updating assessment:", error);
        reject(error);
      }
    });
  },

  /**
   * Delete assessment
   */
  deleteAssessment: (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
        const assessmentsList: Assessment[] = data ? JSON.parse(data) : [];

        const initialLength = assessmentsList.length;
        const filtered = assessmentsList.filter((a) => a.id !== id);

        localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(filtered));
        resolve(filtered.length < initialLength);
      } catch (error) {
        console.error("Error deleting assessment:", error);
        reject(error);
      }
    });
  },
};
