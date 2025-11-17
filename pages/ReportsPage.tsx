import React from "react";
import { useAppContext } from "../hooks/useAppContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Assessment, Session } from "../types";

const StudentProgressCard: React.FC<{
  studentId: string;
  studentName: string;
  studentSubject: string;
  assessments: Assessment[];
  sessions: Session[];
}> = ({ studentId, studentName, studentSubject, assessments, sessions }) => {
  const studentSessions = sessions.filter((s) => s.studentId === studentId);
  const studentAssessments = assessments.filter(
    (a) => a.studentId === studentId
  );

  const totalHours = Math.round(
    studentSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60
  );

  const avgScore =
    studentAssessments.length > 0
      ? Math.round(
          studentAssessments.reduce((sum, a) => sum + a.score, 0) /
            studentAssessments.length
        )
      : 0;

  const bestScore =
    studentAssessments.length > 0
      ? Math.max(...studentAssessments.map((a) => a.score))
      : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-800">{studentName}</h3>
            <p className="text-sm text-slate-500">{studentSubject}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary-50 p-3 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Total Hours</p>
              <p className="text-lg font-bold text-primary-600">
                {totalHours}h
              </p>
            </div>
            <div className="bg-success-light p-3 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Avg. Score</p>
              <p className="text-lg font-bold text-green-600">{avgScore}%</p>
            </div>
            <div className="bg-info-light p-3 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Best Score</p>
              <p className="text-lg font-bold text-blue-600">{bestScore}%</p>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            <p>📚 {studentSessions.length} lessons completed</p>
            <p>📊 {studentAssessments.length} assessments taken</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ReportsPage: React.FC = () => {
  const { students, assessments, sessions, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-slate-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Reports</h2>
        <p className="text-slate-600">
          Track progress and performance across all students
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-500 mb-1">
              Total Students
            </p>
            <p className="text-3xl font-bold text-primary-600">
              {students.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-500 mb-1">
              Total Sessions
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {sessions.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-500 mb-1">
              Total Assessments
            </p>
            <p className="text-3xl font-bold text-green-600">
              {assessments.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student Progress Cards */}
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4">
          Student Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentProgressCard
              key={student.id}
              studentId={student.id}
              studentName={student.fullName}
              studentSubject={student.subject}
              assessments={assessments}
              sessions={sessions}
            />
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Average Assessment Score
              </p>
              {assessments.length > 0 ? (
                <p className="text-2xl font-bold text-primary-600">
                  {Math.round(
                    assessments.reduce((sum, a) => sum + a.score, 0) /
                      assessments.length
                  )}
                  %
                </p>
              ) : (
                <p className="text-slate-500">No assessments yet</p>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Total Teaching Hours
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(
                  sessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60
                )}
                h
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Average Session Duration
              </p>
              {sessions.length > 0 ? (
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(
                    sessions.reduce((sum, s) => sum + s.durationMinutes, 0) /
                      sessions.length
                  )}
                  {" min"}
                </p>
              ) : (
                <p className="text-slate-500">No sessions yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
