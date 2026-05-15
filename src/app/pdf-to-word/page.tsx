"use client";

import { useState } from "react";
import { FileText, Download, Loader2, FileCode, CheckCircle2 } from "lucide-react";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import FileUpload from "@/components/pdf/FileUpload";

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "converting" | "completed">("idle");

  const handleConvert = () => {
    if (!file) return;
    
    setStatus("uploading");
    
    // Simulate conversion process
    setTimeout(() => {
      setStatus("converting");
      setTimeout(() => {
        setStatus("completed");
      }, 3000);
    }, 1500);
  };

  const handleDownload = () => {
    // In a real app, this would download the converted .docx file
    alert("Đây là bản demo tính năng Pro. Trong thực tế, file Word sẽ được tải về tại đây.");
  };

  return (
    <ToolPageLayout
      title="PDF sang Word"
      description="Chuyển đổi tài liệu PDF sang định dạng Microsoft Word (.docx) với độ chính xác cao nhất, giữ nguyên định dạng và hình ảnh."
      gradient="from-blue-600 to-indigo-500"
      icon={<FileText className="h-7 w-7 text-white" />}
      isPro={true}
    >
      <div className="max-w-2xl mx-auto">
        {status === "idle" ? (
          <div className="space-y-6">
            <FileUpload
              accept={{ "application/pdf": [".pdf"] }}
              onFileSelect={(files) => setFile(files[0])}
              label="Chọn file PDF để chuyển sang Word"
            />
            
            {file && (
              <div className="flex justify-center">
                <button
                  onClick={handleConvert}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-brand text-white font-bold shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all"
                >
                  <FileCode className="h-5 w-5" />
                  Bắt đầu Chuyển đổi
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-10 rounded-3xl bg-glass border border-glass-border text-center">
            {status === "uploading" && (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-brand-400 animate-spin mx-auto" />
                <h3 className="text-xl font-bold text-text-primary">Đang tải file lên...</h3>
                <p className="text-text-secondary text-sm">Vui lòng không đóng trình duyệt</p>
              </div>
            )}
            
            {status === "converting" && (
              <div className="space-y-4">
                <div className="relative h-12 w-12 mx-auto">
                  <Loader2 className="h-12 w-12 text-brand-400 animate-spin absolute inset-0" />
                  <FileText className="h-6 w-6 text-brand-400 absolute inset-0 m-auto" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Đang phân tích cấu trúc & chuyển đổi...</h3>
                <p className="text-text-secondary text-sm italic">Sử dụng AI để giữ nguyên định dạng trang...</p>
              </div>
            )}
            
            {status === "completed" && (
              <div className="space-y-6">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Chuyển đổi thành công!</h3>
                  <p className="text-text-secondary text-sm">File Word của bạn đã sẵn sàng để tải về.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500 text-white font-bold shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition-all"
                  >
                    <Download className="h-5 w-5" />
                    Tải file Word (.docx)
                  </button>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3.5 rounded-2xl glass text-text-primary font-semibold hover:bg-glass-hover transition-all"
                  >
                    Chuyển đổi file khác
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
