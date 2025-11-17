import {
  Student,
  Session,
  Homework,
  ProgressNote,
  Assessment,
  SessionStatus,
  HomeworkStatus,
  SessionType,
} from "./types";

/**
 * ═══════════════════════════════════════════════════════════════
 * DESIGN SYSTEM
 * ═══════════════════════════════════════════════════════════════
 * Centralized design tokens for consistency across the application
 */

export const DESIGN_SYSTEM = {
  // Color Palette
  colors: {
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c3d66",
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    success: {
      light: "#dcfce7",
      main: "#22c55e",
      dark: "#16a34a",
    },
    warning: {
      light: "#fef3c7",
      main: "#f59e0b",
      dark: "#d97706",
    },
    error: {
      light: "#fee2e2",
      main: "#ef4444",
      dark: "#dc2626",
    },
    info: {
      light: "#dbeafe",
      main: "#3b82f6",
      dark: "#1d4ed8",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      mono: "'Monaco', 'Menlo', 'Consolas', 'Courier New', monospace",
    },
    fontSize: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing (8px base unit)
  spacing: {
    xs: "0.25rem",   // 4px
    sm: "0.5rem",    // 8px
    md: "1rem",      // 16px
    lg: "1.5rem",    // 24px
    xl: "2rem",      // 32px
    "2xl": "2.5rem", // 40px
    "3xl": "3rem",   // 48px
    "4xl": "4rem",   // 64px
  },

  // Border Radius
  borderRadius: {
    none: "0",
    xs: "0.125rem",
    sm: "0.25rem",
    base: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  // Shadows
  shadows: {
    none: "none",
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    base: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    md: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  // Transitions
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "350ms cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Breakpoints
  breakpoints: {
    xs: "0px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Component Sizing
  sizes: {
    iconSmall: "1rem",    // 16px
    iconBase: "1.25rem",  // 20px
    iconLarge: "1.5rem",  // 24px
    buttonHeight: "2.5rem", // 40px
    inputHeight: "2.375rem", // 38px
    headerHeight: "4rem",  // 64px
    sidebarWidth: "16rem", // 256px
  },
};

// Helper function to get CSS var name for colors
export const getColorVar = (colorPath: string) => `var(--color-${colorPath})`;

/**
 * ═══════════════════════════════════════════════════════════════
 * MOCK DATA
 * ═══════════════════════════════════════════════════════════════
 */

export const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    tutorId: "tutor1",
    fullName: "Alice Johnson",
    schoolYear: "Grade 10",
    contactParent: {
      name: "Sarah Johnson",
      phone: "+1-555-0101",
      email: "sarah.johnson@email.com",
    },
    goals: [
      "Pass June exam with ≥ 80%",
      "Improve algebra skills",
      "Build confidence in geometry",
    ],
    subject: "Mathematics",
    level: "Grade 10",
    notes:
      "Struggles with algebra, but strong in geometry. Responds well to visual explanations.",
    startDate: "2023-09-01T00:00:00.000Z",
    createdAt: "2023-08-15T00:00:00.000Z",
  },
  {
    id: "2",
    tutorId: "tutor1",
    fullName: "Ben Carter",
    schoolYear: "Year 7",
    contactParent: {
      name: "Michael Carter",
      phone: "+1-555-0102",
      email: "michael.carter@email.com",
    },
    goals: ["Master scales and arpeggios", "Prepare for Grade 2 piano exam"],
    subject: "Piano",
    level: "Beginner",
    notes: "Very enthusiastic and practices regularly. Excellent rhythm sense.",
    startDate: "2023-10-01T00:00:00.000Z",
    createdAt: "2023-09-20T00:00:00.000Z",
  },
  {
    id: "3",
    tutorId: "tutor1",
    fullName: "Chloe Davis",
    schoolYear: "Year 9",
    contactParent: {
      name: "Emma Davis",
      phone: "+1-555-0103",
      email: "emma.davis@email.com",
    },
    goals: [
      "Achieve conversational fluency",
      "Pass DELF exam",
      "Travel to France confident in French",
    ],
    subject: "French",
    level: "Intermediate",
    notes:
      "Working on conversational skills and verb conjugations. Good at written work.",
    startDate: "2023-05-10T00:00:00.000Z",
    createdAt: "2023-05-01T00:00:00.000Z",
  },
];

export const MOCK_SESSIONS: Session[] = [
  // Alice Johnson - Mathematics
  {
    id: "s1",
    studentId: "1",
    date: new Date().toISOString().split("T")[0],
    startTime: "16:00",
    durationMinutes: 60,
    topic: "Review of quadratic equations – factoring methods",
    activities:
      "Worked through 8 practice problems, focused on factoring trinomials",
    sessionType: SessionType.Regular,
    notes: "Alice grasped the difference of squares concept. Good progress!",
    homeworkGiven: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "s2",
    studentId: "1",
    date: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    startTime: "15:30",
    durationMinutes: 60,
    topic: "Introduction to trigonometry – sine, cosine, tangent",
    activities:
      "Introduced SOH-CAH-TOA, worked with right triangles, 5 practice problems",
    sessionType: SessionType.Regular,
    notes:
      "Good understanding of basic trig ratios. Needs more practice with angles.",
    homeworkGiven: true,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString(),
  },
  {
    id: "s3",
    studentId: "1",
    date: new Date(new Date().setDate(new Date().getDate() - 14))
      .toISOString()
      .split("T")[0],
    startTime: "16:00",
    durationMinutes: 60,
    topic: "Polynomial expansion and simplification",
    activities:
      "FOIL method, expanding double brackets, worked 10 problems together",
    sessionType: SessionType.ExamPrep,
    notes: "Preparing for mid-term exam. Needs to review negative numbers.",
    homeworkGiven: true,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 14)
    ).toISOString(),
  },

  // Ben Carter - Piano
  {
    id: "s4",
    studentId: "2",
    date: new Date().toISOString().split("T")[0],
    startTime: "18:00",
    durationMinutes: 45,
    topic: "C major scale and arpeggios",
    activities:
      "Practiced C major scale (both hands, 3 octaves), C major arpeggio",
    sessionType: SessionType.Regular,
    notes:
      "Consistent improvement in hand coordination. Tempo increasing nicely.",
    homeworkGiven: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "s5",
    studentId: "2",
    date: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    startTime: "18:00",
    durationMinutes: 45,
    topic: "Grade 2 exam piece - Minuet in G",
    activities: "Learned first 16 bars, worked on phrasing and dynamics",
    sessionType: SessionType.ExamPrep,
    notes:
      "Very enthusiastic about the exam piece. Ready to continue next week.",
    homeworkGiven: true,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString(),
  },
  {
    id: "s6",
    studentId: "2",
    date: new Date(new Date().setDate(new Date().getDate() - 21))
      .toISOString()
      .split("T")[0],
    startTime: "17:30",
    durationMinutes: 60,
    topic: "Hand position and warm-up exercises",
    activities: "Hanon exercises (1-10), scales review, posture check",
    sessionType: SessionType.Regular,
    notes: "Excellent practice habits. Ready for new material.",
    homeworkGiven: true,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 21)
    ).toISOString(),
  },

  // Chloe Davis - French
  {
    id: "s7",
    studentId: "3",
    date: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
    startTime: "19:00",
    durationMinutes: 60,
    topic: "Passé composé – forming and using past tense",
    activities:
      "Explained avoir vs être, conjugated 15 verbs, role-play dialogue",
    sessionType: SessionType.Regular,
    notes: "Focus on irregular verbs. Chloe picking up concepts quickly.",
    homeworkGiven: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "s8",
    studentId: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    startTime: "19:00",
    durationMinutes: 60,
    topic: "Restaurant conversation and ordering food",
    activities: "Menu vocabulary, listening comprehension, role-play scenarios",
    sessionType: SessionType.Regular,
    notes: "Strong pronunciation. Confident in ordering context.",
    homeworkGiven: true,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString(),
  },
  {
    id: "s9",
    studentId: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    startTime: "19:00",
    durationMinutes: 60,
    topic: "DELF exam preparation – writing section",
    activities: "Practiced formal letter writing, email composition",
    sessionType: SessionType.ExamPrep,
    notes: "Good essay structure. Work on more complex sentences.",
    homeworkGiven: true,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 30)
    ).toISOString(),
  },
];

export const MOCK_HOMEWORK: Homework[] = [
  {
    id: "h1",
    studentId: "1",
    sessionId: "s2",
    description: "Complete worksheet on trigonometric ratios – 15 problems",
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 2))
      .toISOString()
      .split("T")[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .split("T")[0],
    status: HomeworkStatus.Assigned,
    notes: "Focus on problems 8-15 (angle of elevation).",
    score: 92,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 2)
    ).toISOString(),
  },
  {
    id: "h2",
    studentId: "1",
    description: "Read chapter 5 on polynomials and complete review questions",
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 5))
      .toISOString()
      .split("T")[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0],
    status: HomeworkStatus.Submitted,
    notes: "Submitted via email. Good effort overall.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 5)
    ).toISOString(),
  },
  {
    id: "h3",
    studentId: "2",
    sessionId: "s4",
    description: "Practice C major scales for 15 minutes daily",
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
    status: HomeworkStatus.Assigned,
    notes: "Check for consistent tempo and proper hand position.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 1)
    ).toISOString(),
  },
  {
    id: "h4",
    studentId: "3",
    description: 'Write 3 paragraphs in French about "Ma journée" (My day)',
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    status: HomeworkStatus.Checked,
    score: 88,
    notes: "Excellent work! Minor spelling errors on passé composé.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString(),
  },
  {
    id: "h5",
    studentId: "1",
    sessionId: "s1",
    description: "Solve 20 quadratic equations using factoring method",
    assignedDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3))
      .toISOString()
      .split("T")[0],
    status: HomeworkStatus.Assigned,
    notes: "Worksheet provided in class.",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_PROGRESS_NOTES: ProgressNote[] = [
  {
    id: "pn1",
    studentId: "1",
    date: new Date(new Date().setDate(new Date().getDate() - 10))
      .toISOString()
      .split("T")[0],
    summary: "Making steady progress in Algebra and Trigonometry.",
    strengths:
      "Strong logical reasoning and problem-solving skills. Excellent at visual geometry.",
    weaknesses:
      "Occasional calculation errors under pressure. Needs more practice with negative numbers.",
    nextSteps:
      "Focus on timed practice drills to improve speed and accuracy. Review algebra fundamentals.",
  },
  {
    id: "pn2",
    studentId: "2",
    date: new Date(new Date().setDate(new Date().getDate() - 5))
      .toISOString()
      .split("T")[0],
    summary: "Piano skills progressing exceptionally well.",
    strengths:
      "Excellent work ethic, practices consistently. Strong rhythm sense. Excellent enthusiasm.",
    weaknesses:
      "Occasional tension in shoulders during fast passages. Needs work on dynamics.",
    nextSteps:
      "Introduce more complex exam pieces. Work on musicality and expression.",
  },
  {
    id: "pn3",
    studentId: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 15))
      .toISOString()
      .split("T")[0],
    summary:
      "French vocabulary has expanded significantly. Conversational skills improving.",
    strengths:
      "Excellent memory for new words and phrases. Strong pronunciation. Quick learner.",
    weaknesses:
      "Hesitation in spontaneous conversation. Verb conjugations need review.",
    nextSteps:
      "Increase role-playing exercises to build confidence. Focus on irregular verbs for DELF exam.",
  },
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: "a1",
    studentId: "1",
    date: new Date(new Date().setDate(new Date().getDate() - 14))
      .toISOString()
      .split("T")[0],
    description: "Algebra Unit Test – Linear Equations & Inequalities",
    score: 85,
    maxScore: 100,
    notes: "Strong understanding. Work on showing all steps.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 14)
    ).toISOString(),
  },
  {
    id: "a2",
    studentId: "1",
    date: new Date(new Date().setDate(new Date().getDate() - 7))
      .toISOString()
      .split("T")[0],
    description: "Trigonometry Quiz – Sine, Cosine, Tangent Ratios",
    score: 78,
    maxScore: 100,
    notes: "Good progress. Review reciprocal ratios.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString(),
  },
  {
    id: "a3",
    studentId: "1",
    date: new Date(new Date().setDate(new Date().getDate() - 3))
      .toISOString()
      .split("T")[0],
    description: "Polynomials Midterm Exam",
    score: 92,
    maxScore: 100,
    notes: "Excellent work! Nearly perfect!",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 3)
    ).toISOString(),
  },
  {
    id: "a4",
    studentId: "2",
    date: new Date(new Date().setDate(new Date().getDate() - 21))
      .toISOString()
      .split("T")[0],
    description: "Piano – ABRSM Grade 5 Practice Exam (Pieces)",
    score: 88,
    maxScore: 100,
    notes: "Excellent technique. Work on dynamics and pedal control.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 21)
    ).toISOString(),
  },
  {
    id: "a5",
    studentId: "2",
    date: new Date(new Date().setDate(new Date().getDate() - 10))
      .toISOString()
      .split("T")[0],
    description: "Piano – Sight Reading Test",
    score: 76,
    maxScore: 100,
    notes: "Good progress. Practice reading at tempo.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 10)
    ).toISOString(),
  },
  {
    id: "a6",
    studentId: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    description: "French – DELF A2 Mock Exam (Written)",
    score: 78,
    maxScore: 100,
    notes: "Solid performance. Watch verb tense agreement.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 30)
    ).toISOString(),
  },
  {
    id: "a7",
    studentId: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 15))
      .toISOString()
      .split("T")[0],
    description: "French – Oral Conversation Test",
    score: 85,
    maxScore: 100,
    notes: "Excellent! Great fluency and pronunciation.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 15)
    ).toISOString(),
  },
  {
    id: "a8",
    studentId: "3",
    date: new Date(new Date().setDate(new Date().getDate() - 5))
      .toISOString()
      .split("T")[0],
    description: "French – Vocabulary & Grammar Quiz",
    score: 72,
    maxScore: 100,
    notes: "Needs more attention to irregular verbs.",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 5)
    ).toISOString(),
  },
];
