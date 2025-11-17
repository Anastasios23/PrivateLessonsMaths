import React, { useState } from "react";
import { Student, ParentContact } from "../../types";
import { Button } from "../ui/Button";

interface AddStudentFormProps {
  onSave: (studentData: Omit<Student, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [fullName, setFullName] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [goals, setGoals] = useState<string[]>([""]);
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddGoal = () => {
    setGoals([...goals, ""]);
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Student name is required");
      return;
    }
    if (!parentEmail.trim()) {
      setError("Parent email is required");
      return;
    }

    try {
      setIsLoading(true);
      const studentData: Omit<Student, "id" | "createdAt"> = {
        tutorId: "tutor1", // Will be set from context in actual use
        fullName,
        schoolYear,
        subject,
        level,
        notes,
        goals: goals.filter((g) => g.trim()),
        contactParent: {
          name: parentName,
          phone: parentPhone,
          email: parentEmail,
        },
        startDate: new Date().toISOString(),
        groups: groups.length > 0 ? groups : undefined,
      };
      await onSave(studentData);
    } catch (err) {
      setError("Failed to create student");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Student Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Student Information
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g., Alice Johnson"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              School Year / Level
            </label>
            <input
              type="text"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              placeholder="e.g., Grade 10, Year 9"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Level
          </label>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="e.g., Intermediate, Beginner"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Groups / Classes (Optional - select multiple)
          </label>
          <div className="space-y-2">
            <p className="text-xs text-slate-500">
              You can assign a student to multiple groups
            </p>
            <div className="flex flex-wrap gap-2 p-3 border border-slate-300 rounded-md bg-slate-50 min-h-12">
              {groups.length === 0 ? (
                <p className="text-sm text-slate-400">No groups selected yet</p>
              ) : (
                groups.map((g, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() =>
                        setGroups(groups.filter((_, i) => i !== idx))
                      }
                      className="text-sky-700 hover:text-sky-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
            <input
              type="text"
              placeholder="Type group name and press Enter (e.g., Group A, Advanced, Class 2024)"
              onKeyPress={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const newGroup = e.currentTarget.value.trim();
                  if (!groups.includes(newGroup)) {
                    setGroups([...groups, newGroup]);
                  }
                  e.currentTarget.value = "";
                  e.preventDefault();
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Parent Contact Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Parent Contact</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Parent Name
          </label>
          <input
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            placeholder="e.g., Sarah Johnson"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="parent@email.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="+1-555-0000"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Goals</h3>
          <button
            type="button"
            onClick={handleAddGoal}
            className="text-sm text-primary-500 hover:text-primary-600 font-medium"
          >
            + Add Goal
          </button>
        </div>

        <div className="space-y-2">
          {goals.map((goal, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => handleGoalChange(index, e.target.value)}
                placeholder="e.g., Pass June exam with ≥ 80%"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGoal(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes about the student..."
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Student"}
        </Button>
      </div>
    </form>
  );
};
