
import { Student, Session, Homework, ProgressNote, SessionStatus, HomeworkStatus } from './types';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);


export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    tutorId: 'tutor1',
    name: 'Alice Johnson',
    contactInfo: 'alice.j@email.com',
    subject: 'Mathematics',
    level: 'Grade 10',
    notes: 'Struggles with algebra, but strong in geometry.',
    startDate: '2023-09-01T00:00:00.000Z',
    createdAt: '2023-08-15T00:00:00.000Z',
  },
  {
    id: '2',
    tutorId: 'tutor1',
    name: 'Ben Carter',
    contactInfo: 'ben.carter@email.com',
    subject: 'Piano',
    level: 'Beginner',
    notes: 'Very enthusiastic and practices regularly.',
    startDate: '2023-10-01T00:00:00.000Z',
    createdAt: '2023-09-20T00:00:00.000Z',
  },
  {
    id: '3',
    tutorId: 'tutor1',
    name: 'Chloe Davis',
    contactInfo: 'chloe.d@email.com',
    subject: 'French',
    level: 'Intermediate',
    notes: 'Working on conversational skills and verb conjugations.',
    startDate: '2023-05-10T00:00:00.000Z',
    createdAt: '2023-05-01T00:00:00.000Z',
  },
];

export const MOCK_SESSIONS: Session[] = [
  // Alice
  {
    id: 's1',
    studentId: '1',
    dateTime: new Date(today.setHours(16, 0, 0)).toISOString(),
    durationMinutes: 60,
    status: SessionStatus.Scheduled,
    topicsCovered: 'Review of quadratic equations.',
    notes: 'Upcoming session today.',
  },
  {
    id: 's2',
    studentId: '1',
    dateTime: new Date(new Date().setDate(today.getDate() - 7)).toISOString(),
    durationMinutes: 60,
    status: SessionStatus.Completed,
    topicsCovered: 'Introduction to trigonometry.',
    notes: 'Alice grasped the concepts well.',
  },
  // Ben
  {
    id: 's3',
    studentId: '2',
    dateTime: new Date(today.setHours(18, 0, 0)).toISOString(),
    durationMinutes: 45,
    status: SessionStatus.Scheduled,
    topicsCovered: 'Practicing C major scale.',
    notes: 'Upcoming session.',
  },
  // Chloe
  {
    id: 's4',
    studentId: '3',
    dateTime: tomorrow.toISOString(),
    durationMinutes: 60,
    status: SessionStatus.Scheduled,
    topicsCovered: 'Past tense conversation practice.',
    notes: 'Focus on irregular verbs.',
  },
];

export const MOCK_HOMEWORK: Homework[] = [
  {
    id: 'h1',
    studentId: '1',
    sessionId: 's2',
    description: 'Complete worksheet on trigonometric ratios.',
    dueDate: nextWeek.toISOString(),
    status: HomeworkStatus.Pending,
    notes: '5 questions to be completed.',
  },
  {
    id: 'h2',
    studentId: '1',
    description: 'Read chapter 5 on polynomials.',
    dueDate: yesterday.toISOString(),
    status: HomeworkStatus.Submitted,
    notes: 'Submitted via email.',
  },
  {
    id: 'h3',
    studentId: '2',
    description: 'Practice scales for 15 minutes daily.',
    dueDate: tomorrow.toISOString(),
    status: HomeworkStatus.Pending,
    notes: 'Check for consistent timing.',
  },
  {
    id: 'h4',
    studentId: '3',
    description: 'Write a short paragraph in French about your weekend.',
    dueDate: today.toISOString(),
    status: HomeworkStatus.Checked,
    notes: 'Good work, some minor grammar mistakes.',
  },
];

export const MOCK_PROGRESS_NOTES: ProgressNote[] = [
  {
    id: 'pn1',
    studentId: '1',
    date: new Date(new Date().setDate(today.getDate() - 10)).toISOString(),
    summary: 'Making steady progress in Algebra.',
    strengths: 'Strong logical reasoning and problem-solving skills.',
    weaknesses: 'Occasional calculation errors under pressure.',
    nextSteps: 'Focus on timed practice drills to improve speed and accuracy.',
  },
  {
    id: 'pn2',
    studentId: '3',
    date: new Date(new Date().setDate(today.getDate() - 30)).toISOString(),
    summary: 'Vocabulary has expanded significantly.',
    strengths: 'Excellent memory for new words and phrases.',
    weaknesses: 'Hesitation in spontaneous conversation.',
    nextSteps: 'Increase role-playing exercises to build confidence in speaking.',
  },
];
