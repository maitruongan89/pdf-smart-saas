"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToolPageLayout from "@/components/layout/ToolPageLayout";
import { 
  Camera, 
  Plus, 
  Trash2, 
  Download, 
  RotateCw, 
  Loader2, 
  Image as ImageIcon,
  Check,
  Zap,
  ArrowRight
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

interface ScannedPage {
  id: string;
  originalData: string; // base64
  processedData: string; // base64
  filter: "none" | "grayscale" | "high-contrast";
}

export default function ScanPdfPage() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<ScannedPage["filter"]>("high-contrast");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const applyFilter = (base64: string, filterType: ScannedPage["filter"]): string => {
    if (filterType === "none") return base64;
    
    // Create an off-screen canvas for processing
    const img = new Image();
    img.src = base64;
    
    // Since Image loading is async, we would ideally need a promise-based applyFilter
    // For this implementation, we'll keep it simple by using CSS filters on the UI 
    // and processing only when exporting, but to keep the ScannedPage state correct
    // we'll implement a basic sync-like processing using a helper if possible or just 
    // update the implementation to process during export.
    
    // Let's improve the logic: we store the filter type in the page object, 
    // and apply it during rendering/exporting.
    return base64;
  };

  // Improved filtering: process image on a canvas and return new base64
  const processImage = (base64: string, filterType: ScannedPage["filter"]): Promise<string> => {
    return new Promise((resolve) => {
      if (filterType === "none") return resolve(base64);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(base64);

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        if (filterType === "grayscale" || filterType === "high-contrast") {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Luma formula for grayscale
            let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            
            if (filterType === "high-contrast") {
              // Thresholding for document scan look
              v = v > 128 ? 255 : 0;
            }
            
            data[i] = data[i + 1] = data[i + 2] = v;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = base64;
    });
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.9);
    
    const processed = await processImage(base64, filter);
    
    const newPage: ScannedPage = {
      id: Math.random().toString(36).substr(2, 9),
      originalData: base64,
      processedData: processed,
      filter: filter
    };
    
    setPages(prev => [...prev, newPage]);
  };

  const removePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const handleExport = async () => {
    if (pages.length === 0) return;
    
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const page of pages) {
        const imageBytes = await fetch(page.processedData).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedJpg(imageBytes);
        
        const pdfPage = pdfDoc.addPage([image.width, image.height]);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "scanned_document.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      title="Quét sang PDF"
      description="Sử dụng camera để số hóa tài liệu. Hỗ trợ quét nhiều trang, bộ lọc làm nét và ghép thành PDF."
      gradient="from-emerald-500 to-teal-500"
      icon={<Camera className="h-7 w-7 text-white" />}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Filter Selection */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {[
            { id: "none", label: "Gốc", icon: ImageIcon },
            { id: "grayscale", label: "Xám", icon: RotateCw },
            { id: "high-contrast", label: "Quét (B&W)", icon: Zap },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as ScannedPage["filter"])}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.id
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-surface-100 text-text-secondary hover:bg-surface-200"
              }`}
            >
              <f.icon className="h-4 w-4" />
              {f.label}
            </button>
          ))}
        </div>

        {/* Camera Section */}
        <div className="relative rounded-3xl overflow-hidden bg-black aspect-[3/4] sm:aspect-video shadow-2xl border border-glass-border">
          {!isCameraActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
              <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                <Camera className="h-10 w-10 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Sẵn sàng quét tài liệu</h3>
              <p className="text-emerald-100/60 text-sm max-w-xs text-center">
                Sử dụng camera của thiết bị để chụp ảnh tài liệu và chuyển đổi sang PDF.
              </p>
              <button
                onClick={startCamera}
                className="mt-4 px-8 py-3 rounded-2xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/20 hover:scale-105 transition-transform"
              >
                Mở Camera
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              {/* Camera Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent">
                <button
                  onClick={stopCamera}
                  className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
                
                <button
                  onClick={captureImage}
                  className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center p-1 group"
                >
                  <div className="w-full h-full rounded-full bg-white group-active:scale-90 transition-transform" />
                </button>
                
                <div className="h-12 w-12 flex items-center justify-center text-white font-bold">
                  {pages.length}
                </div>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Gallery Section */}
        <AnimatePresence>
          {pages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-primary">
                  Các trang đã quét ({pages.length})
                </h3>
                <button
                  onClick={() => setPages([])}
                  className="text-sm text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa tất cả
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {pages.map((page, i) => (
                  <motion.div
                    key={page.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-glass-border bg-glass"
                  >
                    <img 
                      src={page.processedData} 
                      alt={`Page ${i+1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 h-6 w-6 rounded-lg bg-black/50 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white">
                      {i + 1}
                    </div>
                    <button
                      onClick={() => removePage(page.id)}
                      className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
                
                <button
                  onClick={() => !isCameraActive && startCamera()}
                  className="aspect-[3/4] rounded-2xl border-2 border-dashed border-glass-border flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text-secondary hover:border-brand-500/50 transition-all"
                >
                  <Plus className="h-8 w-8" />
                  <span className="text-sm font-medium">Thêm trang</span>
                </button>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-glass-border">
                <button
                  onClick={handleExport}
                  disabled={processing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl gradient-brand text-white font-bold shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang xử lý PDF...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Ghép {pages.length} trang thành PDF
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 rounded-2xl bg-surface-100 border border-glass-border">
            <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Mẹo quét đẹp
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Đặt tài liệu trên nền phẳng, tương phản (ví dụ giấy trắng trên bàn tối).</li>
              <li>• Đảm bảo đủ ánh sáng, tránh bóng đổ từ tay hoặc điện thoại.</li>
              <li>• Giữ camera song song với mặt giấy để tránh méo hình.</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-surface-100 border border-glass-border">
            <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-400" />
              Dùng cho máy Scan vật lý
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Nếu bạn đã quét bằng máy scan, hãy sử dụng công cụ 
              <span className="font-bold text-brand-400"> Ảnh sang PDF </span> 
              để gộp nhiều file ảnh đã quét thành một tài liệu duy nhất nhanh chóng.
            </p>
          </div>
        </div>

      </div>
    </ToolPageLayout>
  );
}
