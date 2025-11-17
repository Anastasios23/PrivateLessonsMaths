export interface Tutor {
  id: string;
  name: string;
  email: string;
}

export interface ParentContact {
  name: string;
  phone: string;
  email: string;
}

export interface Student {
  id: string;
  tutorId: string;
  fullName: string;
  schoolYear: string; // e.g., "Grade 10", "Year 9"
  contactParent: ParentContact;
  goals: string[]; // e.g., ["pass June exam with ≥ 80%", "improve algebra skills"]
  subject: string;
  level: string;
  notes: string; // free text notes
  startDate: string;
  createdAt: string;
}

export enum SessionStatus {
  Scheduled = "Scheduled",
  Completed = "Completed",
  Cancelled = "Cancelled",
  Missed = "Missed",
}

export enum SessionType {
  Regular = "regular",
  ExamPrep = "exam-prep",
  TestReview = "test-review",
}

export interface Session {
  id: string;
  studentId: string;
  date: string; // ISO 8601 date (YYYY-MM-DD)
  startTime: string; // HH:MM format (e.g., "14:30")
  durationMinutes: number;
  topic: string; // e.g., "Quadratic equations – solving by factoring"
  activities: string; // short text: exercises, explanations
  homeworkGiven: boolean; // reference to Homework items
  sessionType: SessionType;
  notes: string; // additional notes
  createdAt: string;
}

export enum HomeworkStatus {
  Assigned = "assigned",
  Submitted = "submitted",
  Checked = "checked",
}

export interface Homework {
  id: string;
  studentId: string;
  sessionId?: string;
  assignedDate: string; // ISO 8601 date (YYYY-MM-DD)
  dueDate: string; // ISO 8601 date (YYYY-MM-DD)
  description: string;
  status: HomeworkStatus;
  score?: number; // optional numeric score
  notes?: string;
  submissionFile?: HomeworkSubmission; // optional file submission
  createdAt: string;
}

export interface HomeworkSubmission {
  fileName: string;
  fileSize: number; // in bytes
  fileType: string; // MIME type, e.g., "application/pdf"
  uploadDate: string; // ISO 8601 timestamp
  fileData: string; // base64 encoded file data
}

export interface Assessment {
  id: string;
  studentId: string;
  date: string; // ISO 8601 date (YYYY-MM-DD)
  description: string; // e.g., "School test – Functions"
  score: number; // numeric score achieved
  maxScore: number; // maximum possible score
  notes?: string;
  createdAt: string;
}

export interface ProgressNote {
  id: string;
  studentId: string;
  date: string;
  summary: string;
  strengths: string;
  weaknesses: string;
  nextSteps: string;
}
