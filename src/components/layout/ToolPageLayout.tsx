"use client";

/* ============================================
   PDF Smart — Tool Page Layout
   Reusable layout for all PDF tool pages
   ============================================ */

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UpgradeModal from "@/components/modals/UpgradeModal";
import { useState } from "react";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isPro?: boolean;
}

export default function ToolPageLayout({
  title,
  description,
  gradient,
  icon,
  children,
  isPro = false,
}: ToolPageLayoutProps) {
  const [showUpgrade, setShowUpgrade] = useState(isPro);

  return (
    <div className="min-h-screen bg-surface-0">
      <Header />

      <UpgradeModal 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)} 
        featureName={title}
      />

      <main className="pt-20 pb-16">
        {/* Tool Header */}
        <div className="relative overflow-hidden">
          {/* Background mesh */}
          <div className="absolute inset-0 gradient-mesh opacity-50" />
          <div className="absolute inset-0 bg-grid opacity-30" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              All Tools
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-xl mb-5`}
              >
                {icon}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3 flex items-center justify-center gap-3">
                {title}
                {isPro && (
                  <span className="text-[10px] uppercase font-black bg-brand-500 text-white px-2 py-0.5 rounded-md tracking-wider">
                    Pro
                  </span>
                )}
              </h1>
              <p className="text-lg text-text-secondary max-w-xl mx-auto mb-6">
                {description}
              </p>
              
              {isPro && (
                <button 
                  onClick={() => setShowUpgrade(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500/10 text-brand-400 font-bold border border-brand-500/20 hover:bg-brand-500/20 transition-all mb-4"
                >
                  <Lock className="h-4 w-4" />
                  Mở khóa tính năng Pro
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Tool Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
