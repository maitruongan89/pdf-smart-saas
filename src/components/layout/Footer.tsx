"use client";

/* ============================================
   PDF Smart — Footer Component
   ============================================ */

import Link from "next/link";
import { FileText, GitBranch, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-glass-border bg-surface-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="gradient-text">PDF</span>{" "}
                <span className="text-text-primary">Smart</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs">
              The all-in-one PDF solution. Fast, secure, and beautiful.
              Transform documents with lightning speed.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">
              Công cụ PDF
            </h4>
            <ul className="space-y-2">
              {[
                ["Ghép PDF", "/merge-pdf"],
                ["Tách PDF", "/split-pdf"],
                ["Nén PDF", "/compress-pdf"],
                ["Ảnh sang PDF", "/image-to-pdf"],
                ["PDF sang Ảnh", "/pdf-to-image"],
                ["Đóng dấu", "/watermark"],
              ].map(([name, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">
              Công ty
            </h4>
            <ul className="space-y-2">
              {[
                ["Giới thiệu", "/about"],
                ["Bảng giá", "/pricing"],
                ["Blog", "/blog"],
                ["Liên hệ", "/contact"],
              ].map(([name, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">
              Pháp lý
            </h4>
            <ul className="space-y-2">
              {[
                ["Chính sách bảo mật", "/privacy"],
                ["Điều khoản sử dụng", "/terms"],
                ["An ninh", "/security"],
              ].map(([name, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Mai Trường An - 0905012131. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <GitBranch className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Twitter"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
