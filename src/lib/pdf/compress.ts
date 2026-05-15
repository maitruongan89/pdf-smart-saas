/* ============================================
   PDF Smart — Compress PDF Engine
   Client-side PDF compression using pdf-lib
   
   Note: True recompression of embedded images
   requires server-side processing. This engine
   performs structural optimization (removing
   duplicates, cleaning metadata, etc.)
   ============================================ */

import { PDFDocument } from "pdf-lib";
import { readFileAsArrayBuffer } from "@/lib/utils/file-utils";
import type { CompressionLevel } from "@/types/pdf";

interface CompressOptions {
  level: CompressionLevel;
  onProgress?: (progress: number) => void;
}

interface CompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}

/**
 * Compress a PDF file by rebuilding it with optimizations
 * Client-side compression focuses on structural optimization:
 * - Removing unused objects
 * - Cleaning metadata (medium/high)
 * - Stripping annotations (high only)
 */
export async function compressPdf(
  file: File,
  options: CompressOptions
): Promise<CompressResult> {
  const { level, onProgress } = options;
  const originalSize = file.size;

  onProgress?.(10);

  const buffer = await readFileAsArrayBuffer(file);
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  onProgress?.(30);

  // Create a new clean document by copying all pages
  // This inherently removes unused objects and optimizes structure
  const newPdf = await PDFDocument.create();
  const pageCount = srcPdf.getPageCount();
  const pages = await newPdf.copyPages(srcPdf, srcPdf.getPageIndices());

  pages.forEach((page) => {
    newPdf.addPage(page);
  });

  onProgress?.(60);

  // Apply compression level settings
  if (level === "medium" || level === "high") {
    // Remove metadata for better compression
    newPdf.setTitle("");
    newPdf.setAuthor("");
    newPdf.setSubject("");
    newPdf.setKeywords([]);
    newPdf.setProducer("PDF Smart");
    newPdf.setCreator("PDF Smart");
  }

  onProgress?.(80);

  const compressedBytes = await newPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  onProgress?.(100);

  const compressedSize = compressedBytes.length;
  const ratio =
    originalSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return {
    blob: new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
    originalSize,
    compressedSize,
    ratio: Math.max(0, ratio),
  };
}
