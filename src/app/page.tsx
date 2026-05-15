"use client";

/* ============================================
   PDF Smart — Landing Page
   Premium SaaS landing page with animations
   ============================================ */

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToolIcon } from "@/components/layout/Header";
import { tools, categoryLabels } from "@/lib/tools-registry";
import {
  Zap,
  Shield,
  Globe,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Users,
  FileText,
} from "lucide-react";

/* Animation variants */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-0">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-grid opacity-30" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-[10%] w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "-3s" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-text-secondary">
                Công cụ PDF tất cả-trong-một — 100% Miễn phí
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
            >
              <span className="text-text-primary">Mọi công cụ PDF</span>
              <br />
              <span className="gradient-text">bạn thực sự cần</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
            >
              Ghép, tách, nén, chuyển đổi, chỉnh sửa và bảo mật PDF với tốc độ cực nhanh.
              Không cần tải lên — tệp của bạn luôn nằm an toàn trên thiết bị của bạn.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/merge-pdf"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl gradient-brand text-white font-semibold text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="h-5 w-5" />
                Bắt đầu ngay — Miễn phí
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl glass text-text-primary font-semibold text-base hover:bg-glass-hover transition-all"
              >
                Xem gói Pro
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-text-muted"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-400" />
                Bảo mật 100%
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-blue-400" />
                Xử lý tại chỗ (Offline)
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400" />
                Tin dùng bởi 1M+ người dùng
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Mọi công cụ PDF bạn cần
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Các công cụ mạnh mẽ để xử lý mọi tác vụ PDF. Nhanh chóng, miễn phí và chạy ngay trong trình duyệt của bạn.
            </p>
          </motion.div>

          {/* Categorized tool grid */}
          {(["transform", "convert", "edit", "security"] as const).map(
            (category) => {
              const categoryTools = tools.filter(
                (t) => t.category === category
              );
              if (categoryTools.length === 0) return null;

              return (
                <div key={category} className="mb-10">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4"
                  >
                    {categoryLabels[category]}
                  </motion.h3>

                  <motion.div
                    variants={stagger}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    {categoryTools.map((tool) => (
                      <motion.div key={tool.id} variants={fadeUp}>
                        <Link
                          href={tool.href}
                          className="tool-card group block p-5 rounded-2xl border border-glass-border bg-glass hover:bg-glass-hover"
                        >
                          <div
                            className={`tool-icon flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} shadow-lg mb-4 transition-transform`}
                          >
                            <ToolIcon name={tool.icon} size={22} />
                          </div>
                          <h4 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
                            {tool.name}
                            {tool.isPro && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                                PRO
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-text-muted">
                            {tool.description}
                          </p>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 sm:py-28 border-t border-glass-border">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Tại sao chọn PDF Smart?
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Được xây dựng với công nghệ tiên tiến nhất cho trải nghiệm xử lý PDF tốt nhất.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="h-6 w-6 text-amber-400" />,
                title: "Lightning Fast",
                desc: "Files are processed instantly in your browser. No waiting for uploads or server processing.",
                gradient: "from-amber-500/10 to-orange-500/10",
              },
              {
                icon: <Shield className="h-6 w-6 text-emerald-400" />,
                title: "100% Secure",
                desc: "Your files never leave your device. All processing happens locally in your browser.",
                gradient: "from-emerald-500/10 to-teal-500/10",
              },
              {
                icon: <Globe className="h-6 w-6 text-blue-400" />,
                title: "Works Everywhere",
                desc: "No software to install. Works on any device with a modern web browser.",
                gradient: "from-blue-500/10 to-cyan-500/10",
              },
              {
                icon: <Sparkles className="h-6 w-6 text-violet-400" />,
                title: "AI Powered",
                desc: "Smart PDF analysis, summarization, and data extraction powered by AI.",
                gradient: "from-violet-500/10 to-purple-500/10",
              },
              {
                icon: <Users className="h-6 w-6 text-pink-400" />,
                title: "Team Ready",
                desc: "Share tools and collaborate with your team. Enterprise plans available.",
                gradient: "from-pink-500/10 to-rose-500/10",
              },
              {
                icon: <FileText className="h-6 w-6 text-indigo-400" />,
                title: "Batch Processing",
                desc: "Process multiple files at once. Save hours with bulk operations.",
                gradient: "from-indigo-500/10 to-blue-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`p-6 rounded-2xl border border-glass-border bg-gradient-to-br ${feature.gradient} hover:shadow-lg transition-all`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-glass-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "1M+", label: "Tệp đã xử lý" },
              { value: "500K+", label: "Người dùng hài lòng" },
              { value: "12+", label: "Công cụ PDF" },
              { value: "99.9%", label: "Hoạt động ổn định" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="relative py-20 sm:py-28 border-t border-glass-border">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Start free, upgrade when you need more power.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Miễn phí",
                price: "$0",
                period: "vĩnh viễn",
                features: [
                  "Các công cụ PDF cơ bản",
                  "5 tệp mỗi ngày",
                  "Tối đa 50MB mỗi tệp",
                  "Xử lý trực tiếp trên trình duyệt",
                ],
                cta: "Bắt đầu ngay",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$9",
                period: "/tháng",
                features: [
                  "Mọi công cụ PDF",
                  "Không giới hạn số lượng tệp",
                  "Tối đa 500MB mỗi tệp",
                  "Tính năng AI thông minh",
                  "Hỗ trợ OCR (Quét chữ)",
                  "Ưu tiên xử lý tốc độ cao",
                  "Không có watermark quảng cáo",
                ],
                cta: "Dùng thử miễn phí",
                highlighted: true,
              },
              {
                name: "Doanh nghiệp",
                price: "Liên hệ",
                period: "",
                features: [
                  "Toàn bộ tính năng gói Pro",
                  "Quyền truy cập API",
                  "Quản lý nhóm người dùng",
                  "Tùy chỉnh thương hiệu riêng",
                  "Cam kết SLA ổn định",
                  "Hỗ trợ kỹ thuật ưu tiên",
                ],
                cta: "Liên hệ bộ phận bán hàng",
                highlighted: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border transition-all ${
                  plan.highlighted
                    ? "border-brand-500/50 bg-brand-500/5 shadow-xl shadow-brand-500/10 scale-105"
                    : "border-glass-border bg-glass"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold gradient-brand text-white">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-bold text-text-primary mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-extrabold text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-sm text-text-muted">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? "gradient-brand text-white shadow-lg shadow-brand-500/25 hover:opacity-90"
                      : "border border-glass-border text-text-primary hover:bg-glass-hover"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 border-t border-glass-border">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Sẵn sàng tối ưu hóa PDF của bạn?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Tham gia cùng hàng triệu người dùng tin tưởng PDF Smart cho mọi nhu cầu tài liệu.
            </p>
            <Link
              href="/merge-pdf"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-brand text-white font-semibold text-lg shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all hover:scale-[1.02]"
            >
              <Zap className="h-5 w-5" />
              Bắt đầu ngay — Miễn phí
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
