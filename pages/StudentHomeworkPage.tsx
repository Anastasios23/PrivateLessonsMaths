import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { useAppContext } from "../hooks/useAppContext";

export const StudentHomeworkPage: React.FC = () => {
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
            Homework Assignments
          </h2>

          <div className="space-y-4">
            {/* Pending Homework */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    Chapter 3: Quadratic Functions Exercises
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    📝 Assigned: Nov 18, 2025
                  </p>
                  <p className="text-sm text-slate-600">
                    📅 Due: Nov 25, 2025 • 11:59 PM
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Questions: 1-20 on pages 45-48
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium whitespace-nowrap ml-4">
                  Pending
                </span>
              </div>
            </div>

            {/* Pending Homework */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    Word Problems: Applications of Algebra
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    📝 Assigned: Nov 17, 2025
                  </p>
                  <p className="text-sm text-slate-600">
                    📅 Due: Nov 24, 2025 • 11:59 PM
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Complete 5 word problems with detailed solutions
                  </p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium whitespace-nowrap ml-4">
                  Due Soon
                </span>
              </div>
            </div>

            {/* Submitted Homework */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    Chapter 2: Linear Equations Practice
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    📝 Assigned: Nov 11, 2025
                  </p>
                  <p className="text-sm text-slate-600">
                    ✅ Submitted: Nov 18, 2025
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Grade: 18/20 (90%)
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap ml-4">
                  Graded
                </span>
              </div>
            </div>

            {/* Submitted Homework */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    Chapter 1: Fundamentals Worksheet
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    📝 Assigned: Nov 4, 2025
                  </p>
                  <p className="text-sm text-slate-600">
                    ✅ Submitted: Nov 11, 2025
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Grade: 19/20 (95%)
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap ml-4">
                  Graded
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-primary-600">8</div>
            <p className="text-sm text-slate-600 mt-2">Total Assigned</p>
          </div>
        </Card>

        <Card>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">6</div>
            <p className="text-sm text-slate-600 mt-2">Submitted</p>
          </div>
        </Card>

        <Card>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">2</div>
            <p className="text-sm text-slate-600 mt-2">Pending</p>
          </div>
        </Card>

        <Card>
          <div className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">92%</div>
            <p className="text-sm text-slate-600 mt-2">Average Grade</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
