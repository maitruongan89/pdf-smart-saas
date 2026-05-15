/* ============================================
   PDF Smart — File Utility Functions
   ============================================ */

/**
 * Format bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download multiple blobs as individual files
 */
export function downloadMultipleBlobs(
  blobs: Blob[],
  baseName: string,
  ext: string
): void {
  blobs.forEach((blob, i) => {
    setTimeout(() => {
      downloadBlob(blob, `${baseName}_${i + 1}.${ext}`);
    }, i * 200);
  });
}

/**
 * Read file as ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Read file as Data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Check if file is a PDF
 */
export function isPdfFile(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Clamp number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
