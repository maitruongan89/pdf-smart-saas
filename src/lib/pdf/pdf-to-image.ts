/* ============================================
   PDF Smart — PDF to Image Engine
   Convert PDF pages to images using PDF.js
   ============================================ */

import { readFileAsArrayBuffer } from "@/lib/utils/file-utils";

/** Initialize PDF.js - loaded dynamically to reduce bundle size */
async function getPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  // Set worker source
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

interface PdfToImageOptions {
  scale: number; // 1 = 72dpi, 2 = 144dpi, 3 = 216dpi
  format: "png" | "jpeg";
  quality: number; // 0-1 (for jpeg)
  onProgress?: (progress: number) => void;
}

/**
 * Convert all pages of a PDF to images
 */
export async function pdfToImages(
  file: File,
  options: PdfToImageOptions
): Promise<Blob[]> {
  const { scale, format, quality, onProgress } = options;
  const pdfjs = await getPdfJs();

  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const totalPages = pdf.numPages;
  const results: Blob[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    } as any).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to render page " + i));
        },
        `image/${format}`,
        quality
      );
    });

    results.push(blob);
    onProgress?.(Math.round((i / totalPages) * 100));

    // Clean up
    page.cleanup();
  }

  pdf.destroy();
  return results;
}

/**
 * Render a single PDF page to a canvas element (for preview)
 */
export async function renderPdfPageToCanvas(
  file: File,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  maxWidth?: number
): Promise<void> {
  const pdfjs = await getPdfJs();
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  if (pageNumber < 1 || pageNumber > pdf.numPages) {
    pdf.destroy();
    throw new Error(`Page ${pageNumber} out of range (1-${pdf.numPages})`);
  }

  const page = await pdf.getPage(pageNumber);
  const defaultViewport = page.getViewport({ scale: 1 });

  let scale = 1;
  if (maxWidth && defaultViewport.width > maxWidth) {
    scale = maxWidth / defaultViewport.width;
  }

  const viewport = page.getViewport({ scale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;

  await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

  page.cleanup();
  pdf.destroy();
}

/**
 * Get the total number of pages in a PDF
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const pdfjs = await getPdfJs();
  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const count = pdf.numPages;
  pdf.destroy();
  return count;
}
