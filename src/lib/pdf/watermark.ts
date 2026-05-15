/* ============================================
   PDF Smart — Watermark Engine
   Add text or image watermarks to PDF
   ============================================ */

import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { readFileAsArrayBuffer } from "@/lib/utils/file-utils";
import type { WatermarkPosition } from "@/types/pdf";

interface WatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number; // 0-1
  color: { r: number; g: number; b: number };
  rotation: number; // degrees
  position: WatermarkPosition;
  onProgress?: (progress: number) => void;
}

/**
 * Add text watermark to all pages of a PDF
 */
export async function addWatermark(
  file: File,
  options: WatermarkOptions
): Promise<Blob> {
  const { text, fontSize, opacity, color, rotation, position, onProgress } =
    options;

  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();

  onProgress?.(20);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = fontSize;

    let x: number;
    let y: number;

    switch (position) {
      case "center":
        x = (width - textWidth) / 2;
        y = (height - textHeight) / 2;
        break;
      case "top-left":
        x = 40;
        y = height - 40 - textHeight;
        break;
      case "top-right":
        x = width - textWidth - 40;
        y = height - 40 - textHeight;
        break;
      case "bottom-left":
        x = 40;
        y = 40;
        break;
      case "bottom-right":
        x = width - textWidth - 40;
        y = 40;
        break;
      case "diagonal":
        x = (width - textWidth) / 2;
        y = (height - textHeight) / 2;
        break;
      default:
        x = (width - textWidth) / 2;
        y = (height - textHeight) / 2;
    }

    const rot = position === "diagonal" ? -45 : rotation;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rot),
    });

    onProgress?.(20 + Math.round(((i + 1) / pages.length) * 70));
  }

  onProgress?.(95);

  const bytes = await pdf.save();

  onProgress?.(100);

  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

/**
 * Add image watermark to all pages of a PDF
 */
export async function addImageWatermark(
  file: File,
  watermarkImage: File,
  options: {
    opacity: number;
    scale: number;
    position: WatermarkPosition;
    onProgress?: (progress: number) => void;
  }
): Promise<Blob> {
  const { opacity, scale, position, onProgress } = options;

  const buffer = await readFileAsArrayBuffer(file);
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const imgBuffer = await readFileAsArrayBuffer(watermarkImage);
  const imgUint8 = new Uint8Array(imgBuffer);

  let image;
  if (
    watermarkImage.type === "image/png" ||
    watermarkImage.name.endsWith(".png")
  ) {
    image = await pdf.embedPng(imgUint8);
  } else {
    image = await pdf.embedJpg(imgUint8);
  }

  const imgWidth = image.width * scale;
  const imgHeight = image.height * scale;
  const pages = pdf.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    let x: number;
    let y: number;

    switch (position) {
      case "center":
        x = (width - imgWidth) / 2;
        y = (height - imgHeight) / 2;
        break;
      case "top-left":
        x = 20;
        y = height - imgHeight - 20;
        break;
      case "top-right":
        x = width - imgWidth - 20;
        y = height - imgHeight - 20;
        break;
      case "bottom-left":
        x = 20;
        y = 20;
        break;
      case "bottom-right":
        x = width - imgWidth - 20;
        y = 20;
        break;
      default:
        x = (width - imgWidth) / 2;
        y = (height - imgHeight) / 2;
    }

    page.drawImage(image, {
      x,
      y,
      width: imgWidth,
      height: imgHeight,
      opacity,
    });

    onProgress?.(Math.round(((i + 1) / pages.length) * 100));
  }

  const bytes = await pdf.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
