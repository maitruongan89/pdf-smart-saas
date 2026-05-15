"use client";

/* ============================================
   PDF Smart — File Upload Component
   Premium drag & drop file upload with animations
   ============================================ */

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, Plus } from "lucide-react";
import { formatFileSize, generateId, isPdfFile, isImageFile } from "@/lib/utils/file-utils";
import type { PdfFile } from "@/types/pdf";

interface FileUploadProps {
  /** Accept PDF files only, or images too */
  accept: "pdf" | "image" | "both";
  /** Allow multiple files */
  multiple?: boolean;
  /** Max file size in bytes */
  maxSize?: number;
  /** Max number of files */
  maxFiles?: number;
  /** Currently uploaded files */
  files: PdfFile[];
  /** Callback when files are added */
  onFilesChange: (files: PdfFile[]) => void;
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
}

const acceptMap: Record<string, string> = {
  pdf: ".pdf,application/pdf",
  image: ".jpg,.jpeg,.png,.webp,.bmp,.gif,image/*",
  both: ".pdf,application/pdf,.jpg,.jpeg,.png,.webp,.bmp,.gif,image/*",
};

export default function FileUpload({
  accept = "pdf",
  multiple = true,
  maxSize = 500 * 1024 * 1024, // 500MB
  maxFiles = 50,
  files,
  onFilesChange,
  label = "Drop your files here",
  description,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File too large (max ${formatFileSize(maxSize)})`;
      }
      if (accept === "pdf" && !isPdfFile(file)) {
        return "Only PDF files are accepted";
      }
      if (accept === "image" && !isImageFile(file)) {
        return "Only image files are accepted";
      }
      return null;
    },
    [accept, maxSize]
  );

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const remaining = maxFiles - files.length;
      const toAdd = fileArray.slice(0, remaining);

      const pdfFiles: PdfFile[] = toAdd
        .map((file) => {
          const error = validateFile(file);
          return {
            id: generateId(),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: error ? "error" : "pending",
            progress: 0,
            error: error || undefined,
          } as PdfFile;
        });

      onFilesChange([...files, ...pdfFiles]);
    },
    [files, maxFiles, onFilesChange, validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const hasFiles = files.length > 0;

  return (
    <div className="w-full">
      {/* Upload Zone */}
      {!hasFiles && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`upload-zone relative rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all ${
            isDragOver ? "dragover" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptMap[accept]}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            id="file-upload-input"
          />

          <motion.div
            animate={isDragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center"
          >
            <div
              className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all ${
                isDragOver
                  ? "bg-brand-500/20 shadow-lg shadow-brand-500/25"
                  : "bg-surface-200"
              }`}
            >
              <Upload
                className={`h-9 w-9 transition-colors ${
                  isDragOver ? "text-brand-400" : "text-text-muted"
                }`}
              />
            </div>

            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {label}
            </h3>
            <p className="text-sm text-text-muted mb-4">
              {description ||
                `or click to browse • ${accept === "pdf" ? "PDF" : accept === "image" ? "JPG, PNG, WEBP" : "PDF & images"} files • Max ${formatFileSize(maxSize)}`}
            </p>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-lg shadow-brand-500/25 hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4" />
              Choose Files
            </div>
          </motion.div>

          {/* Animated border gradient */}
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
              }}
            />
          )}
        </motion.div>
      )}

      {/* File List */}
      {hasFiles && (
        <div className="space-y-3">
          {/* Add more files button */}
          <div
            className="upload-zone rounded-xl p-4 text-center cursor-pointer flex items-center justify-center gap-2 text-sm font-medium text-text-muted hover:text-text-primary"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptMap[accept]}
              multiple={multiple}
              onChange={handleInputChange}
              className="hidden"
            />
            <Plus className="h-4 w-4" />
            Add more files
          </div>

          {/* File items */}
          <AnimatePresence mode="popLayout">
            {files.map((pdfFile) => (
              <motion.div
                key={pdfFile.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  pdfFile.status === "error"
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-glass-border bg-glass"
                }`}
              >
                {/* File icon */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
                    pdfFile.status === "error"
                      ? "bg-red-500/10"
                      : "bg-brand-500/10"
                  }`}
                >
                  <File
                    className={`h-5 w-5 ${
                      pdfFile.status === "error"
                        ? "text-red-400"
                        : "text-brand-400"
                    }`}
                  />
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {pdfFile.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {pdfFile.error || formatFileSize(pdfFile.size)}
                    {pdfFile.pageCount && ` • ${pdfFile.pageCount} pages`}
                  </p>
                </div>

                {/* Progress / Status */}
                {pdfFile.status === "processing" && (
                  <div className="w-16">
                    <div className="h-1.5 rounded-full bg-surface-300 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-brand"
                        initial={{ width: 0 }}
                        animate={{ width: `${pdfFile.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {pdfFile.status === "done" && (
                  <span className="text-xs font-medium text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-lg">
                    Done
                  </span>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(pdfFile.id);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
