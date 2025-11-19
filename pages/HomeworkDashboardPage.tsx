import React, { useState, useMemo } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  TrashIcon,
  PlusCircleIcon,
} from "../components/icons";
import { format } from "date-fns";

interface HomeworkRow {
  id: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  assignedTo: string; // "Group A" or "Student Name"
  isGroup: boolean;
  submissions: {
    studentId: string;
    studentName: string;
    status: "assigned" | "submitted" | "checked";
    score?: number;
    submissionDate?: string;
  }[];
  totalStudents: number;
  submittedCount: number;
  checkedCount: number;
}

export const HomeworkDashboardPage: React.FC = () => {
  const { homework, students, groups } = useAppContext();

  const [expandedHomeworkId, setExpandedHomeworkId] = useState<string | null>(
    null
  );
  const [filterAssignment, setFilterAssignment] = useState("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "assigned" | "submitted" | "checked"
  >("all");
  const [selectedHomework, setSelectedHomework] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Process homework data for display
  const homeworkRows = useMemo(() => {
    return homework.map((hw) => {
      const isGroup = !!hw.groupId;
      const assignedToText = isGroup
        ? hw.groupId || "Unknown Group"
        : students.find((s) => s.id === hw.studentId)?.fullName ||
          "Unknown Student";

      // Get all students for this assignment
      let relevantStudents = students;
      if (isGroup && hw.groupId) {
        relevantStudents = students.filter((s) =>
          s.groups?.includes(hw.groupId!)
        );
      } else if (hw.studentId) {
        relevantStudents = students.filter((s) => s.id === hw.studentId);
      }

      const submissions = relevantStudents.map((student) => ({
        studentId: student.id,
        studentName: student.fullName,
        status: hw.status as "assigned" | "submitted" | "checked",
        score: hw.score,
        submissionDate: hw.assignedDate,
      }));

      const submittedCount = submissions.filter(
        (s) => s.status === "submitted" || s.status === "checked"
      ).length;
      const checkedCount = submissions.filter(
        (s) => s.status === "checked"
      ).length;

      return {
        id: hw.id,
        title: hw.description.split("\n")[0].substring(0, 50), // First line as title
        assignedDate: hw.assignedDate,
        dueDate: hw.dueDate,
        description: hw.description,
        assignedTo: assignedToText,
        isGroup,
        submissions,
        totalStudents: submissions.length,
        submittedCount,
        checkedCount,
      };
    });
  }, [homework, students]);

  // Filter homework based on selection
  const filteredHomework = useMemo(() => {
    return homeworkRows.filter((row) => {
      if (filterAssignment !== "all" && row.assignedTo !== filterAssignment) {
        return false;
      }

      if (filterStatus !== "all") {
        // Filter based on submission status
        if (filterStatus === "assigned") {
          return row.submittedCount === 0;
        } else if (filterStatus === "submitted") {
          return row.submittedCount > 0 && row.checkedCount < row.totalStudents;
        } else if (filterStatus === "checked") {
          return row.checkedCount === row.totalStudents;
        }
      }

      return true;
    });
  }, [homeworkRows, filterAssignment, filterStatus]);

  // Get unique assignments and groups for filters
  const uniqueAssignments = useMemo(() => {
    const assignments = new Set(homeworkRows.map((r) => r.assignedTo));
    return Array.from(assignments).sort();
  }, [homeworkRows]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const total = homeworkRows.length;
    const allSubmitted = homeworkRows.filter((r) => r.submittedCount > 0).length;
    const allChecked = homeworkRows.filter((r) => r.checkedCount > 0).length;
    const overdue = homeworkRows.filter((r) => {
      return new Date(r.dueDate) < new Date() && r.submittedCount < r.totalStudents;
    }).length;

    return { total, allSubmitted, allChecked, overdue };
  }, [homeworkRows]);

  const handleToggleExpand = (homeworkId: string) => {
    setExpandedHomeworkId(
      expandedHomeworkId === homeworkId ? null : homeworkId
    );
  };

  const handleViewDetails = (row: HomeworkRow) => {
    setSelectedHomework(row);
    setIsDetailsModalOpen(true);
  };

  const getStatusColor = (
    status: "assigned" | "submitted" | "checked"
  ): string => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "submitted":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "checked":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (submitted: number, total: number): number => {
    return total === 0 ? 0 : Math.round((submitted / total) * 100);
  };

  const isOverdue = (dueDate: string): boolean => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Homework Dashboard</h1>
          <p className="text-slate-600 mt-1">Track assignments and submissions</p>
        </div>
        <Button className="gap-2">
          <PlusCircleIcon className="h-4 w-4" />
          Assign Homework
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-600">Total Assignments</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600">Submitted</p>
          <p className="text-3xl font-bold text-blue-600">{stats.allSubmitted}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600">Checked</p>
          <p className="text-3xl font-bold text-green-600">{stats.allChecked}</p>
        </Card>
        <Card className="p-4 border-2 border-red-200">
          <p className="text-sm text-slate-600">Overdue</p>
          <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Filter by Assignment
          </label>
          <select
            value={filterAssignment}
            onChange={(e) => setFilterAssignment(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Assignments</option>
            {uniqueAssignments.map((assignment) => (
              <option key={assignment} value={assignment}>
                {assignment}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as "all" | "assigned" | "submitted" | "checked"
              )
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="assigned">Not Submitted</option>
            <option value="submitted">Submitted (Not Checked)</option>
            <option value="checked">Checked</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredHomework.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-500">No assignments found</p>
          </Card>
        ) : (
          filteredHomework.map((row) => (
            <Card
              key={row.id}
              className={`overflow-hidden transition-all ${
                expandedHomeworkId === row.id ? "ring-2 ring-primary-500" : ""
              }`}
            >
              {/* Summary Row */}
              <div
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => handleToggleExpand(row.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <button className="text-slate-400 hover:text-slate-600">
                        {expandedHomeworkId === row.id ? (
                          <ChevronRightIcon className="h-5 w-5 rotate-90" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {row.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {row.isGroup ? "📚 Group:" : "👤 Student:"} {row.assignedTo}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submission Status Badge */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {row.submittedCount}/{row.totalStudents} Submitted
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{
                              width: `${getProgressPercentage(
                                row.submittedCount,
                                row.totalStudents
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">
                          {getProgressPercentage(
                            row.submittedCount,
                            row.totalStudents
                          )}
                          %
                        </span>
                      </div>
                    </div>

                    {/* Due Date Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        isOverdue(row.dueDate)
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-slate-100 text-slate-800 border border-slate-300"
                      }`}
                    >
                      Due: {format(new Date(row.dueDate), "MMM d")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedHomeworkId === row.id && (
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-900 mb-2">
                      Description
                    </p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {row.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-900 mb-3">
                      Student Submissions
                    </p>
                    <div className="space-y-2">
                      {row.submissions.map((submission) => (
                        <div
                          key={submission.studentId}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900">
                                {submission.studentName}
                              </p>
                              {submission.submissionDate && (
                                <p className="text-xs text-slate-600">
                                  Submitted: {format(new Date(submission.submissionDate), "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                submission.status
                              )}`}
                            >
                              {submission.status === "assigned"
                                ? "📋 Assigned"
                                : submission.status === "submitted"
                                ? "✏️ Submitted"
                                : "✅ Checked"}
                            </span>
                            {submission.score !== undefined && (
                              <span className="text-sm font-semibold text-slate-900">
                                {submission.score}%
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <Button
                      variant="secondary"
                      onClick={() => handleViewDetails(row)}
                    >
                      View Details
                    </Button>
                    <Button variant="secondary" className="text-red-600">
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedHomework && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title="Assignment Details"
        >
          <div className="space-y-4 max-w-2xl">
            {/* Header Info */}
            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-primary-900">
                  {selectedHomework.title}
                </h3>
                <div className="flex gap-4 flex-wrap">
                  <span className="text-sm text-primary-800">
                    📅 Assigned: {format(new Date(selectedHomework.assignedDate), "MMM d, yyyy")}
                  </span>
                  <span className="text-sm text-primary-800">
                    ⏰ Due: {format(new Date(selectedHomework.dueDate), "MMM d, yyyy")}
                  </span>
                  <span className="text-sm text-primary-800">
                    {selectedHomework.isGroup ? "👥" : "👤"} {selectedHomework.assignedTo}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-2">Description</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">
                {selectedHomework.description}
              </p>
            </div>

            {/* Submission Details Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="text-left py-2 px-3 text-slate-700 font-semibold">
                      Student
                    </th>
                    <th className="text-left py-2 px-3 text-slate-700 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-2 px-3 text-slate-700 font-semibold">
                      Submission Date
                    </th>
                    <th className="text-left py-2 px-3 text-slate-700 font-semibold">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedHomework.submissions.map((submission: any) => (
                    <tr
                      key={submission.studentId}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="py-2 px-3 text-slate-900">
                        {submission.studentName}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {submission.status === "checked" && "✅"}
                          {submission.status === "assigned"
                            ? "Assigned"
                            : submission.status === "submitted"
                            ? "Submitted"
                            : "Checked"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-700">
                        {submission.submissionDate
                          ? format(new Date(submission.submissionDate), "MMM d, yyyy")
                          : "-"}
                      </td>
                      <td className="py-2 px-3 text-slate-900 font-medium">
                        {submission.score ? `${submission.score}%` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <Button
                variant="secondary"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HomeworkDashboardPage;
