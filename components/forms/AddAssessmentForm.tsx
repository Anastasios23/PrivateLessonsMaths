import React, { useState } from "react";
import { Assessment } from "../../types";
import { Button } from "../ui/Button";

interface AddAssessmentFormProps {
  studentId: string;
  onSave: (
    assessmentData: Omit<Assessment, "id" | "createdAt">
  ) => Promise<void>;
  onCancel: () => void;
}

export const AddAssessmentForm: React.FC<AddAssessmentFormProps> = ({
  studentId,
  onSave,
  onCancel,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!score || parseFloat(score) < 0) {
      setError("Valid score is required");
      return;
    }

    if (!maxScore || parseFloat(maxScore) <= 0) {
      setError("Max score must be greater than 0");
      return;
    }

    const scoreNum = parseFloat(score);
    const maxScoreNum = parseFloat(maxScore);

    if (scoreNum > maxScoreNum) {
      setError("Score cannot exceed max score");
      return;
    }

    try {
      setIsLoading(true);

      const assessmentData: Omit<Assessment, "id" | "createdAt"> = {
        studentId,
        date,
        description,
        score: scoreNum,
        maxScore: maxScoreNum,
        notes: notes || undefined,
      };

      await onSave(assessmentData);
    } catch (err) {
      setError("Failed to create assessment");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const percentage =
    score && maxScore
      ? Math.round((parseFloat(score) / parseFloat(maxScore)) * 100)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Date Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Test/Exam Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date
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
            Description *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., School test – Functions"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Scores Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Scores</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Score Achieved *
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g., 82"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Max Score *
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              placeholder="e.g., 100"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {percentage > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-blue-600">{percentage}%</span>
              {percentage >= 80 && (
                <span className="text-blue-600 ml-2">✓ Excellent</span>
              )}
              {percentage >= 70 && percentage < 80 && (
                <span className="text-blue-600 ml-2">✓ Very Good</span>
              )}
              {percentage >= 60 && percentage < 70 && (
                <span className="text-blue-600 ml-2">✓ Good</span>
              )}
              {percentage >= 50 && percentage < 60 && (
                <span className="text-amber-600 ml-2">⚠ Satisfactory</span>
              )}
              {percentage < 50 && (
                <span className="text-red-600 ml-2">✗ Needs improvement</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any feedback or notes about the assessment..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Assessment"}
        </Button>
      </div>
    </form>
  );
};
