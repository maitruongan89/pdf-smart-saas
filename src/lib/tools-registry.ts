/* ============================================
   PDF Smart — Tool Registry
   Central registry of all available PDF tools
   ============================================ */

import { ToolInfo } from "@/types/pdf";

export const tools: ToolInfo[] = [
  // Transform tools
  {
    id: "merge",
    name: "Ghép PDF",
    description: "Gộp nhiều file PDF thành một tài liệu duy nhất",
    icon: "layers",
    color: "#6366f1",
    gradient: "from-indigo-500 to-violet-500",
    href: "/merge-pdf",
    category: "transform",
  },
  {
    id: "split",
    name: "Tách PDF",
    description: "Chia nhỏ các trang PDF thành nhiều file riêng biệt",
    icon: "scissors",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-500",
    href: "/split-pdf",
    category: "transform",
  },
  {
    id: "compress",
    name: "Nén PDF",
    description: "Giảm dung lượng file nhưng vẫn giữ chất lượng tốt",
    icon: "minimize-2",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-500",
    href: "/compress-pdf",
    category: "transform",
  },
  {
    id: "rotate",
    name: "Xoay trang PDF",
    description: "Xoay và sắp xếp lại thứ tự các trang PDF",
    icon: "rotate-cw",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-500",
    href: "/rotate-pdf",
    category: "transform",
  },

  // Convert tools
  {
    id: "image-to-pdf",
    name: "Ảnh sang PDF",
    description: "Chuyển JPG, PNG, WEBP sang định dạng PDF",
    icon: "image",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-500",
    href: "/image-to-pdf",
    category: "convert",
  },
  {
    id: "pdf-to-image",
    name: "PDF sang Ảnh",
    description: "Xuất các trang PDF thành ảnh JPG hoặc PNG",
    icon: "file-image",
    color: "#f43f5e",
    gradient: "from-rose-500 to-pink-500",
    href: "/pdf-to-image",
    category: "convert",
  },
  {
    id: "pdf-to-word",
    name: "PDF sang Word",
    description: "Chuyển PDF sang văn bản Word có thể chỉnh sửa",
    icon: "file-text",
    color: "#2563eb",
    gradient: "from-blue-600 to-blue-400",
    href: "/pdf-to-word",
    category: "convert",
    isPro: true,
  },
  {
    id: "pdf-to-excel",
    name: "PDF sang Excel",
    description: "Trích xuất bảng biểu từ PDF sang bảng tính",
    icon: "table",
    color: "#16a34a",
    gradient: "from-green-600 to-green-400",
    href: "/pdf-to-excel",
    category: "convert",
    isPro: true,
  },
  {
    id: "scan-pdf",
    name: "Quét sang PDF",
    description: "Sử dụng camera để quét tài liệu và ghép thành file PDF.",
    icon: "camera",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-500",
    href: "/scan-pdf",
    category: "convert",
  },

  // Edit tools
  {
    id: "edit",
    name: "Chỉnh sửa PDF",
    description: "Thêm chữ, ảnh, hình vẽ và ghi chú vào PDF",
    icon: "pen-tool",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
    href: "/edit-pdf",
    category: "edit",
    isPro: true,
  },
  {
    id: "watermark",
    name: "Đóng dấu bản quyền",
    description: "Thêm chữ hoặc ảnh mờ bảo vệ tài liệu PDF",
    icon: "droplets",
    color: "#0ea5e9",
    gradient: "from-sky-500 to-blue-500",
    href: "/watermark",
    category: "edit",
  },

  // Security tools
  {
    id: "protect",
    name: "Đặt mật khẩu",
    description: "Mã hóa PDF bằng mật khẩu bảo vệ",
    icon: "lock",
    color: "#ef4444",
    gradient: "from-red-500 to-orange-500",
    href: "/protect-pdf",
    category: "security",
  },
  {
    id: "unlock",
    name: "Mở khóa PDF",
    description: "Gỡ bỏ mật khẩu bảo vệ khỏi file PDF",
    icon: "unlock",
    color: "#22c55e",
    gradient: "from-green-500 to-emerald-500",
    href: "/unlock-pdf",
    category: "security",
  },
];

/** Get tools by category */
export function getToolsByCategory(
  category: ToolInfo["category"]
): ToolInfo[] {
  return tools.filter((t) => t.category === category);
}

/** Get tool by ID */
export function getToolById(id: string): ToolInfo | undefined {
  return tools.find((t) => t.id === id);
}

/** Category labels */
export const categoryLabels: Record<ToolInfo["category"], string> = {
  transform: "Chuyển đổi trang",
  convert: "Chuyển đổi định dạng",
  edit: "Chỉnh sửa & Ghi chú",
  security: "Bảo mật",
  ai: "Công cụ AI",
};
