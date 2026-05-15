import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {
    resolveAlias: {
      canvas: { browser: "" },
    },
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
