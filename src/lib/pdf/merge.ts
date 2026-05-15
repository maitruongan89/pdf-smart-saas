/* ============================================
   PDF Smart — Merge PDF Engine
   Client-side PDF merging using pdf-lib
   ============================================ */

import { PDFDocument } from "pdf-lib";
import { readFileAsArrayBuffer } from "@/lib/utils/file-utils";

/**
 * Merge multiple PDF files into a single document
 * @param files - Array of PDF File objects to merge
 * @param onProgress - Progress callback (0-100)
 * @returns Merged PDF as Blob
 */
export async function mergePdfs(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (files.length === 0) throw new Error("No files provided");
  if (files.length === 1) {
    // Single file, just return it
    const buffer = await readFileAsArrayBuffer(files[0]);
    return new Blob([buffer], { type: "application/pdf" });
  }

  const mergedPdf = await PDFDocument.create();
  const totalFiles = files.length;

  for (let i = 0; i < totalFiles; i++) {
    const buffer = await readFileAsArrayBuffer(files[i]);
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

    pages.forEach((page) => {
      mergedPdf.addPage(page);
    });

    onProgress?.(Math.round(((i + 1) / totalFiles) * 100));
  }

  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/**
 * Get page count of a PDF file
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return pdf.getPageCount();
}
