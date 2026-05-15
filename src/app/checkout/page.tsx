"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Copy, ShieldCheck, CreditCard, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { PAYMENT_CONFIG } from "@/lib/payment-config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "pro_yearly";
  const [copied, setCopied] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const plan = PAYMENT_CONFIG.plans.find(p => p.id === planId) || PAYMENT_CONFIG.plans[1];
  const message = `PDFSMART ${Math.floor(1000 + Math.random() * 9000)}`;

  // VietQR API URL
  const qrUrl = `https://img.vietqr.io/image/${PAYMENT_CONFIG.bank.id}-${PAYMENT_CONFIG.bank.accountNumber}-compact2.png?amount=${plan.price}&addInfo=${encodeURIComponent(message)}&accountName=${encodeURIComponent(PAYMENT_CONFIG.bank.accountName)}`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate payment verification
    setTimeout(() => {
      setIsVerifying(false);
      alert("Hệ thống đang kiểm tra giao dịch của bạn. Vui lòng chờ 1-3 phút để gói Pro được kích hoạt tự động.");
    }, 2000);
  };

  return (
    <main className="pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Left Side: Order Info */}
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> Quay lại trang chủ
          </Link>

          <div>
            <h1 className="text-3xl font-black text-text-primary mb-4">Hoàn tất nâng cấp Pro</h1>
            <p className="text-text-secondary">Bạn đang đăng ký gói <span className="font-bold text-brand-400">{plan.name}</span>. Vui lòng thanh toán để kích hoạt ngay lập tức.</p>
          </div>

          <div className="p-6 rounded-3xl bg-glass border border-glass-border space-y-4">
            <div className="flex justify-between items-center pb-4 border-bottom border-glass-border">
              <span className="text-text-secondary">Gói dịch vụ</span>
              <span className="font-bold text-text-primary">{plan.name}</span>
            </div>
            <div className="flex justify-between items-center text-xl">
              <span className="text-text-secondary">Tổng cộng</span>
              <span className="font-black text-brand-400">{plan.price.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-400" /> Thông tin chuyển khoản
            </h3>
            
            <div className="space-y-3">
              {[
                { label: "Ngân hàng", value: PAYMENT_CONFIG.bank.id, id: "bank" },
                { label: "Số tài khoản", value: PAYMENT_CONFIG.bank.accountNumber, id: "acc" },
                { label: "Chủ tài khoản", value: PAYMENT_CONFIG.bank.accountName, id: "name" },
                { label: "Số tiền", value: `${plan.price.toLocaleString('vi-VN')}đ`, id: "price" },
                { label: "Nội dung", value: message, id: "msg" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-100 border border-glass-border group">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-text-muted mb-0.5">{item.label}</p>
                    <p className="font-bold text-text-primary">{item.value}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(item.value.replace(/đ/g, '').replace(/\./g, ''), item.id)}
                    className="p-2 rounded-lg hover:bg-glass transition-colors text-text-muted hover:text-brand-400"
                  >
                    {copied === item.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: QR Code */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[2rem] bg-white shadow-2xl border-4 border-brand-500/20 relative"
          >
            <div className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/40">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            
            <img 
              src={qrUrl} 
              alt="VietQR Payment" 
              className="w-full max-w-[280px] h-auto"
            />
            
            <div className="mt-6 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quét mã bằng App Ngân hàng</p>
              <p className="text-slate-800 font-medium text-sm">Tự động nhận diện số tiền & nội dung</p>
            </div>
          </motion.div>

          <div className="mt-8 w-full max-w-sm space-y-4">
            <button 
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full py-4 rounded-2xl gradient-brand text-white font-bold shadow-xl shadow-brand-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                "Tôi đã chuyển khoản xong"
              )}
            </button>
            <p className="text-center text-[10px] text-text-muted flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Thanh toán được bảo mật bởi hệ thống ngân hàng Việt Nam
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-surface-0">
      <Header />
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}
