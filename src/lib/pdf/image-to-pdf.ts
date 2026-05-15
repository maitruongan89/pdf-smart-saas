/* ============================================
   PDF Smart — Image to PDF Engine
   Convert images to PDF using pdf-lib
   ============================================ */

import { PDFDocument, PageSizes } from "pdf-lib";
import { readFileAsArrayBuffer } from "@/lib/utils/file-utils";
import type { PaperSize } from "@/types/pdf";

interface ImageToPdfOptions {
  paperSize: PaperSize;
  margin: number; // in points (72 points = 1 inch)
  quality: number; // 0-1
  onProgress?: (progress: number) => void;
}

/** Paper size dimensions in points [width, height] */
const PAPER_SIZES: Record<PaperSize, [number, number] | null> = {
  a4: PageSizes.A4,
  letter: PageSizes.Letter,
  a3: PageSizes.A3,
  legal: PageSizes.Legal,
  fit: null, // Use image dimensions
};

/**
 * Convert multiple images to a single PDF document
 */
export async function imagesToPdf(
  files: File[],
  options: ImageToPdfOptions
): Promise<Blob> {
  const { paperSize, margin, onProgress } = options;
  const pdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = await readFileAsArrayBuffer(file);
    const uint8 = new Uint8Array(buffer);

    let image;
    const type = file.type.toLowerCase();

    if (type === "image/png") {
      image = await pdf.embedPng(uint8);
    } else if (type === "image/jpeg" || type === "image/jpg") {
      image = await pdf.embedJpg(uint8);
    } else if (type === "image/webp") {
      // WebP needs canvas conversion to PNG first
      const pngBlob = await convertWebpToPng(file);
      const pngBuffer = await pngBlob.arrayBuffer();
      image = await pdf.embedPng(new Uint8Array(pngBuffer));
    } else {
      // Try as PNG for other formats
      const pngBlob = await convertToPng(file);
      const pngBuffer = await pngBlob.arrayBuffer();
      image = await pdf.embedPng(new Uint8Array(pngBuffer));
    }

    const imgWidth = image.width;
    const imgHeight = image.height;

    let pageWidth: number;
    let pageHeight: number;

    if (paperSize === "fit" || !PAPER_SIZES[paperSize]) {
      // Fit page to image
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    } else {
      [pageWidth, pageHeight] = PAPER_SIZES[paperSize]!;
    }

    const page = pdf.addPage([pageWidth, pageHeight]);

    // Calculate scaled dimensions to fit within margins
    const availWidth = pageWidth - margin * 2;
    const availHeight = pageHeight - margin * 2;
    const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight, 1);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    // Center the image on the page
    const x = margin + (availWidth - drawWidth) / 2;
    const y = margin + (availHeight - drawHeight) / 2;

    page.drawImage(image, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });

    onProgress?.(Math.round(((i + 1) / files.length) * 100));
  }

  const bytes = await pdf.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/**
 * Convert WebP image to PNG using canvas
 */
async function convertWebpToPng(file: File): Promise<Blob> {
  return convertToPng(file);
}

/**
 * Convert any image to PNG using canvas
 */
async function convertToPng(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("Failed to convert image"));
        },
        "image/png",
        1.0
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
