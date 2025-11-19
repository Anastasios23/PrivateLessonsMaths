import React, { useState, useMemo } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { Toolbar, ToolbarAction } from "../components/layout/Toolbar";
import {
  Gradebook,
  GradebookStudent,
  GradebookAssignment,
  GradebookEntry,
} from "../components/ui/Gradebook";
import { PlusCircleIcon } from "../components/icons";

export const GradesPage: React.FC = () => {
  const { students, homework, assessments, sessions } = useAppContext();
  const [filterStudent, setFilterStudent] = useState("all");

  // Prepare gradebook data
  const gradebookStudents: GradebookStudent[] = useMemo(
    () =>
      students
        .filter((s) => filterStudent === "all" || s.id === filterStudent)
        .map((s) => ({
          id: s.id,
          name: s.fullName,
          email: s.subject,
          avatar: s.subject,
        })),
    [students, filterStudent]
  );

  const gradebookAssignments: GradebookAssignment[] = useMemo(() => {
    const items: GradebookAssignment[] = [];

    // Add homework assignments
    homework.forEach((hw) => {
      items.push({
        id: `hw-${hw.id}`,
        name: hw.description.split("\n")[0].substring(0, 20),
        dueDate: hw.dueDate,
        maxScore: hw.score || 100,
        type: "homework",
      });
    });

    // Add assessments
    assessments.forEach((assessment) => {
      items.push({
        id: `assess-${assessment.id}`,
        name: assessment.description.substring(0, 20),
        dueDate: assessment.date,
        maxScore: assessment.maxScore,
        type: "test",
      });
    });

    return items.slice(0, 10); // Limit to 10 for demo
  }, [homework, assessments]);

  const gradebookEntries: GradebookEntry[] = useMemo(() => {
    const entries: GradebookEntry[] = [];

    // Add homework entries
    homework.forEach((hw) => {
      if (hw.studentId) {
        entries.push({
          studentId: hw.studentId,
          assignmentId: `hw-${hw.id}`,
          score:
            hw.status === "checked"
              ? hw.score || Math.floor(Math.random() * 100)
              : undefined,
          status:
            hw.status === "checked"
              ? "graded"
              : hw.status === "submitted"
              ? "submitted"
              : "pending",
          submittedDate: hw.status !== "assigned" ? hw.assignedDate : undefined,
        });
      }
    });

    // Add assessment entries
    assessments.forEach((assess) => {
      entries.push({
        studentId: assess.studentId,
        assignmentId: `assess-${assess.id}`,
        score: assess.score,
        status: "graded",
        submittedDate: assess.date,
      });
    });

    return entries;
  }, [homework, assessments]);

  const toolbarActions: ToolbarAction[] = [
    {
      id: "add-homework",
      label: "Add Homework",
      icon: <PlusCircleIcon className="h-4 w-4" />,
      variant: "primary",
      onClick: () => alert("Open homework form"),
    },
    {
      id: "add-test",
      label: "Add Test",
      icon: <PlusCircleIcon className="h-4 w-4" />,
      variant: "secondary",
      onClick: () => alert("Open assessment form"),
    },
    {
      id: "export",
      label: "Export",
      icon: <PlusCircleIcon className="h-4 w-4" />,
      variant: "secondary",
      onClick: () => alert("Export to CSV"),
    },
  ];

  const handleCellClick = (studentId: string, assignmentId: string) => {
    console.log(`Clicked: Student ${studentId}, Assignment ${assignmentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Toolbar title="Gradebook" actions={toolbarActions}>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Filter:</label>
          <select
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName}
              </option>
            ))}
          </select>
        </div>
      </Toolbar>

      {/* Gradebook Table */}
      <div className="px-6">
        <Gradebook
          title={`Grades for ${gradebookStudents.length} Student${
            gradebookStudents.length !== 1 ? "s" : ""
          }`}
          students={gradebookStudents}
          assignments={gradebookAssignments}
          entries={gradebookEntries}
          onCellClick={handleCellClick}
        />
      </div>

      {/* Statistics */}
      <div className="px-6 grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Total Assignments</p>
          <p className="text-2xl font-bold text-slate-900">
            {gradebookAssignments.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Total Submissions</p>
          <p className="text-2xl font-bold text-slate-900">
            {gradebookEntries.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Graded</p>
          <p className="text-2xl font-bold text-green-600">
            {gradebookEntries.filter((e) => e.status === "graded").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {gradebookEntries.filter((e) => e.status === "pending").length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GradesPage;
