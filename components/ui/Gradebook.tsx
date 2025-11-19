import React, { useMemo } from "react";
import { Card } from "../ui/Card";

export interface GradebookStudent {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface GradebookAssignment {
  id: string;
  name: string;
  dueDate?: string;
  maxScore?: number;
  type: "homework" | "test" | "assignment" | "quiz";
}

export interface GradebookEntry {
  studentId: string;
  assignmentId: string;
  score?: number;
  status?: "submitted" | "graded" | "pending" | "missing";
  submittedDate?: string;
}

interface GradebookProps {
  title?: string;
  students: GradebookStudent[];
  assignments: GradebookAssignment[];
  entries: GradebookEntry[];
  onCellClick?: (studentId: string, assignmentId: string) => void;
}

export const Gradebook: React.FC<GradebookProps> = ({
  title = "Gradebook",
  students,
  assignments,
  entries,
  onCellClick,
}) => {
  // Create a map for quick lookup
  const entryMap = useMemo(() => {
    const map = new Map<string, GradebookEntry>();
    entries.forEach((entry) => {
      map.set(`${entry.studentId}-${entry.assignmentId}`, entry);
    });
    return map;
  }, [entries]);

  // Calculate statistics
  const stats = useMemo(() => {
    const studentStats = students.map((student) => {
      const studentEntries = assignments.map((assignment) => {
        const entry = entryMap.get(`${student.id}-${assignment.id}`);
        return entry?.score || 0;
      });
      const total = studentEntries.reduce((a, b) => a + b, 0);
      const maxPossible = assignments.reduce(
        (sum, a) => sum + (a.maxScore || 100),
        0
      );
      const average =
        maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
      return { studentId: student.id, average, total };
    });

    return {
      studentStats: Object.fromEntries(
        studentStats.map((s) => [s.studentId, s])
      ),
    };
  }, [students, assignments, entryMap]);

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case "graded":
        return "bg-green-50 text-green-800";
      case "submitted":
        return "bg-blue-50 text-blue-800";
      case "pending":
        return "bg-yellow-50 text-yellow-800";
      case "missing":
        return "bg-red-50 text-red-800";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const getStatusBadge = (status?: string): string => {
    switch (status) {
      case "graded":
        return "✅";
      case "submitted":
        return "📤";
      case "pending":
        return "⏳";
      case "missing":
        return "❌";
      default:
        return "-";
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Title */}
      {title && (
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
      )}

      {/* Gradebook Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead>
            <tr className="border-b border-slate-300 bg-slate-100">
              {/* Student Column */}
              <th className="px-4 py-3 text-left font-semibold text-slate-900 sticky left-0 z-10 bg-slate-100 min-w-[200px]">
                Student
              </th>

              {/* Assignment Columns */}
              {assignments.map((assignment) => (
                <th
                  key={assignment.id}
                  className="px-4 py-3 text-center font-semibold text-slate-900 whitespace-nowrap min-w-[100px]"
                  title={assignment.name}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{assignment.name}</span>
                    <span className="text-xs text-slate-600">
                      {assignment.type === "homework" && "📝"}
                      {assignment.type === "test" && "✏️"}
                      {assignment.type === "quiz" && "❓"}
                      {assignment.type === "assignment" && "📋"}
                      {assignment.maxScore && ` / ${assignment.maxScore}`}
                    </span>
                  </div>
                </th>
              ))}

              {/* Average Column */}
              <th className="px-4 py-3 text-center font-semibold text-slate-900 sticky right-0 z-10 bg-slate-100 min-w-[80px]">
                Average
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {students.map((student, studentIdx) => {
              const studentStat = stats.studentStats[student.id] || {
                average: 0,
                total: 0,
              };

              return (
                <tr
                  key={student.id}
                  className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                    studentIdx % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  {/* Student Info */}
                  <td className="px-4 py-3 sticky left-0 z-10 bg-inherit font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {student.name}
                        </p>
                        {student.email && (
                          <p className="text-xs text-slate-600">
                            {student.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Assignment Cells */}
                  {assignments.map((assignment) => {
                    const entry = entryMap.get(
                      `${student.id}-${assignment.id}`
                    );

                    return (
                      <td
                        key={`${student.id}-${assignment.id}`}
                        onClick={() =>
                          onCellClick && onCellClick(student.id, assignment.id)
                        }
                        className={`px-4 py-3 text-center cursor-pointer transition-colors ${getStatusColor(
                          entry?.status
                        )}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {entry ? (
                            <>
                              <span className="font-semibold">
                                {entry.score !== undefined
                                  ? entry.score
                                  : getStatusBadge(entry.status)}
                              </span>
                              {entry.submittedDate && (
                                <span className="text-xs opacity-70">
                                  {new Date(
                                    entry.submittedDate
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Average */}
                  <td className="px-4 py-3 text-center sticky right-0 z-10 bg-inherit font-semibold">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        studentStat.average >= 80
                          ? "bg-green-100 text-green-800"
                          : studentStat.average >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {studentStat.average}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="px-6 py-12 text-center text-slate-500">
          <p>No students yet. Add students to see the gradebook.</p>
        </div>
      )}
    </Card>
  );
};

export default Gradebook;
