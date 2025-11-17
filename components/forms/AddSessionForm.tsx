import React, { useState } from "react";
import { Session, SessionType } from "../../types";
import { Button } from "../ui/Button";

interface AddSessionFormProps {
  studentId: string;
  onSave: (sessionData: Omit<Session, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

export const AddSessionForm: React.FC<AddSessionFormProps> = ({
  studentId,
  onSave,
  onCancel,
}) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [topic, setTopic] = useState("");
  const [activities, setActivities] = useState("");
  const [sessionType, setSessionType] = useState<SessionType>(
    SessionType.Regular
  );
  const [notes, setNotes] = useState("");
  const [homeworkGiven, setHomeworkGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!date.trim()) {
      setError("Session date is required");
      return;
    }

    if (!topic.trim()) {
      setError("Topic is required");
      return;
    }

    const duration = parseInt(durationMinutes);
    if (isNaN(duration) || duration <= 0) {
      setError("Duration must be a positive number");
      return;
    }

    try {
      setIsLoading(true);

      const sessionData: Omit<Session, "id" | "createdAt"> = {
        studentId,
        date,
        startTime,
        durationMinutes: duration,
        topic,
        activities,
        sessionType,
        notes,
        homeworkGiven,
      };

      await onSave(sessionData);
    } catch (err) {
      setError("Failed to create session");
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

      {/* Date & Time Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Session Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duration (minutes) *
            </label>
            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="60"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Session Type
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value as SessionType)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={SessionType.Regular}>Regular Lesson</option>
              <option value={SessionType.ExamPrep}>Exam Prep</option>
              <option value={SessionType.TestReview}>Test Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topic & Activities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Content</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Topic *
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Quadratic equations – solving by factoring"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Activities
          </label>
          <textarea
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            placeholder="e.g., Exercises on factoring, worked examples, practice problems"
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Homework & Notes Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Additional Information
        </h3>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="homeworkGiven"
            checked={homeworkGiven}
            onChange={(e) => setHomeworkGiven(e.target.checked)}
            className="h-4 w-4 text-primary-600 rounded border-slate-300"
          />
          <label
            htmlFor="homeworkGiven"
            className="ml-2 text-sm text-slate-700"
          >
            Homework assigned this lesson
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about the session..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Add Session"}
        </Button>
      </div>
    </form>
  );
};
