import React, { useState } from "react";
import { Homework, HomeworkStatus } from "../../types";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useAppContext } from "../../hooks/useAppContext";

interface AddHomeworkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (homeworkData: Omit<Homework, "id" | "createdAt">) => Promise<void>;
  studentId?: string; // Optional - for single student form
  mode?: "modal" | "inline"; // How to display the form
}

export const AddHomeworkForm: React.FC<AddHomeworkFormProps> = ({
  isOpen,
  onClose,
  onSave,
  studentId,
  mode = "modal",
}) => {
  const { students, groups } = useAppContext();

  const [assignmentType, setAssignmentType] = useState<"student" | "group">(
    studentId ? "student" : "student"
  );
  const [selectedStudent, setSelectedStudent] = useState(studentId || "");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [assignedDate, setAssignedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<HomeworkStatus>(HomeworkStatus.Assigned);
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Validation
      if (assignmentType === "student" && !selectedStudent) {
        setError("Please select a student");
        return;
      }
      if (assignmentType === "group" && !selectedGroup) {
        setError("Please select a group");
        return;
      }
      if (!description.trim()) {
        setError("Description is required");
        return;
      }
      if (!dueDate) {
        setError("Due date is required");
        return;
      }

      setIsLoading(true);

      const homeworkData: Omit<Homework, "id" | "createdAt"> = {
        studentId: assignmentType === "student" ? selectedStudent : undefined,
        groupId: assignmentType === "group" ? selectedGroup : undefined,
        assignedDate,
        dueDate,
        description,
        status,
        score: score ? parseFloat(score) : undefined,
        notes: notes || undefined,
      };

      await onSave(homeworkData);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to create homework");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAssignmentType("student");
    setSelectedStudent(studentId || "");
    setSelectedGroup("");
    setDescription("");
    setScore("");
    setNotes("");
    setError("");
    onClose();
  };

  // Get students for selected group
  const groupStudents =
    assignmentType === "group" && selectedGroup
      ? students.filter((s) => s.groups?.includes(selectedGroup))
      : [];

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Assignment Type - Only show if not single student mode */}
      {!studentId && (
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Assignment Type
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <label
              className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors"
              style={{
                borderColor:
                  assignmentType === "student" ? "#2563eb" : "#e2e8f0",
                backgroundColor:
                  assignmentType === "student" ? "#eff6ff" : "transparent",
              }}
            >
              <input
                type="radio"
                value="student"
                checked={assignmentType === "student"}
                onChange={(e) => setAssignmentType(e.target.value as "student")}
                className="w-4 h-4"
              />
              <div>
                <p className="font-medium text-slate-900">👤 Individual</p>
                <p className="text-xs text-slate-600">One student</p>
              </div>
            </label>

            <label
              className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors"
              style={{
                borderColor: assignmentType === "group" ? "#2563eb" : "#e2e8f0",
                backgroundColor:
                  assignmentType === "group" ? "#eff6ff" : "transparent",
              }}
            >
              <input
                type="radio"
                value="group"
                checked={assignmentType === "group"}
                onChange={(e) => setAssignmentType(e.target.value as "group")}
                className="w-4 h-4"
              />
              <div>
                <p className="font-medium text-slate-900">👥 Group/Class</p>
                <p className="text-xs text-slate-600">Multiple students</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Selection Dropdown */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {assignmentType === "student"
            ? "Select Student"
            : "Select Group/Class"}{" "}
          *
        </label>
        {assignmentType === "student" ? (
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Choose a student...</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName} ({student.subject})
              </option>
            ))}
          </select>
        ) : (
          <>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose a group...</option>
              {groups.map((group) => {
                const groupSize = students.filter((s) =>
                  s.groups?.includes(group)
                ).length;
                return (
                  <option key={group} value={group}>
                    {group} ({groupSize} students)
                  </option>
                );
              })}
            </select>
            {selectedGroup && groupStudents.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 font-medium mb-2">
                  This assignment will be given to:
                </p>
                <div className="flex flex-wrap gap-2">
                  {groupStudents.map((student) => (
                    <span
                      key={student.id}
                      className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                    >
                      {student.fullName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Assigned Date
          </label>
          <input
            type="date"
            value={assignedDate}
            onChange={(e) => setAssignedDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Due Date *
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Description / Instructions *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter homework description, instructions, or exercises..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">
          {description.length} characters
        </p>
      </div>

      {/* Status and Score */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as HomeworkStatus)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={HomeworkStatus.Assigned}>Assigned</option>
            <option value={HomeworkStatus.Submitted}>Submitted</option>
            <option value={HomeworkStatus.Checked}>Checked</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Score (optional)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="e.g., 18.5"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes about this homework..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Assigning..." : "Assign Homework"}
        </Button>
      </div>
    </form>
  );

  if (mode === "modal") {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Assign Homework">
        <div className="max-w-2xl">{formContent}</div>
      </Modal>
    );
  }

  return <div className="max-w-2xl">{formContent}</div>;
};
