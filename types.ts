
export interface Tutor {
  id: string;
  name: string;
  email: string;
}

export interface Student {
  id: string;
  tutorId: string;
  name: string;
  contactInfo: string;
  subject: string;
  level: string;
  notes: string;
  startDate: string; 
  createdAt: string;
}

export enum SessionStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Missed = 'Missed',
}

export interface Session {
  id: string;
  studentId: string;
  dateTime: string;
  durationMinutes: number;
  status: SessionStatus;
  topicsCovered: string;
  notes: string;
}

export enum HomeworkStatus {
  Pending = 'Pending',
  Submitted = 'Submitted',
  Checked = 'Checked',
}

export interface Homework {
  id: string;
  studentId: string;
  sessionId?: string;
  description: string;
  dueDate: string;
  status: HomeworkStatus;
  notes: string;
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
