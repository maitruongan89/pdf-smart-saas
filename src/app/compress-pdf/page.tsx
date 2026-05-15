"use client";

/* ============================================
   PDF Smart — Compress PDF Tool Page
   ============================================ */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";
import { compressPdf } from "@/lib/pdf/compress";
import { downloadBlob, formatFileSize } from "@/lib/utils/file-utils";
import type { PdfFile, CompressionLevel } from "@/types/pdf";

export default function CompressPdfPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; originalSize: number; compressedSize: number; ratio: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = files[0];

  const handleCompress = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const res = await compressPdf(file.file, {
        level,
        onProgress: (p) => setProgress(p),
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compress PDF");
    } finally {
      setProcessing(false);
    }
  }, [file, level]);

  const handleDownload = () => {
    if (result) {
      const name = file?.name.replace(".pdf", "") || "compressed";
      downloadBlob(result.blob, `${name}_compressed.pdf`);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const levels: { id: CompressionLevel; label: string; desc: string; color: string }[] = [
    { id: "low", label: "Low", desc: "Best quality, less compression", color: "text-emerald-400" },
    { id: "medium", label: "Medium", desc: "Good balance of quality & size", color: "text-amber-400" },
    { id: "high", label: "High", desc: "Smallest file, lower quality", color: "text-red-400" },
  ];

  return (
    <ToolPageLayout
      title="Nén PDF"
      description="Giảm dung lượng tệp PDF trong khi vẫn giữ nguyên chất lượng. Nhanh chóng và miễn phí."
      gradient="from-cyan-500 to-blue-500"
      icon={
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 14 10 14 10 20" />
          <polyline points="20 10 14 10 14 4" />
          <line x1="14" y1="10" x2="21" y2="3" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      }
    >
      <div className="space-y-6">
        {!result ? (
          <>
            <FileUpload
              accept="pdf"
              multiple={false}
              files={files}
              onFilesChange={(f) => setFiles(f.slice(0, 1))}
              label="Kéo thả file PDF vào đây để nén"
            />

            {file && file.status !== "error" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Compression Level */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Mức độ nén</label>
                  <div className="grid grid-cols-3 gap-3">
                    {levels.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLevel(l.id)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          level === l.id
                            ? "border-brand-500/50 bg-brand-500/10 shadow-lg shadow-brand-500/10"
                            : "border-glass-border bg-glass hover:bg-glass-hover"
                        }`}
                      >
                        <div className={`text-sm font-bold ${l.color}`}>{l.id === "low" ? "Thấp" : l.id === "medium" ? "Vừa" : "Cao"}</div>
                        <div className="text-xs text-text-muted mt-1">{l.id === "low" ? "Chất lượng tốt nhất" : l.id === "medium" ? "Cân bằng tốt" : "Dung lượng nhỏ nhất"}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {processing && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Đang nén...</span>
                      <span className="text-text-primary font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-300 overflow-hidden">
                      <motion.div className="h-full rounded-full gradient-brand" animate={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={handleCompress}
                    disabled={processing}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Đang nén...</>
                    ) : (
                      "Bắt đầu Nén PDF"
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
            <h3 className="text-2xl font-bold text-text-primary mb-4">Nén PDF thành công!</h3>

            {/* Size comparison */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-sm text-text-muted mb-1">Gốc</div>
                <div className="text-lg font-bold text-text-primary">{formatFileSize(result.originalSize)}</div>
              </div>
              <div className="text-2xl text-text-muted">→</div>
              <div className="text-center">
                <div className="text-sm text-text-muted mb-1">Đã nén</div>
                <div className="text-lg font-bold text-emerald-400">{formatFileSize(result.compressedSize)}</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-400">
                -{result.ratio}%
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]">
                <Download className="h-5 w-5" /> Tải xuống PDF đã nén
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all">
                Nén tệp khác
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ToolPageLayout>
  );
}
