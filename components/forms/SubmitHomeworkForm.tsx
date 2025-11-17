import React, { useState } from "react";
import { Homework, HomeworkSubmission } from "../../types";
import { FileUpload } from "./FileUpload";
import { Button } from "../ui/Button";

interface SubmitHomeworkFormProps {
  homework: Homework;
  onSave: (homeworkData: Homework) => Promise<void>;
  onCancel: () => void;
}

export const SubmitHomeworkForm: React.FC<SubmitHomeworkFormProps> = ({
  homework,
  onSave,
  onCancel,
}) => {
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionFile, setSubmissionFile] =
    useState<HomeworkSubmission | null>(homework.submissionFile || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (file: HomeworkSubmission | null) => {
    setSubmissionFile(file);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!submissionFile) {
      setError("Please upload a file");
      return;
    }

    try {
      setIsLoading(true);

      const updatedHomework: Homework = {
        ...homework,
        status: "submitted",
        submissionFile,
        notes: submissionNotes || homework.notes,
      };

      await onSave(updatedHomework);
    } catch (err) {
      setError("Failed to submit homework");
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

      {/* Homework Details */}
      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
        <h3 className="text-sm font-semibold text-slate-800">
          {homework.description}
        </h3>
        <p className="text-xs text-slate-600">
          Due: {new Date(homework.dueDate).toLocaleDateString()}
        </p>
        {homework.notes && (
          <p className="text-xs text-slate-700">
            <span className="font-medium">Notes:</span> {homework.notes}
          </p>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Submit Your Work
        </h3>

        <FileUpload
          onFileSelect={handleFileSelect}
          label="Upload Homework File"
          maxSizeBytes={50 * 1024 * 1024} // 50MB for student submissions
          acceptedFormats={[
            "pdf",
            "doc",
            "docx",
            "txt",
            "jpg",
            "jpeg",
            "png",
            "xlsx",
            "xls",
            "ppt",
            "pptx",
            "zip",
          ]}
          existingFile={homework.submissionFile}
          disabled={isLoading}
        />
      </div>

      {/* Submission Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes About Your Submission (optional)
        </label>
        <textarea
          value={submissionNotes}
          onChange={(e) => setSubmissionNotes(e.target.value)}
          placeholder="Any notes about your work, difficulties, or questions..."
          rows={3}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !submissionFile}>
          {isLoading ? "Submitting..." : "Submit Homework"}
        </Button>
      </div>
    </form>
  );
};
