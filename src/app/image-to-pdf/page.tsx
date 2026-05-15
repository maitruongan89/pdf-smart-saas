"use client";

/* ============================================
   PDF Smart — Image to PDF Tool Page
   ============================================ */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Image as ImageIcon } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";
import { imagesToPdf } from "@/lib/pdf/image-to-pdf";
import { downloadBlob, formatFileSize } from "@/lib/utils/file-utils";
import type { PdfFile, PaperSize } from "@/types/pdf";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [paperSize, setPaperSize] = useState<PaperSize>("a4");
  const [margin, setMargin] = useState(40);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validFiles = files.filter((f) => f.status !== "error");

  const handleConvert = useCallback(async () => {
    if (validFiles.length === 0) return;

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const imageFiles = validFiles.map((f) => f.file);
      const blob = await imagesToPdf(imageFiles, {
        paperSize,
        margin,
        quality: 0.92,
        onProgress: (p) => setProgress(p),
      });
      setResult(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert images to PDF");
    } finally {
      setProcessing(false);
    }
  }, [validFiles, paperSize, margin]);

  const handleDownload = () => {
    if (result) downloadBlob(result, "images.pdf");
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const paperSizes: { id: PaperSize; label: string }[] = [
    { id: "a4", label: "A4" },
    { id: "letter", label: "Letter" },
    { id: "a3", label: "A3" },
    { id: "legal", label: "Legal" },
    { id: "fit", label: "Fit to Image" },
  ];

  return (
    <ToolPageLayout
      title="Image to PDF"
      description="Convert JPG, PNG, and WEBP images to a PDF document. Drag & drop to reorder."
      gradient="from-amber-500 to-orange-500"
      icon={
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      }
    >
      <div className="space-y-6">
        {!result ? (
          <>
            <FileUpload
              accept="image"
              multiple
              files={files}
              onFilesChange={setFiles}
              label="Drop images here"
              description="JPG, PNG, WEBP • Each image becomes a page in the PDF"
            />

            {validFiles.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Paper Size */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Paper Size</label>
                  <div className="flex flex-wrap gap-2">
                    {paperSizes.map((ps) => (
                      <button
                        key={ps.id}
                        onClick={() => setPaperSize(ps.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          paperSize === ps.id
                            ? "gradient-brand text-white shadow-lg shadow-brand-500/25"
                            : "border border-glass-border text-text-secondary hover:text-text-primary hover:bg-glass-hover"
                        }`}
                      >
                        {ps.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Margin */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Margin: {Math.round(margin / 72 * 25.4)}mm
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={144}
                    step={8}
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value))}
                    className="w-full max-w-xs h-2 rounded-full bg-surface-300 appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                {processing && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Converting {validFiles.length} images...</span>
                      <span className="text-text-primary font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-300 overflow-hidden">
                      <motion.div className="h-full rounded-full gradient-brand" animate={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={handleConvert}
                    disabled={processing}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Converting...</>
                    ) : (
                      <><ImageIcon className="h-5 w-5" /> Convert {validFiles.length} Image{validFiles.length > 1 ? "s" : ""} to PDF</>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">{error}</div>
                )}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 mb-6">
              <svg className="h-10 w-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">Converted Successfully!</h3>
            <p className="text-text-secondary mb-8">{validFiles.length} images → 1 PDF • {formatFileSize(result.size)}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]">
                <Download className="h-5 w-5" /> Download PDF
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all">
                Convert More Images
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ToolPageLayout>
  );
}
