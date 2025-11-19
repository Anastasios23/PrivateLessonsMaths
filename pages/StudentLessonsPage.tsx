import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { useAppContext } from "../hooks/useAppContext";

export const StudentLessonsPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const { students } = useAppContext();

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <div className="p-6">
        <div className="text-red-600">Student not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {student.fullName}
        </h1>
        <p className="text-slate-600 mt-1">
          {student.subject} • {student.schoolYear || "Unknown Year"}
        </p>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Class Schedule & Lessons
          </h2>

          <div className="space-y-4">
            {/* Example lesson cards - replace with real data */}
            <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Lesson 1: Algebra Basics
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    📅 Monday, Nov 20, 2025 • 4:00 PM - 5:00 PM
                  </p>
                  <p className="text-sm text-slate-600">
                    📍 Location: Online (Zoom)
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Scheduled
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Lesson 2: Quadratic Equations
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    📅 Wednesday, Nov 22, 2025 • 4:00 PM - 5:00 PM
                  </p>
                  <p className="text-sm text-slate-600">
                    📍 Location: Online (Zoom)
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Upcoming
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Lesson 3: Graphing Functions
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    📅 Friday, Nov 24, 2025 • 4:00 PM - 5:00 PM
                  </p>
                  <p className="text-sm text-slate-600">
                    📍 Location: Online (Zoom)
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
              Schedule New Lesson
            </button>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-600">12</div>
            <p className="text-sm text-slate-600 mt-2">Total Lessons</p>
          </div>
        </Card>

        <Card>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">10</div>
            <p className="text-sm text-slate-600 mt-2">Completed</p>
          </div>
        </Card>

        <Card>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">2</div>
            <p className="text-sm text-slate-600 mt-2">Upcoming</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
