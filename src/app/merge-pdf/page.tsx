"use client";

/* ============================================
   PDF Smart — Merge PDF Tool Page
   ============================================ */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Layers, Download, Loader2 } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";
import { mergePdfs } from "@/lib/pdf/merge";
import { downloadBlob, formatFileSize } from "@/lib/utils/file-utils";
import type { PdfFile } from "@/types/pdf";

export default function MergePdfPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validFiles = files.filter((f) => f.status !== "error");

  const handleMerge = useCallback(async () => {
    if (validFiles.length < 2) return;

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const pdfFiles = validFiles.map((f) => f.file);
      const merged = await mergePdfs(pdfFiles, (p) => setProgress(p));
      setResult(merged);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to merge PDFs");
    } finally {
      setProcessing(false);
    }
  }, [validFiles]);

  const handleDownload = () => {
    if (result) {
      downloadBlob(result, "merged.pdf");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <ToolPageLayout
      title="Ghép PDF"
      description="Kết hợp nhiều file PDF thành một tài liệu duy nhất. Nhanh chóng và bảo mật."
      gradient="from-indigo-500 to-violet-500"
      icon={
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
      }
    >
      <div className="space-y-6">
        {!result ? (
          <>
            {/* File Upload */}
            <FileUpload
              accept="pdf"
              multiple
              files={files}
              onFilesChange={setFiles}
              label="Kéo thả file PDF vào đây để ghép"
              description="Thêm 2 hoặc nhiều file PDF để gộp chúng lại"
            />

            {/* Merge Button */}
            {validFiles.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Progress Bar */}
                {processing && (
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Đang ghép {validFiles.length} tệp...</span>
                      <span className="text-text-primary font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-300 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gradient-brand"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleMerge}
                  disabled={processing}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Layers className="h-5 w-5" />
                      Ghép {validFiles.length} file PDF
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}
          </>
        ) : (
          /* Result */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 mb-6">
              <svg className="h-10 w-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Ghép PDF thành công!
            </h3>
            <p className="text-text-secondary mb-8">
              {validFiles.length} tệp đã gộp • {formatFileSize(result.size)}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02]"
              >
                <Download className="h-5 w-5" />
                Tải xuống file đã ghép
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all"
              >
                Tiếp tục ghép file khác
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ToolPageLayout>
  );
}
