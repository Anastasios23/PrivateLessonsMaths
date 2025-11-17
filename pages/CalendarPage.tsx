import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, PlusCircleIcon, PencilIcon, TrashIcon } from "../components/icons";

type CalendarView = "month" | "week";

const getColorForStudent = (studentId: string): {bg: string; border: string; text: string} => {
  const colors = [
    { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-900" },
    { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-900" },
    { bg: "bg-green-100", border: "border-green-300", text: "text-green-900" },
    { bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-900" },
    { bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-900" },
    { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-900" },
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
  const [date, setDate] = useState(editingSession?.date || formatDateKey(selectedDate || new Date()));
  const [startTime, setStartTime] = useState(editingSession?.startTime || "09:00");
  const [duration, setDuration] = useState(editingSession?.durationMinutes || 60);
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
  color: {bg: string; border: string; text: string};
  onEdit: (session: any) => void;
  onDelete: (sessionId: string) => void;
  onViewStudent: (studentId: string) => void;
}

const LessonEvent: React.FC<LessonEventProps> = ({
  session,
  studentName,
  color,
  onEdit,
  onDelete,
  onViewStudent,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`p-2 mb-1 rounded border-l-4 cursor-pointer hover:shadow-md transition-all text-xs font-medium group relative ${color.bg} ${color.border} ${color.text} border-l-4`}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className="font-semibold truncate">{studentName}</div>
      <div className="truncate text-opacity-80">{session.startTime}</div>
      <div className="truncate text-opacity-70 text-xs">{session.topic || "No topic"}</div>

      {/* Action Menu */}
      {showMenu && (
        <div className="absolute -top-8 right-0 bg-white border border-slate-200 rounded shadow-lg z-40 flex gap-1 p-1">
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
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => onAddLesson(day.date)}
              className={`min-h-24 p-2 border border-slate-200 hover:bg-blue-50 cursor-pointer transition-colors ${
                !day.isCurrentMonth ? "bg-slate-50" : "bg-white"
              } ${day.date.toDateString() === new Date().toDateString() ? "bg-blue-50 ring-1 ring-blue-300" : ""}`}
            >
              {/* Date number with add button */}
              <div className="flex justify-between items-start mb-1">
                <div
                  className={`text-sm font-semibold ${
                    day.isCurrentMonth ? "text-slate-800" : "text-slate-400"
                  }`}
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
                {day.sessions.map((session, i) => (
                  <LessonEvent
                    key={i}
                    session={session}
                    studentName={students.find((s) => s.id === session.studentId)?.name || "Unknown"}
                    color={getColorForStudent(session.studentId)}
                    onEdit={onEditLesson}
                    onDelete={onDeleteLesson}
                    onViewStudent={onViewStudent}
                  />
                ))}
              </div>
            </div>
          ))}
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
              <div className="text-sm text-slate-600">
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-slate-200">
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
                        studentName={students.find((s) => s.id === session.studentId)?.name || "Unknown"}
                        color={getColorForStudent(session.studentId)}
                        onEdit={onEditLesson}
                        onDelete={onDeleteLesson}
                        onViewStudent={onViewStudent}
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
  const { sessions, students, createSession, updateSession, deleteSession } = useAppContext();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarView>("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [editingSession, setEditingSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Map sessions to calendar days
  const days = useMemo(() => {
    const calendarDays = getDaysInMonth(currentDate);
    calendarDays.forEach((day) => {
      const dayKey = formatDateKey(day.date);
      day.sessions = sessions.filter((session) => formatDateKey(new Date(session.date)) === dayKey);
    });
    return calendarDays;
  }, [currentDate, sessions]);

  const weekDays = useMemo(() => {
    const calendarWeekDays = getWeekDays(currentDate);
    calendarWeekDays.forEach((day) => {
      const dayKey = formatDateKey(day.date);
      day.sessions = sessions.filter((session) => formatDateKey(new Date(session.date)) === dayKey);
    });
    return calendarWeekDays;
  }, [currentDate, sessions]);

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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
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

  const totalHoursThisMonth = sessions
    .filter((s) => {
      const sessionDate = new Date(s.date);
      return (
        sessionDate.getFullYear() === currentDate.getFullYear() &&
        sessionDate.getMonth() === currentDate.getMonth()
      );
    })
    .reduce((sum, s) => sum + (s.durationMinutes || 60), 0) / 60;

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
          Manage your tutoring schedule. Click any date to add, edit, or delete lessons.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">
            Sessions This Month
          </p>
          <p className="text-3xl font-bold text-sky-600">
            {sessionsThisMonth}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">
            Unique Students
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {uniqueStudentsThisMonth}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">
            Total Hours This Month
          </p>
          <p className="text-3xl font-bold text-green-600">
            {Math.round(totalHoursThisMonth)}h
          </p>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("month")}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            viewMode === "month"
              ? "bg-sky-600 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          📅 Month View
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            viewMode === "week"
              ? "bg-sky-600 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          📆 Week View
        </button>
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
        />
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">📖 How to Use</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>✨ <strong>Click any date cell</strong> to add a new lesson</li>
          <li>✏️ <strong>Hover over a lesson</strong> to see edit and delete buttons</li>
          <li>👁️ <strong>Click the eye icon</strong> to view the student's profile</li>
          <li>📅 <strong>Use the buttons above</strong> to navigate months or weeks</li>
          <li>🎨 <strong>Colors represent different students</strong> for easy identification</li>
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
    </div>
  );
};

export default CalendarPage;
