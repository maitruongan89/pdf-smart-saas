/* ============================================
   PDF Smart — Split PDF Engine
   Client-side PDF splitting using pdf-lib
   ============================================ */

import { PDFDocument } from "pdf-lib";
import { readFileAsArrayBuffer } from "@/lib/utils/file-utils";

/**
 * Split PDF by individual pages — each page becomes its own PDF
 */
export async function splitByPages(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob[]> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdf.getPageCount();
  const results: Blob[] = [];

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);
    const bytes = await newPdf.save();
    results.push(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }));
    onProgress?.(Math.round(((i + 1) / totalPages) * 100));
  }

  return results;
}

/**
 * Split PDF by range — e.g., "1-3,5,7-9"
 */
export async function splitByRange(
  file: File,
  rangeStr: string,
  onProgress?: (progress: number) => void
): Promise<Blob[]> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdf.getPageCount();

  const ranges = parseRanges(rangeStr, totalPages);
  const results: Blob[] = [];

  for (let r = 0; r < ranges.length; r++) {
    const range = ranges[r];
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, range);
    pages.forEach((page) => newPdf.addPage(page));
    const bytes = await newPdf.save();
    results.push(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }));
    onProgress?.(Math.round(((r + 1) / ranges.length) * 100));
  }

  return results;
}

/**
 * Split PDF every N pages
 */
export async function splitEveryN(
  file: File,
  n: number,
  onProgress?: (progress: number) => void
): Promise<Blob[]> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const totalPages = pdf.getPageCount();
  const results: Blob[] = [];
  const chunks = Math.ceil(totalPages / n);

  for (let chunk = 0; chunk < chunks; chunk++) {
    const start = chunk * n;
    const end = Math.min(start + n, totalPages);
    const indices = Array.from({ length: end - start }, (_, i) => start + i);

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(pdf, indices);
    pages.forEach((page) => newPdf.addPage(page));
    const bytes = await newPdf.save();
    results.push(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }));
    onProgress?.(Math.round(((chunk + 1) / chunks) * 100));
  }

  return results;
}

/**
 * Extract specific pages from a PDF
 */
export async function extractPages(
  file: File,
  pageIndices: number[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  const pages = await newPdf.copyPages(pdf, pageIndices);
  pages.forEach((page, i) => {
    newPdf.addPage(page);
    onProgress?.(Math.round(((i + 1) / pageIndices.length) * 100));
  });

  const bytes = await newPdf.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/**
 * Parse range string like "1-3,5,7-9" into arrays of 0-indexed page numbers
 */
function parseRanges(rangeStr: string, totalPages: number): number[][] {
  const groups = rangeStr.split(";").map((s) => s.trim());
  const results: number[][] = [];

  for (const group of groups) {
    const indices: number[] = [];
    const parts = group.split(",").map((s) => s.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        const [startStr, endStr] = part.split("-").map((s) => s.trim());
        const start = Math.max(1, parseInt(startStr)) - 1;
        const end = Math.min(totalPages, parseInt(endStr)) - 1;
        for (let i = start; i <= end; i++) {
          indices.push(i);
        }
      } else {
        const page = parseInt(part) - 1;
        if (page >= 0 && page < totalPages) {
          indices.push(page);
        }
      }
    }

    if (indices.length > 0) {
      results.push([...new Set(indices)].sort((a, b) => a - b));
    }
  }

  return results;
}
