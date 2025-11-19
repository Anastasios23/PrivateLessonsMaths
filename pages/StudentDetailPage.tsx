import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import {
  Student,
  Session,
  Homework,
  ProgressNote,
  Assessment,
  HomeworkStatus,
} from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { UpdateHomeworkForm } from "../components/forms/UpdateHomeworkForm";
import { EditStudentForm } from "../components/forms/EditStudentForm";
import { AddSessionForm } from "../components/forms/AddSessionForm";
import { AddHomeworkForm } from "../components/forms/AddHomeworkForm";
import { AddAssessmentForm } from "../components/forms/AddAssessmentForm";
import { SubmitHomeworkForm } from "../components/forms/SubmitHomeworkForm";
import { PencilIcon, TrashIcon } from "../components/icons";

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active ? "bg-primary-500 text-white" : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {children}
  </button>
);

const SessionList: React.FC<{
  sessions: Session[];
  onAddSession?: () => void;
}> = ({ sessions, onAddSession }) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(
    null
  );

  const sortedSessions = [...sessions].sort(
    (a, b) =>
      new Date(b.date + "T" + b.startTime).getTime() -
      new Date(a.date + "T" + a.startTime).getTime()
  );

  const lastSessionDate =
    sortedSessions.length > 0
      ? new Date(sortedSessions[0].date).toLocaleDateString()
      : "N/A";

  const totalLessonMinutes = sessions.reduce(
    (sum, s) => sum + s.durationMinutes,
    0
  );

  const handleToggleExpand = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Total Lessons</p>
            <p className="text-3xl font-bold text-primary-600">
              {sessions.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Last Lesson</p>
            <p className="text-lg font-semibold text-slate-800">
              {lastSessionDate}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Total Time</p>
            <p className="text-3xl font-bold text-primary-600">
              {Math.round(totalLessonMinutes / 60)}h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Session Button */}
      {onAddSession && (
        <Button onClick={onAddSession} className="w-full">
          + Add Lesson
        </Button>
      )}

      {/* Sessions List */}
      {sortedSessions.length === 0 ? (
        <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-lg">
          <p>No lessons recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedSessions.map((session) => (
            <Card
              key={session.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleToggleExpand(session.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-800">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        {" • "}
                        {session.startTime}
                      </p>
                      <span className="text-sm text-slate-500">
                        ({session.durationMinutes} min)
                      </span>
                      {session.homeworkGiven && (
                        <span className="text-lg">📝</span>
                      )}
                    </div>
                    <p className="text-slate-700 font-medium mt-2">
                      {session.topic}
                    </p>

                    {/* Expanded content */}
                    {expandedSessionId === session.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                            Session Type
                          </p>
                          <Badge
                            status={
                              session.sessionType === "regular"
                                ? "Completed"
                                : session.sessionType === "exam-prep"
                                ? "Scheduled"
                                : "Missed"
                            }
                          />
                        </div>
                        {session.activities && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                              Activities
                            </p>
                            <p className="text-sm text-slate-700">
                              {session.activities}
                            </p>
                          </div>
                        )}
                        {session.notes && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                              Notes
                            </p>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                              {session.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expand/Collapse indicator */}
                  <div className="text-slate-400 flex-shrink-0 text-xl">
                    {expandedSessionId === session.id ? "▼" : "▶"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const HomeworkList: React.FC<{
  homework: Homework[];
  onEdit?: (homework: Homework) => void;
  onSubmit?: (homework: Homework) => void;
}> = ({ homework, onEdit, onSubmit }) => (
  <div className="space-y-4">
    {homework.length === 0 ? (
      <div className="text-center p-8 text-slate-500">
        No homework assigned yet
      </div>
    ) : (
      homework
        .sort(
          (a, b) =>
            new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        )
        .map((h) => (
          <Card key={h.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="font-semibold text-slate-800">
                      {h.description}
                    </p>
                    <p className="text-sm text-slate-500">
                      Due: {new Date(h.dueDate).toLocaleDateString()}
                    </p>
                    {h.notes && (
                      <p className="text-xs italic text-slate-600 mt-1">
                        Notes: {h.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <Badge status={h.status} />
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(h)}
                        aria-label={`Update ${h.description}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* File Submission Section */}
                {h.submissionFile ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">
                          File Submitted
                        </p>
                        <p className="text-xs text-slate-600 truncate">
                          {h.submissionFile.fileName}
                        </p>
                        <p className="text-xs text-slate-600">
                          {new Date(
                            h.submissionFile.uploadDate
                          ).toLocaleDateString()}{" "}
                          • {(h.submissionFile.fileSize / 1024).toFixed(1)} KB
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = `data:${
                              h.submissionFile!.fileType
                            };base64,${h.submissionFile!.fileData}`;
                            link.download = h.submissionFile!.fileName;
                            link.click();
                          }}
                          className="text-xs text-green-600 hover:underline mt-1"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ) : h.status === "submitted" || h.status === "checked" ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm text-amber-800">
                      ⚠️ No file uploaded for this submission
                    </p>
                  </div>
                ) : onSubmit && h.status === "assigned" ? (
                  <Button
                    onClick={() => onSubmit(h)}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    📤 Upload & Submit
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))
    )}
  </div>
);

const ProgressNotesList: React.FC<{ notes: ProgressNote[] }> = ({ notes }) => (
  <div className="space-y-4">
    {notes.length === 0 ? (
      <div className="text-center p-8 text-slate-500">
        No progress notes yet
      </div>
    ) : (
      notes
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((n) => (
          <Card key={n.id}>
            <CardHeader>
              <CardTitle>{new Date(n.date).toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{n.summary}</p>
              <div className="mt-4">
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                  Next Steps
                </h4>
                <p className="text-sm text-slate-600">{n.nextSteps}</p>
              </div>
            </CardContent>
          </Card>
        ))
    )}
  </div>
);

type Tab =
  | "overview"
  | "sessions"
  | "homework"
  | "assessments"
  | "progress"
  | "daily-notes";

export const StudentDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const {
    students,
    sessions,
    homework,
    progressNotes,
    assessments,
    loading,
    updateStudent,
    deleteStudent,
    updateHomework,
    createSession,
    createHomework,
    createAssessment,
    updateSession,
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isAddHomeworkModalOpen, setIsAddHomeworkModalOpen] = useState(false);
  const [isSubmitHomeworkModalOpen, setIsSubmitHomeworkModalOpen] =
    useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(
    null
  );
  const [homeworkToSubmit, setHomeworkToSubmit] = useState<Homework | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const [isCleanView, setIsCleanView] = useState(false);
  const [isEditNotesModalOpen, setIsEditNotesModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [noteEditText, setNoteEditText] = useState("");
  const [isViewNoteModalOpen, setIsViewNoteModalOpen] = useState(false);
  const [noteToView, setNoteToView] = useState<Session | null>(null);

  const student = students.find((s) => s.id === studentId);
  const studentSessions = sessions.filter((s) => s.studentId === studentId);
  const studentHomework = homework.filter((h) => h.studentId === studentId);
  const studentProgressNotes = progressNotes.filter(
    (n) => n.studentId === studentId
  );
  const studentAssessments = assessments.filter(
    (a) => a.studentId === studentId
  );

  const handleOpenHomeworkModal = (homeworkItem: Homework) => {
    setSelectedHomework(homeworkItem);
    setIsHomeworkModalOpen(true);
  };

  const handleCloseHomeworkModal = () => {
    setSelectedHomework(null);
    setIsHomeworkModalOpen(false);
  };

  const handleOpenAddHomeworkModal = () => {
    setIsAddHomeworkModalOpen(true);
  };

  const handleCloseAddHomeworkModal = () => {
    setIsAddHomeworkModalOpen(false);
  };

  const handleSaveHomework = async (updatedHomework: Homework) => {
    await updateHomework(updatedHomework);
    handleCloseHomeworkModal();
  };

  const handleSaveNewHomework = async (
    homeworkData: Omit<Homework, "id" | "createdAt">
  ) => {
    await createHomework(homeworkData);
    handleCloseAddHomeworkModal();
  };

  const handleOpenSubmitHomeworkModal = (homework: Homework) => {
    setHomeworkToSubmit(homework);
    setIsSubmitHomeworkModalOpen(true);
  };

  const handleCloseSubmitHomeworkModal = () => {
    setHomeworkToSubmit(null);
    setIsSubmitHomeworkModalOpen(false);
  };

  const handleSaveHomeworkSubmission = async (updatedHomework: Homework) => {
    await updateHomework(updatedHomework);
    handleCloseSubmitHomeworkModal();
  };

  const handleOpenAssessmentModal = () => {
    setIsAssessmentModalOpen(true);
  };

  const handleCloseAssessmentModal = () => {
    setIsAssessmentModalOpen(false);
  };

  const handleSaveAssessment = async (
    assessmentData: Omit<Assessment, "id" | "createdAt">
  ) => {
    await createAssessment(assessmentData);
    handleCloseAssessmentModal();
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenSessionModal = () => {
    setIsSessionModalOpen(true);
  };

  const handleCloseSessionModal = () => {
    setIsSessionModalOpen(false);
  };

  const handleSaveSession = async (
    sessionData: Omit<Session, "id" | "createdAt">
  ) => {
    await createSession(sessionData);
    handleCloseSessionModal();
  };

  const handleSaveStudent = async (updates: Partial<Student>) => {
    await updateStudent(student!.id, updates);
    handleCloseEditModal();
  };

  const handleDeleteStudent = async () => {
    if (student) {
      await deleteStudent(student.id);
      // Navigate back to students list after deletion
      window.location.hash = "#/students";
    }
  };

  const handleOpenEditNotesModal = (session: Session) => {
    setSelectedSession(session);
    setNoteEditText(session.notes || "");
    setIsEditNotesModalOpen(true);
  };

  const handleCloseEditNotesModal = () => {
    setSelectedSession(null);
    setNoteEditText("");
    setIsEditNotesModalOpen(false);
  };

  const handleSaveNotes = async () => {
    if (selectedSession) {
      await updateSession(selectedSession.id, {
        ...selectedSession,
        notes: noteEditText,
      });
      handleCloseEditNotesModal();
    }
  };

  const handleOpenViewNoteModal = (session: Session) => {
    setNoteToView(session);
    setIsViewNoteModalOpen(true);
  };

  const handleCloseViewNoteModal = () => {
    setNoteToView(null);
    setIsViewNoteModalOpen(false);
  };

  // Calculate homework completion rate (last 4 weeks)
  const calculateHomeworkCompletionRate = () => {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const fourWeeksAgoStr = fourWeeksAgo.toISOString().split("T")[0];

    const recentHomework = studentHomework.filter(
      (h) => h.dueDate >= fourWeeksAgoStr
    );
    const completedHomework = recentHomework.filter(
      (h) => h.status === "checked"
    );

    if (recentHomework.length === 0) return { completed: 0, total: 0 };
    return {
      completed: completedHomework.length,
      total: recentHomework.length,
    };
  };

  // Calculate average test score
  const calculateAverageScore = () => {
    if (studentAssessments.length === 0) return 0;
    const totalPercentage = studentAssessments.reduce((sum, assessment) => {
      const percentage = (assessment.score / assessment.maxScore) * 100;
      return sum + percentage;
    }, 0);
    return Math.round(totalPercentage / studentAssessments.length);
  };

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found.</div>;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link
              to="/students"
              className="text-sm text-primary-500 hover:underline mb-2 block"
            >
              &larr; Back to all students
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl">
                {student.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  {student.fullName}
                </h2>
                <p className="text-slate-500">
                  {student.subject} • {student.schoolYear}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isCleanView && (
              <>
                <Button onClick={handleOpenEditModal}>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsDeleteConfirming(true)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant={isCleanView ? "primary" : "secondary"}
              onClick={() => setIsCleanView(!isCleanView)}
              title={
                isCleanView
                  ? "Exit presentation mode"
                  : "Enter presentation mode"
              }
            >
              {isCleanView ? "👁️ Exit view" : "👁️ Clean view"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pb-2">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </TabButton>
          <TabButton
            active={activeTab === "sessions"}
            onClick={() => setActiveTab("sessions")}
          >
            Sessions
          </TabButton>
          <TabButton
            active={activeTab === "homework"}
            onClick={() => setActiveTab("homework")}
          >
            Homework
          </TabButton>
          <TabButton
            active={activeTab === "assessments"}
            onClick={() => setActiveTab("assessments")}
          >
            Tests & Exams
          </TabButton>
          <TabButton
            active={activeTab === "progress"}
            onClick={() => setActiveTab("progress")}
          >
            Progress
          </TabButton>
          <TabButton
            active={activeTab === "daily-notes"}
            onClick={() => setActiveTab("daily-notes")}
          >
            📝 Daily Notes
          </TabButton>
        </div>

        {/* Tab Content */}
        <div className={isCleanView ? "bg-white p-8 rounded-lg shadow-sm" : ""}>
          {activeTab === "overview" && (
            <div className="space-y-6">
              {!isCleanView && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 Tip: Click "Clean view" at the top to hide edit buttons
                    and show only key information for presentations.
                  </p>
                </div>
              )}

              {/* Parent Contact Card */}
              {!isCleanView && (
                <Card>
                  <CardHeader>
                    <CardTitle>Parent Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500">Parent Name</p>
                      <p className="font-semibold text-slate-800">
                        {student.contactParent.name || "—"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <a
                          href={`mailto:${student.contactParent.email}`}
                          className="font-semibold text-primary-600 hover:underline"
                        >
                          {student.contactParent.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Phone</p>
                        <a
                          href={`tel:${student.contactParent.phone}`}
                          className="font-semibold text-primary-600 hover:underline"
                        >
                          {student.contactParent.phone || "—"}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Goals Card - Show in both views */}
              <Card
                className={
                  isCleanView ? "border-2 border-primary-200 bg-primary-50" : ""
                }
              >
                <CardHeader>
                  <CardTitle className={isCleanView ? "text-primary-700" : ""}>
                    🎯 Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {student.goals && student.goals.length > 0 ? (
                    <ul className="space-y-2">
                      {student.goals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex-shrink-0 text-sm font-semibold">
                            {index + 1}
                          </span>
                          <span
                            className={
                              isCleanView
                                ? "text-base text-primary-900 font-medium"
                                : "text-slate-700"
                            }
                          >
                            {goal}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500">No goals set yet.</p>
                  )}
                </CardContent>
              </Card>

              {/* Notes Card */}
              {!isCleanView && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {student.notes || "No notes added yet."}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Additional Info */}
              {!isCleanView && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500">Started</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(student.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Level</p>
                      <p className="font-semibold text-slate-800">
                        {student.level}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "sessions" && (
            <SessionList
              sessions={studentSessions}
              onAddSession={!isCleanView ? handleOpenSessionModal : undefined}
            />
          )}
          {activeTab === "homework" && (
            <div className="space-y-6">
              {/* Homework Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500 mb-2">
                      Completion Rate (Last 4 Weeks)
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-800">
                        {calculateHomeworkCompletionRate().completed}
                      </p>
                      <p className="text-slate-500">
                        / {calculateHomeworkCompletionRate().total}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500 mb-2">
                      Total Homework Assigned
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {studentHomework.length}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Add Homework Button */}
              {!isCleanView && (
                <Button
                  onClick={handleOpenAddHomeworkModal}
                  variant="secondary"
                >
                  + Add Homework
                </Button>
              )}

              {/* Homework List */}
              <HomeworkList
                homework={studentHomework}
                onEdit={!isCleanView ? handleOpenHomeworkModal : undefined}
                onSubmit={
                  !isCleanView ? handleOpenSubmitHomeworkModal : undefined
                }
              />
            </div>
          )}
          {activeTab === "assessments" && (
            <div className="space-y-6">
              {/* Assessment Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500 mb-2">
                      Average Test Score
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {calculateAverageScore()}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500 mb-2">
                      Tests Completed
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {studentAssessments.length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500 mb-2">Best Score</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {studentAssessments.length > 0
                        ? Math.max(
                            ...studentAssessments.map(
                              (a) => (a.score / a.maxScore) * 100
                            )
                          ).toFixed(0) + "%"
                        : "—"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Add Assessment Button */}
              {!isCleanView && (
                <Button onClick={handleOpenAssessmentModal} variant="secondary">
                  + Add Test / Exam
                </Button>
              )}

              {/* Assessment List */}
              <div className="space-y-4">
                {studentAssessments.length === 0 ? (
                  <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-lg">
                    <p>No assessments recorded yet</p>
                  </div>
                ) : (
                  studentAssessments
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .map((assessment) => {
                      const percentage = (
                        (assessment.score / assessment.maxScore) *
                        100
                      ).toFixed(0);
                      const performanceLabel =
                        parseInt(percentage) >= 80
                          ? "Excellent"
                          : parseInt(percentage) >= 70
                          ? "Very Good"
                          : parseInt(percentage) >= 60
                          ? "Good"
                          : parseInt(percentage) >= 50
                          ? "Satisfactory"
                          : "Needs Improvement";
                      const performanceColor =
                        parseInt(percentage) >= 80
                          ? "text-green-600"
                          : parseInt(percentage) >= 70
                          ? "text-blue-600"
                          : parseInt(percentage) >= 60
                          ? "text-blue-600"
                          : parseInt(percentage) >= 50
                          ? "text-amber-600"
                          : "text-red-600";

                      return (
                        <Card key={assessment.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <p className="font-semibold text-slate-800">
                                  {assessment.description}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                  {new Date(assessment.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                                {assessment.notes && (
                                  <p className="text-xs italic text-slate-600 mt-2">
                                    {assessment.notes}
                                  </p>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-2xl font-bold text-slate-800">
                                  {percentage}%
                                </p>
                                <p
                                  className={`text-sm font-semibold ${performanceColor}`}
                                >
                                  {performanceLabel}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {assessment.score} / {assessment.maxScore}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                )}
              </div>
            </div>
          )}
          {activeTab === "progress" && (
            <ProgressNotesList notes={studentProgressNotes} />
          )}
          {activeTab === "daily-notes" && (
            <div className="space-y-4">
              {studentSessions.length === 0 ? (
                <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-lg">
                  <p>No lessons recorded yet</p>
                </div>
              ) : (
                [...studentSessions]
                  .sort(
                    (a, b) =>
                      new Date(b.date + "T" + b.startTime).getTime() -
                      new Date(a.date + "T" + a.startTime).getTime()
                  )
                  .map((session) => (
                    <Card
                      key={session.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() =>
                        !isCleanView && handleOpenEditNotesModal(session)
                      }
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">
                                📅{" "}
                                {new Date(session.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                                {" • "}
                                <span className="text-slate-600">
                                  {session.startTime}
                                </span>
                              </p>
                              <p className="text-sm text-slate-600 mt-1">
                                📚 {session.topic}
                              </p>
                            </div>
                            {!isCleanView && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditNotesModal(session);
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {/* Notes Section */}
                          <div
                            className="p-3 bg-slate-50 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                            onClick={() =>
                              session.notes && handleOpenViewNoteModal(session)
                            }
                          >
                            {session.notes ? (
                              <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                  Notes{" "}
                                  <span className="text-slate-400 font-normal">
                                    (click to expand)
                                  </span>
                                </p>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-3">
                                  {session.notes}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400 italic">
                                {!isCleanView
                                  ? "Click to add notes for this lesson..."
                                  : "No notes"}
                              </p>
                            )}
                          </div>

                          {/* Additional Info */}
                          <div className="flex gap-4 text-xs text-slate-600">
                            <span>⏱️ {session.durationMinutes} min</span>
                            <span>🏷️ {session.sessionType || "regular"}</span>
                            {session.activities && (
                              <span>
                                ✅ {session.activities.substring(0, 30)}...
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title="Edit Student"
        >
          <EditStudentForm
            student={student}
            onSave={handleSaveStudent}
            onCancel={handleCloseEditModal}
          />
        </Modal>
      )}

      {/* Update Homework Modal */}
      {selectedHomework && (
        <Modal
          isOpen={isHomeworkModalOpen}
          onClose={handleCloseHomeworkModal}
          title="Update Homework Status"
        >
          <UpdateHomeworkForm
            homework={selectedHomework}
            onSave={handleSaveHomework}
            onCancel={handleCloseHomeworkModal}
          />
        </Modal>
      )}

      {/* Add Homework Modal */}
      {isAddHomeworkModalOpen && student && (
        <Modal
          isOpen={isAddHomeworkModalOpen}
          onClose={handleCloseAddHomeworkModal}
          title="Add Homework"
        >
          <AddHomeworkForm
            studentId={student.id}
            onSave={handleSaveNewHomework}
            onCancel={handleCloseAddHomeworkModal}
          />
        </Modal>
      )}

      {/* Add Assessment Modal */}
      {isAssessmentModalOpen && student && (
        <Modal
          isOpen={isAssessmentModalOpen}
          onClose={handleCloseAssessmentModal}
          title="Add Test / Exam"
        >
          <AddAssessmentForm
            studentId={student.id}
            onSave={handleSaveAssessment}
            onCancel={handleCloseAssessmentModal}
          />
        </Modal>
      )}

      {/* Add Session Modal */}
      {isSessionModalOpen && student && (
        <Modal
          isOpen={isSessionModalOpen}
          onClose={handleCloseSessionModal}
          title="Add Lesson"
        >
          <AddSessionForm
            studentId={student.id}
            onSave={handleSaveSession}
            onCancel={handleCloseSessionModal}
          />
        </Modal>
      )}

      {/* Submit Homework Modal */}
      {homeworkToSubmit && isSubmitHomeworkModalOpen && student && (
        <Modal
          isOpen={isSubmitHomeworkModalOpen}
          onClose={handleCloseSubmitHomeworkModal}
          title="Submit Homework"
        >
          <SubmitHomeworkForm
            homework={homeworkToSubmit}
            onSave={handleSaveHomeworkSubmission}
            onCancel={handleCloseSubmitHomeworkModal}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirming && (
        <Modal
          isOpen={isDeleteConfirming}
          onClose={() => setIsDeleteConfirming(false)}
          title="Delete Student"
        >
          <div className="space-y-4">
            <p className="text-slate-700">
              Are you sure you want to delete{" "}
              <strong>{student.fullName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteConfirming(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteStudent}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Student
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Lesson Notes Modal */}
      {isEditNotesModalOpen && selectedSession && (
        <Modal
          isOpen={isEditNotesModalOpen}
          onClose={handleCloseEditNotesModal}
          title={`Edit Notes - ${new Date(
            selectedSession.date
          ).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })} at ${selectedSession.startTime}`}
        >
          <div className="space-y-4">
            {/* Lesson Details */}
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">
                📚 {selectedSession.topic}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                ⏱️ {selectedSession.durationMinutes} minutes
              </p>
              {selectedSession.activities && (
                <p className="text-xs text-slate-600 mt-1">
                  ✅ Activities: {selectedSession.activities}
                </p>
              )}
            </div>

            {/* Notes Textarea */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                📝 Lesson Notes
              </label>
              <textarea
                value={noteEditText}
                onChange={(e) => setNoteEditText(e.target.value)}
                placeholder="Add notes about this lesson (student progress, topics covered, homework assigned, etc.)"
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                {noteEditText.length} characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Button variant="secondary" onClick={handleCloseEditNotesModal}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotes}>Save Notes</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Note Modal */}
      {isViewNoteModalOpen && noteToView && (
        <Modal
          isOpen={isViewNoteModalOpen}
          onClose={handleCloseViewNoteModal}
          title={`Lesson Notes`}
        >
          <div className="space-y-4 max-w-2xl">
            {/* Lesson Details Header */}
            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-primary-900">
                    📅{" "}
                    {new Date(noteToView.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-lg font-semibold text-primary-900">
                    at {noteToView.startTime}
                  </span>
                </div>
                <p className="text-sm text-primary-800">
                  📚 <span className="font-medium">{noteToView.topic}</span>
                </p>
                <div className="flex gap-4 text-xs text-primary-700 pt-2">
                  <span>⏱️ {noteToView.durationMinutes} minutes</span>
                  <span>🏷️ {noteToView.sessionType || "regular"}</span>
                  {noteToView.activities && (
                    <span>✅ {noteToView.activities}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Full Notes Display */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                📝 Lesson Notes
              </p>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-normal">
                  {noteToView.notes}
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Word count: {noteToView.notes?.split(/\s+/).length || 0} words
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Updated: {new Date(noteToView.date).toLocaleDateString()}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleCloseViewNoteModal}>
                  Close
                </Button>
                {!isCleanView && (
                  <Button
                    onClick={() => {
                      handleCloseViewNoteModal();
                      handleOpenEditNotesModal(noteToView);
                    }}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Notes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
