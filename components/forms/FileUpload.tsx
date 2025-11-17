import React, { useRef, useState } from "react";
import { HomeworkSubmission } from "../../types";

interface FileUploadProps {
  onFileSelect: (submission: HomeworkSubmission | null) => void;
  maxSizeBytes?: number; // default 10MB
  acceptedFormats?: string[]; // e.g., ["pdf", "doc", "docx", "jpg", "png"]
  label?: string;
  existingFile?: HomeworkSubmission;
  disabled?: boolean;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_FORMATS = [
  "pdf",
  "doc",
  "docx",
  "txt",
  "jpg",
  "jpeg",
  "png",
  "xlsx",
  "xls",
];

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_FORMATS,
  label = "Upload File",
  existingFile,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileExtension = (fileName: string): string => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${formatFileSize(maxSizeBytes)} limit`;
    }

    // Check file format
    const extension = getFileExtension(file.name);
    if (!acceptedFormats.includes(extension)) {
      return `File format ".${extension}" not allowed. Accepted formats: ${acceptedFormats.join(
        ", "
      )}`;
    }

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // Read file as base64
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };

      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Extract base64 data (remove data URL prefix)
          const base64Data = reader.result.split(",")[1] || reader.result;

          const submission: HomeworkSubmission = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadDate: new Date().toISOString(),
            fileData: base64Data,
          };

          setSelectedFile(file);
          onFileSelect(submission);
          setError("");
        }
      };

      reader.onerror = () => {
        setError("Failed to read file");
        setSelectedFile(null);
        onFileSelect(null);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process file");
      setSelectedFile(null);
      onFileSelect(null);
      console.error(err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={disabled || loading}
          accept={acceptedFormats.map((f) => `.${f}`).join(",")}
          className="hidden"
          aria-label={label}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || loading}
          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Uploading..." : "Choose File"}
        </button>

        {selectedFile && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Upload Progress */}
      {loading && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-500 h-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-500">{uploadProgress}%</span>
        </div>
      )}

      {/* Selected File Display */}
      {selectedFile && !loading && (
        <div className="p-3 bg-primary-50 border border-primary-200 rounded-md">
          <div className="flex items-start gap-2">
            <div className="text-primary-600 flex-shrink-0">📄</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-600">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Existing File Display */}
      {existingFile && !selectedFile && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start gap-2">
            <div className="text-blue-600 flex-shrink-0">📎</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {existingFile.fileName}
              </p>
              <p className="text-xs text-slate-600">
                {formatFileSize(existingFile.fileSize)} • Uploaded{" "}
                {new Date(existingFile.uploadDate).toLocaleDateString()}
              </p>
              <button
                type="button"
                onClick={() => {
                  // Download logic
                  const link = document.createElement("a");
                  link.href = `data:${existingFile.fileType};base64,${existingFile.fileData}`;
                  link.download = existingFile.fileName;
                  link.click();
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* File Format Help Text */}
      <p className="text-xs text-slate-500">
        Accepted formats: {acceptedFormats.join(", ")} • Max size:{" "}
        {formatFileSize(maxSizeBytes)}
      </p>
    </div>
  );
};
