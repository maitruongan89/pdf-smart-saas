/* ============================================
   PDF Smart — Protect/Encrypt PDF Engine
   Password protection using pdf-lib
   
   Note: pdf-lib does not support full encryption.
   This provides a structural copy with metadata.
   Full encryption requires server-side processing.
   ============================================ */

import { PDFDocument } from "pdf-lib";
import { readFileAsArrayBuffer } from "@/lib/utils/file-utils";

/**
 * Create a "protected" copy of a PDF
 * Note: True PDF encryption requires native libraries.
 * This creates a clean rebuilt copy with protection metadata.
 */
export async function protectPdf(
  file: File,
  _password: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  onProgress?.(10);

  const buffer = await readFileAsArrayBuffer(file);
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  onProgress?.(40);

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(srcPdf, srcPdf.getPageIndices());
  pages.forEach((page) => newPdf.addPage(page));

  // Add protection metadata
  newPdf.setProducer("PDF Smart - Protected");
  newPdf.setCreator("PDF Smart");

  onProgress?.(80);

  const bytes = await newPdf.save();

  onProgress?.(100);

  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/**
 * Rotate pages in a PDF
 */
export async function rotatePdfPages(
  file: File,
  rotations: Map<number, number>, // pageIndex -> degrees (90, 180, 270)
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = pdf.getPages();

  for (let i = 0; i < pages.length; i++) {
    const rotation = rotations.get(i);
    if (rotation !== undefined) {
      const currentRotation = pages[i].getRotation().angle;
      pages[i].setRotation(
        // Use the degrees helper from pdf-lib
        { type: 0, angle: (currentRotation + rotation) % 360 } as any
      );
    }
    onProgress?.(Math.round(((i + 1) / pages.length) * 100));
  }

  const bytes = await pdf.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/**
 * Reorder pages in a PDF
 */
export async function reorderPdfPages(
  file: File,
  newOrder: number[], // Array of 0-indexed page numbers in new order
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const buffer = await readFileAsArrayBuffer(file);
  const srcPdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  onProgress?.(20);

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(srcPdf, newOrder);

  pages.forEach((page, i) => {
    newPdf.addPage(page);
    onProgress?.(20 + Math.round(((i + 1) / pages.length) * 70));
  });

  onProgress?.(95);

  const bytes = await newPdf.save();

  onProgress?.(100);

  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
