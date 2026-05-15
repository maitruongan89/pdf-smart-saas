"use client";

/* ============================================
   PDF Smart — PDF Viewer Component
   Lightweight PDF previewer using PDF.js
   ============================================ */

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Loader2 } from "lucide-react";
import { renderPdfPageToCanvas, getPdfPageCount } from "@/lib/pdf/pdf-to-image";

interface PdfViewerProps {
  file: File;
  className?: string;
}

export default function PdfViewer({ file, className = "" }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    let active = true;

    async function loadInfo() {
      try {
        const count = await getPdfPageCount(file);
        if (active) setTotalPages(count);
      } catch (err) {
        if (active) setError("Failed to load PDF info");
      }
    }

    loadInfo();
    return () => { active = false; };
  }, [file]);

  useEffect(() => {
    let active = true;
    if (!canvasRef.current) return;

    async function render() {
      setLoading(true);
      setError(null);
      try {
        await renderPdfPageToCanvas(file, page, canvasRef.current!, 800 * scale);
      } catch (err) {
        if (active) setError("Failed to render page");
      } finally {
        if (active) setLoading(false);
      }
    }

    render();
    return () => { active = false; };
  }, [file, page, scale]);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className={`flex flex-col rounded-2xl border border-glass-border bg-surface-100 overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-glass-border bg-glass">
        <div className="flex items-center gap-1">
          <button
            onClick={prevPage}
            disabled={page <= 1}
            className="p-1.5 rounded-lg hover:bg-glass-hover text-text-secondary hover:text-text-primary disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium px-2">
            Page {page} of {totalPages || "?"}
          </span>
          <button
            onClick={nextPage}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg hover:bg-glass-hover text-text-secondary hover:text-text-primary disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
            className="p-1.5 rounded-lg hover:bg-glass-hover text-text-secondary hover:text-text-primary"
          >
            <ZoomOut className="h-4.5 w-4.5" />
          </button>
          <span className="text-xs font-mono text-text-muted w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={() => setScale(s => Math.min(2, s + 0.1))}
            className="p-1.5 rounded-lg hover:bg-glass-hover text-text-secondary hover:text-text-primary"
          >
            <ZoomIn className="h-4.5 w-4.5" />
          </button>
          <div className="w-px h-4 bg-glass-border mx-1" />
          <button className="p-1.5 rounded-lg hover:bg-glass-hover text-text-secondary hover:text-text-primary">
            <Maximize2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 overflow-auto bg-surface-200 flex items-center justify-center p-8 min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-200/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          </div>
        )}

        {error ? (
          <div className="text-center">
            <p className="text-red-400 text-sm font-medium mb-2">{error}</p>
            <button 
              onClick={() => setPage(p => p)} 
              className="text-xs text-text-muted hover:text-text-primary underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            className="shadow-2xl bg-white max-w-full h-auto"
          />
        )}
      </div>
    </div>
  );
}
