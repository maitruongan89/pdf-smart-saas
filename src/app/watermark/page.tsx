"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";
import { addWatermark } from "@/lib/pdf/watermark";
import { downloadBlob, formatFileSize } from "@/lib/utils/file-utils";
import type { PdfFile, WatermarkPosition } from "@/types/pdf";

export default function WatermarkPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [position, setPosition] = useState<WatermarkPosition>("diagonal");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = files[0];

  const handleApply = useCallback(async () => {
    if (!file) return;
    setProcessing(true); setProgress(0); setError(null); setResult(null);
    try {
      const blob = await addWatermark(file.file, {
        text, fontSize, opacity, color: { r: 0.5, g: 0.5, b: 0.5 }, rotation: 0, position,
        onProgress: (p) => setProgress(p),
      });
      setResult(blob);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); } finally { setProcessing(false); }
  }, [file, text, fontSize, opacity, position]);

  const handleDownload = () => { if (result) downloadBlob(result, `${file?.name.replace(".pdf", "")}_watermarked.pdf`); };
  const handleReset = () => { setFiles([]); setResult(null); setError(null); };

  const positions: { id: WatermarkPosition; label: string }[] = [
    { id: "diagonal", label: "Diagonal" }, { id: "center", label: "Center" },
    { id: "top-left", label: "Top Left" }, { id: "top-right", label: "Top Right" },
    { id: "bottom-left", label: "Bottom Left" }, { id: "bottom-right", label: "Bottom Right" },
  ];

  const icon = <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 14.69c1.46 0 2.65-1.2 2.65-2.68 0-.76-.38-1.5-1.13-2.12-.75-.61-1.28-1.36-1.52-2.19-.24.83-.77 1.58-1.52 2.19-.75.62-1.13 1.36-1.13 2.12 0 1.48 1.19 2.68 2.65 2.68z" /><path d="M17 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S17.29 6.75 17 5.3c-.29 1.45-1.14 2.84-2.29 3.76S13 11.1 13 12.25c0 2.22 1.8 4.05 4 4.05z" /></svg>;

  return (
    <ToolPageLayout title="Add Watermark" description="Add text watermarks to every page of your PDF." gradient="from-sky-500 to-blue-500" icon={icon}>
      <div className="space-y-6">
        {!result ? (
          <>
            <FileUpload accept="pdf" multiple={false} files={files} onFilesChange={(f) => setFiles(f.slice(0, 1))} label="Drop a PDF to watermark" />
            {file && file.status !== "error" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Watermark Text</label>
                  <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter watermark text" className="w-full px-4 py-3 rounded-xl border border-glass-border bg-surface-100 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Font Size: {fontSize}pt</label>
                    <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-2 rounded-full bg-surface-300 appearance-none cursor-pointer accent-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Opacity: {Math.round(opacity * 100)}%</label>
                    <input type="range" min={5} max={100} value={opacity * 100} onChange={(e) => setOpacity(parseInt(e.target.value) / 100)} className="w-full h-2 rounded-full bg-surface-300 appearance-none cursor-pointer accent-brand-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    {positions.map((p) => (
                      <button key={p.id} onClick={() => setPosition(p.id)} className={`py-2.5 rounded-xl text-sm font-medium transition-all ${position === p.id ? "gradient-brand text-white shadow-lg shadow-brand-500/25" : "border border-glass-border text-text-secondary hover:bg-glass-hover"}`}>{p.label}</button>
                    ))}
                  </div>
                </div>
                {processing && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2"><span className="text-text-secondary">Applying watermark...</span><span className="text-text-primary font-medium">{progress}%</span></div>
                    <div className="h-2 rounded-full bg-surface-300 overflow-hidden"><motion.div className="h-full rounded-full gradient-brand" animate={{ width: `${progress}%` }} /></div>
                  </div>
                )}
                <div className="flex justify-center">
                  <button onClick={handleApply} disabled={processing || !text.trim()} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                    {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Applying...</> : "Apply Watermark"}
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
            <h3 className="text-2xl font-bold text-text-primary mb-2">Watermark Applied!</h3>
            <p className="text-text-secondary mb-8">{formatFileSize(result.size)}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]"><Download className="h-5 w-5" /> Download</button>
              <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all">Watermark Another</button>
            </div>
          </motion.div>
        )}
      </div>
    </ToolPageLayout>
  );
}
