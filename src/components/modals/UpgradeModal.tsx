"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, X, ShieldCheck, Star, Sparkles } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export default function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-surface-100 shadow-2xl border border-glass-border"
          >
            {/* Top Banner */}
            <div className="h-24 bg-gradient-to-r from-brand-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
              <Sparkles className="absolute top-2 left-2 text-white/20 h-12 w-12" />
              <Star className="absolute bottom-2 right-6 text-white/20 h-16 w-16" />
              <div className="relative z-10 flex items-center gap-3 text-white">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/30">
                  <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300" />
                </div>
                <div>
                  <h3 className="font-bold text-xl leading-tight">Nâng cấp PDF Smart Pro</h3>
                  <p className="text-white/80 text-xs">Mở khóa sức mạnh tối đa cho tài liệu của bạn</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <p className="text-text-primary font-medium mb-2">
                  Tính năng <span className="text-brand-400 font-bold">{featureName}</span> chỉ dành cho thành viên Premium.
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Trở thành người dùng chuyên nghiệp để xử lý file không giới hạn dung lượng, tốc độ cao hơn và bảo mật tuyệt đối.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                {[
                  "Không giới hạn số lượng file xử lý mỗi ngày",
                  "Xử lý file dung lượng lớn lên đến 200MB",
                  "Công cụ chuyển đổi (Word, Excel) độ chính xác cao",
                  "Hỗ trợ ưu tiên 24/7 từ kỹ thuật viên",
                  "Không có quảng cáo và watermark"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-500 stroke-[3px]" />
                    </div>
                    <span className="text-sm text-text-primary">{item}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Preview */}
              <div className="p-4 rounded-2xl bg-surface-200 border border-glass-border flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Gói theo năm - Ưu đãi 40%</p>
                  <p className="text-2xl font-black text-text-primary">
                    199k <span className="text-sm font-normal text-text-secondary">/tháng</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-[10px] font-bold uppercase border border-brand-500/20">
                    Phổ biến nhất
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid gap-3">
                <Link 
                  href="/checkout?plan=pro_yearly"
                  className="w-full py-4 rounded-2xl gradient-brand text-white font-bold shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Nâng cấp ngay bây giờ
                </Link>
                <button 
                  onClick={onClose}
                  className="w-full py-3 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  Để sau, tôi sẽ tiếp tục dùng bản miễn phí
                </button>
              </div>

              {/* Trust Badge */}
              <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
                <ShieldCheck className="h-10 w-10 text-text-muted" />
                <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted">
                  Thanh toán an toàn & bảo mật
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
