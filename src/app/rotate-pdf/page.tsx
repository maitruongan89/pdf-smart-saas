"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";
import { rotatePdfPages } from "@/lib/pdf/protect";
import { downloadBlob, formatFileSize } from "@/lib/utils/file-utils";
import type { PdfFile } from "@/types/pdf";

export default function RotatePdfPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [rotation, setRotation] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = files[0];

  const handleRotate = useCallback(async () => {
    if (!file) return;
    setProcessing(true); setProgress(0); setError(null); setResult(null);
    try {
      // Rotate all pages by the selected amount
      const { PDFDocument } = await import("pdf-lib");
      const buffer = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdf.getPages();
      const rotMap = new Map<number, number>();
      pages.forEach((_, i) => rotMap.set(i, rotation));
      const blob = await rotatePdfPages(file.file, rotMap, (p) => setProgress(p));
      setResult(blob);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); } finally { setProcessing(false); }
  }, [file, rotation]);

  const handleDownload = () => { if (result) downloadBlob(result, `${file?.name.replace(".pdf", "")}_rotated.pdf`); };
  const handleReset = () => { setFiles([]); setResult(null); setError(null); };

  const icon = <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>;

  return (
    <ToolPageLayout title="Rotate PDF" description="Rotate all pages of your PDF in any direction." gradient="from-emerald-500 to-teal-500" icon={icon}>
      <div className="space-y-6">
        {!result ? (
          <>
            <FileUpload accept="pdf" multiple={false} files={files} onFilesChange={(f) => setFiles(f.slice(0, 1))} label="Drop a PDF to rotate" />
            {file && file.status !== "error" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Rotation</label>
                  <div className="flex gap-3 justify-center">
                    {[90, 180, 270].map((deg) => (
                      <button key={deg} onClick={() => setRotation(deg)} className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${rotation === deg ? "gradient-brand text-white shadow-lg shadow-brand-500/25" : "border border-glass-border text-text-secondary hover:bg-glass-hover"}`}>
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
                {processing && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2"><span className="text-text-secondary">Rotating...</span><span className="text-text-primary font-medium">{progress}%</span></div>
                    <div className="h-2 rounded-full bg-surface-300 overflow-hidden"><motion.div className="h-full rounded-full gradient-brand" animate={{ width: `${progress}%` }} /></div>
                  </div>
                )}
                <div className="flex justify-center">
                  <button onClick={handleRotate} disabled={processing} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                    {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Rotating...</> : `Rotate ${rotation}°`}
                  </button>
                </div>
                {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">{error}</div>}
              </motion.div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 mb-6">
              <svg className="h-10 w-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">Rotated Successfully!</h3>
            <p className="text-text-secondary mb-8">{formatFileSize(result.size)}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]"><Download className="h-5 w-5" /> Download</button>
              <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all">Rotate Another</button>
            </div>
          </motion.div>
        )}
      </div>
    </ToolPageLayout>
  );
}
