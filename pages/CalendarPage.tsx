import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "../components/icons";

type CalendarView = "month" | "week";

const getColorForStudent = (
  studentId: string
): { bg: string; border: string; text: string } => {
  const colors = [
    { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-900" },
    {
      bg: "bg-purple-100",
      border: "border-purple-300",
      text: "text-purple-900",
    },
    { bg: "bg-green-100", border: "border-green-300", text: "text-green-900" },
    { bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-900" },
    {
      bg: "bg-yellow-100",
      border: "border-yellow-300",
      text: "text-yellow-900",
    },
    {
      bg: "bg-indigo-100",
      border: "border-indigo-300",
      text: "text-indigo-900",
    },
  ];
  const index = parseInt(studentId, 10) % colors.length;
  return colors[index];
};

interface CalendarDay {
  date: Date;
  sessions: any[];
  isCurrentMonth: boolean;
}

interface WeekDay {
  date: Date;
  day: string;
  sessions: any[];
}

const getDaysInMonth = (date: Date): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days: CalendarDay[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    days.push({
      date: new Date(currentDate),
      sessions: [],
      isCurrentMonth: currentDate.getMonth() === month,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};

const getWeekDays = (date: Date): WeekDay[] => {
  const current = new Date(date);
  const first = current.getDate() - current.getDay();
  const days: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(current.getFullYear(), current.getMonth(), first + i);
    days.push({
      date: day,
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      sessions: [],
    });
  }

  return days;
};

const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

// Modal for creating/editing lessons
interface LessonModalProps {
  isOpen: boolean;
  selectedDate?: Date;
  editingSession?: any;
  students: any[];
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  selectedDate,
  editingSession,
  students,
  onSave,
  onClose,
  isLoading,
}) => {
  const [studentId, setStudentId] = useState(editingSession?.studentId || "");
  const [date, setDate] = useState(
    editingSession?.date || formatDateKey(selectedDate || new Date())
  );
  const [startTime, setStartTime] = useState(
    editingSession?.startTime || "09:00"
  );
  const [duration, setDuration] = useState(
    editingSession?.durationMinutes || 60
  );
  const [topic, setTopic] = useState(editingSession?.topic || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!studentId) {
      setError("Please select a student");
      return;
    }

    try {
      await onSave({
        studentId,
        date,
        startTime,
        durationMinutes: parseInt(duration),
        topic,
      });
      setStudentId("");
      setDate(formatDateKey(new Date()));
      setStartTime("09:00");
      setDuration(60);
      setTopic("");
    } catch (err: any) {
      setError(err.message || "Failed to save lesson");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          {editingSession ? "Edit Lesson" : "Add Lesson"}
        </h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Student *
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Duration (min) *
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Algebra review"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 font-medium disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Lesson event with edit/delete actions
interface LessonEventProps {
  session: any;
  studentName: string;
  color: { bg: string; border: string; text: string };
  onEdit: (session: any) => void;
  onDelete: (sessionId: string) => void;
  onViewStudent: (studentId: string) => void;
  onViewNotes: (session: any) => void;
}

const LessonEvent: React.FC<LessonEventProps> = ({
  session,
  studentName,
  color,
  onEdit,
  onDelete,
  onViewStudent,
  onViewNotes,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Determine status color (default to confirmed if not specified)
  const statusColor =
    session.status === "pending"
      ? "bg-yellow-500"
      : session.status === "cancelled"
      ? "bg-red-500"
      : "bg-green-500";

  return (
    <div
      className={`p-2 mb-1 rounded border-l-4 cursor-pointer hover:shadow-md transition-all text-xs group relative ${color.bg} ${color.text}`}
      style={{
        borderLeftColor:
          session.status === "pending"
            ? "#eab308"
            : session.status === "cancelled"
            ? "#ef4444"
            : "#22c55e",
      }}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      title={`${studentName} • ${session.startTime || "No time"} • ${
        session.topic || "No topic"
      }`}
    >
      {/* Student name (bold) */}
      <div className="font-bold truncate leading-tight">{studentName}</div>

      {/* Time */}
      {session.startTime && (
        <div className="text-xs truncate opacity-90">
          {session.startTime}
          {session.endTime && ` – ${session.endTime}`}
        </div>
      )}

      {/* Topic (shortened) */}
      {session.topic && (
        <div className="text-xs truncate opacity-75 italic">
          {session.topic.length > 20
            ? session.topic.substring(0, 20) + "..."
            : session.topic}
        </div>
      )}

      {/* Action Menu */}
      {showMenu && (
        <div className="absolute -top-8 right-0 bg-white border border-slate-200 rounded shadow-lg z-40 flex gap-1 p-1">
          <button
            onClick={() => {
              onViewNotes(session);
              setShowMenu(false);
            }}
            className="p-1 hover:bg-purple-100 rounded text-purple-600 text-xs font-bold"
            title="View notes"
          >
            📝
          </button>
          <button
            onClick={() => {
              onEdit(session);
              setShowMenu(false);
            }}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="Edit"
          >
            <PencilIcon className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              if (confirm("Delete this lesson?")) {
                onDelete(session.id);
              }
              setShowMenu(false);
            }}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete"
          >
            <TrashIcon className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              onViewStudent(session.studentId);
              setShowMenu(false);
            }}
            className="p-1 hover:bg-sky-100 rounded text-sky-600 text-xs font-bold"
            title="View student"
          >
            👁️
          </button>
        </div>
      )}
    </div>
  );
};

interface MonthViewProps {
  days: CalendarDay[];
  students: any[];
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddLesson: (date: Date) => void;
  onEditLesson: (session: any) => void;
  onDeleteLesson: (sessionId: string) => void;
  onViewStudent: (studentId: string) => void;
  onViewNotes: (session: any) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  days,
  students,
  currentDate,
  onPrevMonth,
  onNextMonth,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onViewStudent,
  onViewNotes,
}) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onPrevMonth}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded font-medium transition-colors flex items-center gap-2"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => {
              window.location.href = "#/calendar";
              window.location.reload();
            }}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={onNextMonth}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded font-medium transition-colors flex items-center gap-2"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold text-slate-700 border-r border-slate-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayOfWeek = day.date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isToday =
              day.date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                onClick={() => onAddLesson(day.date)}
                className={`
                  min-h-24 p-3 border border-slate-200 cursor-pointer transition-all
                  group hover:shadow-md hover:border-sky-300
                  ${!day.isCurrentMonth ? "bg-slate-50" : ""}
                  ${
                    isWeekend && day.isCurrentMonth
                      ? "bg-slate-50"
                      : day.isCurrentMonth
                      ? "bg-white"
                      : ""
                  }
                  ${isToday ? "ring-2 ring-sky-500 ring-inset shadow-md" : ""}
                `}
              >
                {/* Date number with today indicator */}
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`
                      flex items-center justify-center w-7 h-7 rounded-full font-semibold text-sm
                      ${isToday ? "bg-sky-500 text-white" : ""}
                      ${!isToday && day.isCurrentMonth ? "text-slate-800" : ""}
                      ${!isToday && !day.isCurrentMonth ? "text-slate-400" : ""}
                    `}
                  >
                    {day.date.getDate()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddLesson(day.date);
                    }}
                    className="text-xs p-1 hover:bg-sky-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add lesson"
                  >
                    <PlusCircleIcon className="h-3 w-3 text-sky-600" />
                  </button>
                </div>

                {/* Sessions for this day */}
                <div className="space-y-1">
                  {day.sessions.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">
                      No lessons
                    </div>
                  ) : (
                    day.sessions.map((session, i) => (
                      <LessonEvent
                        key={i}
                        session={session}
                        studentName={
                          students.find((s) => s.id === session.studentId)
                            ?.name || "Unknown"
                        }
                        color={getColorForStudent(session.studentId)}
                        onEdit={onEditLesson}
                        onDelete={onDeleteLesson}
                        onViewStudent={onViewStudent}
                        onViewNotes={onViewNotes}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface WeekViewProps {
  weekDays: WeekDay[];
  students: any[];
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onAddLesson: (date: Date) => void;
  onEditLesson: (session: any) => void;
  onDeleteLesson: (sessionId: string) => void;
  onViewStudent: (studentId: string) => void;
  onViewNotes: (session: any) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  weekDays,
  students,
  currentDate,
  onPrevWeek,
  onNextWeek,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onViewStudent,
  onViewNotes,
}) => {
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Week of{" "}
          {weekDays[0].date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}{" "}
          -{" "}
          {weekDays[6].date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onPrevWeek}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded font-medium transition-colors flex items-center gap-2"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => {
              window.location.href = "#/calendar";
              window.location.reload();
            }}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={onNextWeek}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded font-medium transition-colors flex items-center gap-2"
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Week view grid */}
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-8 bg-slate-100 border-b border-slate-200">
          <div className="p-3 text-center font-semibold text-slate-700 border-r border-slate-200">
            Time
          </div>
          {weekDays.map((day) => (
            <div
              key={day.date.toDateString()}
              className="p-3 text-center font-semibold text-slate-700 border-r border-slate-200 last:border-r-0 hover:bg-blue-50 cursor-pointer"
              onClick={() => onAddLesson(day.date)}
              title="Click to add lesson"
            >
              <div>{day.day}</div>
              <div className="text-sm text-slate-600">{day.date.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="grid grid-cols-8 border-b border-slate-200"
            >
              <div className="p-3 text-center text-sm font-medium text-slate-600 border-r border-slate-200 bg-slate-50">
                {time}
              </div>
              {weekDays.map((day) => (
                <div
                  key={`${day.date.toDateString()}-${time}`}
                  onClick={() => onAddLesson(day.date)}
                  className="p-2 border-r border-slate-200 last:border-r-0 min-h-16 bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Click to add lesson"
                >
                  {day.sessions
                    .filter((s) => s.startTime.startsWith(time.split(":")[0]))
                    .map((session, i) => (
                      <LessonEvent
                        key={i}
                        session={session}
                        studentName={
                          students.find((s) => s.id === session.studentId)
                            ?.name || "Unknown"
                        }
                        color={getColorForStudent(session.studentId)}
                        onEdit={onEditLesson}
                        onDelete={onDeleteLesson}
                        onViewStudent={onViewStudent}
                        onViewNotes={onViewNotes}
                      />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, students, createSession, updateSession, deleteSession } =
    useAppContext();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarView>("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [editingSession, setEditingSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterStudentId, setFilterStudentId] = useState("all");
  const [filterLessonType, setFilterLessonType] = useState("all");
  const [isViewNotesModalOpen, setIsViewNotesModalOpen] = useState(false);
  const [sessionToView, setSessionToView] = useState<any>(null);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevMonth();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextMonth();
      } else if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        const today = new Date();
        setCurrentDate(today);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Map sessions to calendar days with filters applied
  const days = useMemo(() => {
    const calendarDays = getDaysInMonth(currentDate);
    calendarDays.forEach((day) => {
      const dayKey = formatDateKey(day.date);
      day.sessions = sessions.filter((session) => {
        // Match by date
        if (formatDateKey(new Date(session.date)) !== dayKey) return false;

        // Apply student filter
        if (
          filterStudentId !== "all" &&
          session.studentId !== filterStudentId
        ) {
          return false;
        }

        // Apply lesson type filter
        if (filterLessonType !== "all") {
          const sessionType = session.sessionType || "regular";
          if (sessionType !== filterLessonType) return false;
        }

        return true;
      });
    });
    return calendarDays;
  }, [currentDate, sessions, filterStudentId, filterLessonType]);

  const weekDays = useMemo(() => {
    const calendarWeekDays = getWeekDays(currentDate);
    calendarWeekDays.forEach((day) => {
      const dayKey = formatDateKey(day.date);
      day.sessions = sessions.filter((session) => {
        // Match by date
        if (formatDateKey(new Date(session.date)) !== dayKey) return false;

        // Apply student filter
        if (
          filterStudentId !== "all" &&
          session.studentId !== filterStudentId
        ) {
          return false;
        }

        // Apply lesson type filter
        if (filterLessonType !== "all") {
          const sessionType = session.sessionType || "regular";
          if (sessionType !== filterLessonType) return false;
        }

        return true;
      });
    });
    return calendarWeekDays;
  }, [currentDate, sessions, filterStudentId, filterLessonType]);

  const handleAddLesson = (date: Date) => {
    setSelectedDate(date);
    setEditingSession(null);
    setModalOpen(true);
  };

  const handleEditLesson = (session: any) => {
    setEditingSession(session);
    setSelectedDate(new Date(session.date));
    setModalOpen(true);
  };

  const handleDeleteLesson = async (sessionId: string) => {
    try {
      setIsLoading(true);
      await deleteSession(sessionId);
      setSuccessMessage("Lesson deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to delete lesson", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNotes = (session: any) => {
    setSessionToView(session);
    setIsViewNotesModalOpen(true);
  };

  const handleCloseViewNotes = () => {
    setSessionToView(null);
    setIsViewNotesModalOpen(false);
  };

  const handleSaveLesson = async (data: any) => {
    try {
      setIsLoading(true);
      if (editingSession) {
        await updateSession(editingSession.id, data);
        setSuccessMessage("Lesson updated successfully");
      } else {
        await createSession({
          ...data,
          tutorId: "tutor1",
          status: "completed",
        } as any);
        setSuccessMessage("Lesson created successfully");
      }
      setModalOpen(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save lesson", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewStudent = (studentId: string) => {
    navigate(`/student/${studentId}`);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Calculate statistics
  const sessionsThisMonth = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    return (
      sessionDate.getFullYear() === currentDate.getFullYear() &&
      sessionDate.getMonth() === currentDate.getMonth()
    );
  }).length;

  const sessionsLastMonth = sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return (
      sessionDate.getFullYear() === lastMonth.getFullYear() &&
      sessionDate.getMonth() === lastMonth.getMonth()
    );
  }).length;

  const sessionsDifference = sessionsThisMonth - sessionsLastMonth;
  const sessionsTrend =
    sessionsDifference > 0 ? "up" : sessionsDifference < 0 ? "down" : "neutral";

  const uniqueStudentsThisMonth = new Set(
    sessions
      .filter((s) => {
        const sessionDate = new Date(s.date);
        return (
          sessionDate.getFullYear() === currentDate.getFullYear() &&
          sessionDate.getMonth() === currentDate.getMonth()
        );
      })
      .map((s) => s.studentId)
  ).size;

  const totalHoursThisMonth =
    sessions
      .filter((s) => {
        const sessionDate = new Date(s.date);
        return (
          sessionDate.getFullYear() === currentDate.getFullYear() &&
          sessionDate.getMonth() === currentDate.getMonth()
        );
      })
      .reduce((sum, s) => sum + (s.durationMinutes || 60), 0) / 60;

  const hoursPerWeek = totalHoursThisMonth / 4.33; // Average weeks per month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const daysPassedInMonth = currentDate.getDate();

  return (
    <div className="space-y-8 p-6">
      {/* Success message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 shadow-lg z-50">
          {successMessage}
        </div>
      )}

      {/* Page Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-sky-600" />
            <h1 className="text-4xl font-bold text-slate-800">📅 Calendar</h1>
          </div>
          <button
            onClick={() => handleAddLesson(new Date())}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition-colors"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Add Lesson
          </button>
        </div>
        <p className="text-slate-600">
          Manage your tutoring schedule. Click any date to add, edit, or delete
          lessons.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sessions Card */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Sessions
                </p>
                <p className="text-xs text-slate-400">This Month</p>
              </div>
            </div>
          </div>
          <p className="text-4xl font-bold text-sky-600 mb-2">
            {sessionsThisMonth}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                sessionsTrend === "up"
                  ? "text-green-600"
                  : sessionsTrend === "down"
                  ? "text-red-600"
                  : "text-slate-500"
              }`}
            >
              {sessionsTrend === "up"
                ? "↑"
                : sessionsTrend === "down"
                ? "↓"
                : "→"}{" "}
              {Math.abs(sessionsDifference)} vs last month
            </span>
          </div>
        </div>

        {/* Students Card */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Unique
                </p>
                <p className="text-xs text-slate-400">Students</p>
              </div>
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {uniqueStudentsThisMonth}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">
              {uniqueStudentsThisMonth > 0
                ? `${(
                    (uniqueStudentsThisMonth / (students?.length || 1)) *
                    100
                  ).toFixed(0)}% of total`
                : "No sessions yet"}
            </span>
          </div>
        </div>

        {/* Hours Card */}
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Total Hours
                </p>
                <p className="text-xs text-slate-400">This Month</p>
              </div>
            </div>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-2">
            {Math.round(totalHoursThisMonth)}h
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">
              {hoursPerWeek > 0
                ? `${hoursPerWeek.toFixed(1)}h avg/week`
                : "No sessions yet"}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Calendar Toolbar */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm space-y-4">
        {/* Top row: Navigation + Views + Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Month/Date Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Previous (← Arrow)"
            >
              <ChevronLeftIcon className="h-5 w-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2 min-w-[200px]">
              <span className="text-lg font-bold text-slate-800">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="text-xs px-2 py-1 bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors font-medium"
                title="Jump to today (T key)"
              >
                Today
              </button>
              <input
                type="month"
                value={currentDate.toISOString().slice(0, 7)}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-");
                  setCurrentDate(new Date(parseInt(year), parseInt(month) - 1));
                }}
                className="text-xs px-2 py-1 border border-slate-300 rounded cursor-pointer hover:bg-slate-50"
                title="Date picker"
              />
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Next (→ Arrow)"
            >
              <ChevronRightIcon className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded font-medium text-sm transition-all ${
                viewMode === "month"
                  ? "bg-white text-sky-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              📅 Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded font-medium text-sm transition-all ${
                viewMode === "week"
                  ? "bg-white text-sky-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              📆 Week
            </button>
          </div>

          {/* Add Lesson Button */}
          <button
            onClick={() => handleAddLesson(new Date())}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition-colors whitespace-nowrap"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Add Lesson
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-medium text-slate-600">Filter:</label>
          <select
            value={filterStudentId}
            onChange={(e) => setFilterStudentId(e.target.value)}
            className="text-sm px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <option value="all">All Students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>

          <select
            value={filterLessonType}
            onChange={(e) => setFilterLessonType(e.target.value)}
            className="text-sm px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <option value="all">All Lesson Types</option>
            <option value="regular">Regular</option>
            <option value="exam-prep">Exam Prep</option>
            <option value="test-review">Test Review</option>
          </select>

          <button
            onClick={() => {
              setFilterStudentId("all");
              setFilterLessonType("all");
            }}
            className="text-sm px-3 py-1 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Reset
          </button>

          <div className="text-xs text-slate-500 ml-auto flex items-center gap-3">
            <button
              onClick={() => {
                const content = `${currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })} Lessons\n\n${sessions
                  .map(
                    (s) =>
                      `${new Date(s.date).toLocaleDateString()} - ${
                        s.startTime
                      } - ${
                        students.find((st) => st.id === s.studentId)?.fullName
                      } - ${s.topic}`
                  )
                  .join("\n")}`;
                const element = document.createElement("a");
                element.setAttribute(
                  "href",
                  "data:text/plain;charset=utf-8," + encodeURIComponent(content)
                );
                element.setAttribute(
                  "download",
                  `calendar_${currentDate.getFullYear()}_${String(
                    currentDate.getMonth() + 1
                  ).padStart(2, "0")}.txt`
                );
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="text-xs px-2 py-1 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              title="Export month as TXT"
            >
              📥 Export
            </button>
            <button
              onClick={() => window.print()}
              className="text-xs px-2 py-1 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              title="Print calendar"
            >
              🖨️ Print
            </button>
            💡 Use arrow keys (← →) or "T" to navigate
          </div>
        </div>
      </div>

      {/* Legend and Summary Strip */}
      <div className="space-y-3">
        {/* Color Legend */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-slate-700">Regular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-slate-700">Exam Prep</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-slate-700">Test Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-slate-700">Group</span>
            </div>
            <div className="border-l border-slate-300 mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-700">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-700">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-700">Cancelled</span>
            </div>
          </div>
        </div>

        {/* This Week Summary */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-4 border border-sky-200">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start">
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-sky-600">
                {sessions.length}
              </div>
              <div className="text-xs text-slate-600">Lessons</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-sky-600">
                {new Set(sessions.map((s) => s.studentId)).size}
              </div>
              <div className="text-xs text-slate-600">Students</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-sky-600">
                {(
                  sessions.reduce(
                    (sum, s) => sum + (s.durationMinutes || 0),
                    0
                  ) / 60
                ).toFixed(1)}
                h
              </div>
              <div className="text-xs text-slate-600">Total Hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Display */}
      {viewMode === "month" ? (
        <MonthView
          days={days}
          students={students}
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onAddLesson={handleAddLesson}
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
          onViewStudent={handleViewStudent}
          onViewNotes={handleViewNotes}
        />
      ) : (
        <WeekView
          weekDays={weekDays}
          students={students}
          currentDate={currentDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onAddLesson={handleAddLesson}
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
          onViewStudent={handleViewStudent}
          onViewNotes={handleViewNotes}
        />
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          📖 How to Use
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>
            ✨ <strong>Click any date cell</strong> to add a new lesson
          </li>
          <li>
            ✏️ <strong>Hover over a lesson</strong> to see edit and delete
            buttons
          </li>
          <li>
            👁️ <strong>Click the eye icon</strong> to view the student's profile
          </li>
          <li>
            📅 <strong>Use the buttons above</strong> to navigate months or
            weeks
          </li>
          <li>
            🎨 <strong>Colors represent different students</strong> for easy
            identification
          </li>
        </ul>
      </div>

      {/* Lesson Modal */}
      <LessonModal
        isOpen={modalOpen}
        selectedDate={selectedDate}
        editingSession={editingSession}
        students={students}
        onSave={handleSaveLesson}
        onClose={() => {
          setModalOpen(false);
          setEditingSession(null);
        }}
        isLoading={isLoading}
      />

      {/* View Notes Modal */}
      {isViewNotesModalOpen && sessionToView && (
        <Modal
          isOpen={isViewNotesModalOpen}
          onClose={handleCloseViewNotes}
          title="Lesson Notes"
        >
          <div className="space-y-4 max-w-2xl">
            {/* Lesson Details Header */}
            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-primary-900">
                    📅{" "}
                    {new Date(sessionToView.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-lg font-semibold text-primary-900">
                    at {sessionToView.startTime}
                  </span>
                </div>
                <p className="text-sm text-primary-800">
                  📚 <span className="font-medium">{sessionToView.topic}</span>
                </p>
                <p className="text-sm text-primary-800">
                  👤{" "}
                  <span className="font-medium">
                    {students.find((s) => s.id === sessionToView.studentId)
                      ?.fullName || "Unknown Student"}
                  </span>
                </p>
                <div className="flex gap-4 text-xs text-primary-700 pt-2">
                  <span>⏱️ {sessionToView.durationMinutes} minutes</span>
                  <span>🏷️ {sessionToView.sessionType || "regular"}</span>
                  {sessionToView.activities && (
                    <span>✅ {sessionToView.activities}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Full Notes Display */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                📝 Lesson Notes
              </p>
              {sessionToView.notes ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-normal">
                    {sessionToView.notes}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No notes recorded for this lesson.
                </p>
              )}
              {sessionToView.notes && (
                <p className="text-xs text-slate-500 mt-3">
                  Word count: {sessionToView.notes.split(/\s+/).length} words
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                Updated: {new Date(sessionToView.date).toLocaleDateString()}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleCloseViewNotes}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleCloseViewNotes();
                    handleEditLesson(sessionToView);
                  }}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Lesson
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CalendarPage;
