"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, FileImage } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";
import { pdfToImages } from "@/lib/pdf/pdf-to-image";
import { downloadBlob, downloadMultipleBlobs } from "@/lib/utils/file-utils";
import type { PdfFile } from "@/types/pdf";

export default function PdfToImagePage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(2);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Blob[] | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const file = files[0];

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setProcessing(true); setProgress(0); setError(null); setResults(null); setPreviews([]);
    try {
      const blobs = await pdfToImages(file.file, { scale: quality, format, quality: format === "jpeg" ? 0.92 : 1, onProgress: (p) => setProgress(p) });
      setResults(blobs);
      setPreviews(blobs.slice(0, 6).map((b) => URL.createObjectURL(b)));
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); } finally { setProcessing(false); }
  }, [file, format, quality]);

  const handleDownloadAll = () => { if (results) { downloadMultipleBlobs(results, file?.name.replace(".pdf", "") || "page", format === "jpeg" ? "jpg" : "png"); } };
  const handleDownloadOne = (i: number) => { if (results?.[i]) downloadBlob(results[i], `page_${i + 1}.${format === "jpeg" ? "jpg" : "png"}`); };
  const handleReset = () => { previews.forEach((u) => URL.revokeObjectURL(u)); setFiles([]); setResults(null); setPreviews([]); setError(null); };

  const icon = <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><circle cx="10" cy="12" r="2" /><path d="m20 17-1.3-1.3a2.4 2.4 0 0 0-3.4 0L9 22" /></svg>;

  return (
    <ToolPageLayout title="PDF to Image" description="Convert each PDF page to a high-quality JPG or PNG image." gradient="from-rose-500 to-pink-500" icon={icon}>
      <div className="space-y-6">
        {!results ? (
          <>
            <FileUpload accept="pdf" multiple={false} files={files} onFilesChange={(f) => setFiles(f.slice(0, 1))} label="Drop a PDF to convert to images" />
            {file && file.status !== "error" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Format</label>
                  <div className="flex gap-3">
                    {(["png", "jpeg"] as const).map((f) => (
                      <button key={f} onClick={() => setFormat(f)} className={`px-6 py-2.5 rounded-xl text-sm font-semibold uppercase transition-all ${format === f ? "gradient-brand text-white shadow-lg shadow-brand-500/25" : "border border-glass-border text-text-secondary hover:bg-glass-hover"}`}>{f === "jpeg" ? "JPG" : f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Quality</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ v: 1, l: "Standard", d: "72 DPI" }, { v: 2, l: "High", d: "144 DPI" }, { v: 3, l: "Ultra", d: "216 DPI" }].map((q) => (
                      <button key={q.v} onClick={() => setQuality(q.v)} className={`p-3 rounded-xl border text-center transition-all ${quality === q.v ? "border-brand-500/50 bg-brand-500/10" : "border-glass-border bg-glass hover:bg-glass-hover"}`}>
                        <div className="text-sm font-semibold text-text-primary">{q.l}</div>
                        <div className="text-xs text-text-muted">{q.d}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {processing && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2"><span className="text-text-secondary">Converting...</span><span className="text-text-primary font-medium">{progress}%</span></div>
                    <div className="h-2 rounded-full bg-surface-300 overflow-hidden"><motion.div className="h-full rounded-full gradient-brand" animate={{ width: `${progress}%` }} /></div>
                  </div>
                )}
                <div className="flex justify-center">
                  <button onClick={handleConvert} disabled={processing} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                    {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Converting...</> : <><FileImage className="h-5 w-5" /> Convert to {format.toUpperCase()}</>}
                  </button>
                </div>
                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">{error}</div>}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4">
              <svg className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-6">Converted {results.length} Pages!</h3>
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {previews.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-glass-border bg-surface-100">
                    <img src={url} alt={`Page ${i + 1}`} className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => handleDownloadOne(i)} className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium backdrop-blur-sm"><Download className="h-3 w-3 inline mr-1" />Page {i+1}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={handleDownloadAll} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]"><Download className="h-5 w-5" /> Download All</button>
              <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all">Convert Another</button>
            </div>
          </motion.div>
        )}
      </div>
    </ToolPageLayout>
  );
}
