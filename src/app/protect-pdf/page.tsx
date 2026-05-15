"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Lock } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";
import { protectPdf } from "@/lib/pdf/protect";
import { downloadBlob, formatFileSize } from "@/lib/utils/file-utils";
import type { PdfFile } from "@/types/pdf";

export default function ProtectPdfPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = files[0];

  const handleProtect = useCallback(async () => {
    if (!file || !password) return;
    setProcessing(true); setProgress(0); setError(null); setResult(null);
    try {
      const blob = await protectPdf(file.file, password, (p) => setProgress(p));
      setResult(blob);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed"); } finally { setProcessing(false); }
  }, [file, password]);

  const handleDownload = () => { if (result) downloadBlob(result, `${file?.name.replace(".pdf", "")}_protected.pdf`); };
  const handleReset = () => { setFiles([]); setResult(null); setError(null); setPassword(""); };

  const icon = <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;

  return (
    <ToolPageLayout title="Đặt mật khẩu PDF" description="Thêm mật khẩu bảo vệ cho tài liệu PDF của bạn." gradient="from-red-500 to-orange-500" icon={icon}>
      <div className="space-y-6">
        {!result ? (
          <>
            <FileUpload accept="pdf" multiple={false} files={files} onFilesChange={(f) => setFiles(f.slice(0, 1))} label="Kéo thả PDF để bảo mật" />
            {file && file.status !== "error" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Mật khẩu</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu bảo vệ" className="w-full max-w-sm px-4 py-3 rounded-xl border border-glass-border bg-surface-100 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                </div>
                {processing && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2"><span className="text-text-secondary">Đang xử lý mã hóa...</span><span className="text-text-primary font-medium">{progress}%</span></div>
                    <div className="h-2 rounded-full bg-surface-300 overflow-hidden"><motion.div className="h-full rounded-full gradient-brand" animate={{ width: `${progress}%` }} /></div>
                  </div>
                )}
                <div className="flex justify-center">
                  <button onClick={handleProtect} disabled={processing || !password} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                    {processing ? <><Loader2 className="h-5 w-5 animate-spin" /> Đang thiết lập...</> : <><Lock className="h-5 w-5" /> Đặt mật khẩu PDF</>}
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
            <h3 className="text-2xl font-bold text-text-primary mb-2">Đã bảo mật thành công!</h3>
            <p className="text-text-secondary mb-8">{formatFileSize(result.size)}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-semibold shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]"><Download className="h-5 w-5" /> Tải xuống PDF bảo mật</button>
              <button onClick={handleReset} className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all">Bảo mật tệp khác</button>
            </div>
          </motion.div>
        )}
      </div>
    </ToolPageLayout>
  );
}
