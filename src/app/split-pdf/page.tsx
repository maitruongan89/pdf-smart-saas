"use client";

/* ============================================
   PDF Smart — Split PDF Tool Page
   ============================================ */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Scissors, Download, Loader2 } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";
import { splitByPages, splitByRange, splitEveryN } from "@/lib/pdf/split";
import { downloadBlob, downloadMultipleBlobs } from "@/lib/utils/file-utils";
import type { PdfFile, SplitMode } from "@/types/pdf";

export default function SplitPdfPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [splitMode, setSplitMode] = useState<SplitMode>("pages");
  const [rangeInput, setRangeInput] = useState("1-3;4-6");
  const [everyN, setEveryN] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Blob[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = files[0];

  const handleSplit = useCallback(async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResults(null);

    try {
      let blobs: Blob[];

      switch (splitMode) {
        case "pages":
          blobs = await splitByPages(file.file, (p) => setProgress(p));
          break;
        case "range":
          blobs = await splitByRange(file.file, rangeInput, (p) => setProgress(p));
          break;
        case "every-n":
          blobs = await splitEveryN(file.file, everyN, (p) => setProgress(p));
          break;
        default:
          blobs = await splitByPages(file.file, (p) => setProgress(p));
      }

      setResults(blobs);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to split PDF");
    } finally {
      setProcessing(false);
    }
  }, [file, splitMode, rangeInput, everyN]);

  const handleDownloadAll = () => {
    if (results) {
      const baseName = file?.name.replace(".pdf", "") || "split";
      downloadMultipleBlobs(results, baseName, "pdf");
    }
  };

  const handleDownloadOne = (index: number) => {
    if (results && results[index]) {
      const baseName = file?.name.replace(".pdf", "") || "split";
      downloadBlob(results[index], `${baseName}_${index + 1}.pdf`);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults(null);
    setError(null);
    setProgress(0);
  };

  const modes: { id: SplitMode; label: string; desc: string }[] = [
    { id: "pages", label: "Every Page", desc: "Split into individual pages" },
    { id: "range", label: "By Range", desc: 'e.g. "1-3;4-6;7-10"' },
    { id: "every-n", label: "Every N Pages", desc: "Split every N pages" },
  ];

  return (
    <ToolPageLayout
      title="Tách PDF"
      description="Chia nhỏ một tệp PDF thành nhiều file dựa theo trang, phạm vi hoặc quy tắc tùy chỉnh."
      gradient="from-violet-500 to-purple-500"
      icon={
        <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <path d="M8.12 8.12 12 12" />
          <path d="M20 4 8.12 15.88" />
          <circle cx="6" cy="18" r="3" />
          <path d="M14.8 14.8 20 20" />
        </svg>
      }
    >
      <div className="space-y-6">
        {!results ? (
          <>
            <FileUpload
              accept="pdf"
              multiple={false}
              files={files}
              onFilesChange={(f) => setFiles(f.slice(0, 1))}
              label="Kéo thả file PDF để tách"
              description="Tải lên một file PDF để bắt đầu chia nhỏ"
            />

            {file && file.status !== "error" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Split Mode Selector */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Chế độ tách</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {modes.map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setSplitMode(mode.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          splitMode === mode.id
                            ? "border-brand-500/50 bg-brand-500/10 shadow-lg shadow-brand-500/10"
                            : "border-glass-border bg-glass hover:bg-glass-hover"
                        }`}
                      >
                        <div className="text-sm font-semibold text-text-primary">{mode.id === "pages" ? "Mọi trang" : mode.id === "range" ? "Theo phạm vi" : "Mỗi N trang"}</div>
                        <div className="text-xs text-text-muted mt-0.5">{mode.id === "pages" ? "Tách lẻ từng trang" : mode.id === "range" ? 'VD: "1-3;4-6"' : `Tách sau mỗi ${everyN} trang`}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                {splitMode === "range" && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Phạm vi trang</label>
                    <input
                      type="text"
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder="VD: 1-3; 4-6; 7-10"
                      className="w-full px-4 py-3 rounded-xl border border-glass-border bg-surface-100 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    />
                    <p className="text-xs text-text-muted mt-1">Sử dụng dấu chấm phẩy để ngăn cách các phạm vi. Dùng dấu phẩy cho trang lẻ: &quot;1,3,5; 6-10&quot;</p>
                  </div>
                )}

                {splitMode === "every-n" && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Số trang mỗi file</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={everyN}
                      onChange={(e) => setEveryN(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-32 px-4 py-3 rounded-xl border border-glass-border bg-surface-100 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    />
                  </div>
                )}

                {/* Progress */}
                {processing && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Đang xử lý tách PDF...</span>
                      <span className="text-text-primary font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-300 overflow-hidden">
                      <motion.div className="h-full rounded-full gradient-brand" animate={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Split Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSplit}
                    disabled={processing}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Đang tách...</>
                    ) : (
                      <><Scissors className="h-5 w-5" /> Bắt đầu Tách PDF</>
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
            <h3 className="text-2xl font-bold text-text-primary mb-2">Tách PDF thành công!</h3>
            <p className="text-text-secondary mb-8">Đã tạo {results.length} tệp tin</p>

            {/* File list */}
            <div className="max-w-md mx-auto space-y-2 mb-6">
              {results.map((blob, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-glass-border bg-glass">
                  <span className="text-sm text-text-primary">Phần {i + 1}</span>
                  <button onClick={() => handleDownloadOne(i)} className="text-sm text-brand-400 hover:text-brand-300 font-medium">
                    <Download className="h-4 w-4 inline mr-1" />Tải xuống
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={handleDownloadAll} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]">
                <Download className="h-5 w-5" /> Tải xuống tất cả (.zip)
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all">
                Tách tệp khác
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ToolPageLayout>
  );
}
