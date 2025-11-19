import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { useAppContext } from "../hooks/useAppContext";

export const StudentGradesPage: React.FC = () => {
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

      {/* Overall Performance */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Overall Performance
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">92%</div>
              <p className="text-sm text-slate-600 mt-2">Current Average</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">A-</div>
              <p className="text-sm text-slate-600 mt-2">Letter Grade</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">↑ +2%</div>
              <p className="text-sm text-slate-600 mt-2">Trend (Last 4 weeks)</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Breakdown by Category */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Grades by Category
          </h2>

          <div className="space-y-4">
            {/* Homework */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">
                  📝 Homework (30%)
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  94/100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>

            {/* Quizzes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">
                  ✏️ Quizzes (20%)
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  88/100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "88%" }}
                ></div>
              </div>
            </div>

            {/* Tests */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">
                  📋 Tests (35%)
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  92/100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>

            {/* Participation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-900">
                  💬 Participation (15%)
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  96/100
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "96%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Grades */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Recent Assessment Results
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Assessment
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Score
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Percentage
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">Test 4: Advanced Topics</td>
                  <td className="py-3 px-4 text-slate-600">Test</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">92/100</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      92%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Nov 18, 2025</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">Quiz 6: Quadratic Equations</td>
                  <td className="py-3 px-4 text-slate-600">Quiz</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">17/20</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      85%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Nov 15, 2025</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">Homework 5: Practice Set</td>
                  <td className="py-3 px-4 text-slate-600">Homework</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">19/20</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      95%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Nov 12, 2025</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">Test 3: Linear Systems</td>
                  <td className="py-3 px-4 text-slate-600">Test</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">88/100</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                      88%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Nov 8, 2025</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900">Quiz 5: Algebra Review</td>
                  <td className="py-3 px-4 text-slate-600">Quiz</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">19/20</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      95%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">Nov 5, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Performance Insights */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Performance Insights
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium text-slate-900">Strengths</p>
                <p className="text-sm text-slate-600">
                  Excellent performance on homework and participation. Consistent
                  improvement trend over the last 4 weeks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-medium text-slate-900">Areas for Growth</p>
                <p className="text-sm text-slate-600">
                  Focus on advanced topics in tests. Quiz performance varies - consider
                  reviewing practice problems before quizzes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-medium text-slate-900">Recommendations</p>
                <p className="text-sm text-slate-600">
                  Continue current homework practice routine. Schedule extra tutoring
                  sessions for advanced topics before the next test.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
