import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF Smart — All-in-One PDF Solution | Merge, Split, Compress & More",
  description:
    "Transform your PDF documents with lightning speed. Merge, split, compress, convert, edit, and secure PDFs online — free, fast, and beautiful.",
  keywords: [
    "PDF",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "convert PDF",
    "edit PDF",
    "PDF to Word",
    "PDF to Image",
    "online PDF tools",
  ],
  authors: [{ name: "PDF Smart" }],
  openGraph: {
    title: "PDF Smart — All-in-One PDF Solution",
    description:
      "Transform your PDF documents with lightning speed. Free online PDF tools.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Smart — All-in-One PDF Solution",
    description:
      "Transform your PDF documents with lightning speed. Free online PDF tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
