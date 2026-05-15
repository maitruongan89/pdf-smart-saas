/* ============================================
   PDF Smart — TypeScript Type Definitions
   ============================================ */

/** Supported PDF tool types */
export type ToolType =
  | "merge"
  | "split"
  | "compress"
  | "image-to-pdf"
  | "pdf-to-image"
  | "watermark"
  | "rotate"
  | "protect"
  | "unlock"
  | "edit"
  | "ocr"
  | "pdf-to-word"
  | "pdf-to-excel"
  | "pdf-to-ppt"
  | "word-to-pdf"
  | "excel-to-pdf"
  | "ppt-to-pdf";

/** File with metadata for processing */
export interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  pageCount?: number;
  thumbnail?: string;
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  error?: string;
}

/** Split mode options */
export type SplitMode = "pages" | "range" | "every-n" | "size";

/** Compression level */
export type CompressionLevel = "low" | "medium" | "high";

/** Paper size for image-to-pdf */
export type PaperSize = "a4" | "letter" | "a3" | "legal" | "fit";

/** Watermark position */
export type WatermarkPosition =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "diagonal";

/** Processing job status */
export interface ProcessingJob {
  id: string;
  toolType: ToolType;
  status: "idle" | "processing" | "complete" | "error";
  progress: number;
  message: string;
  result?: Blob | Blob[];
  resultName?: string;
}

/** Tool card info for the grid */
export interface ToolInfo {
  id: ToolType;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  href: string;
  category: "transform" | "convert" | "edit" | "security" | "ai";
  isPro?: boolean;
}
