import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unais.vercel.app"),
  title: {
    default: "Syed Unais Panjathan | AI Engineer & Machine Learning Developer",
    template: "%s | Syed Unais Panjathan",
  },
  description:
    "Explore the portfolio of Syed Unais Panjathan, an AI Engineer and Machine Learning Developer building intelligent applications, Generative AI systems, LLM-powered solutions, and innovative software projects.",
  keywords: [
    "Syed Unais Panjathan",
    "Unais Panjathan",
    "Syed Unais",
    "Unais",
    "AI Engineer",
    "Machine Learning Engineer",
    "Generative AI Engineer",
    "Applied AI Engineer",
    "LLM Engineer",
    "MLOps Engineer",
    "AI Developer",
    "Software Developer",
    "Machine Learning Projects",
    "Generative AI Projects",
    "AI Applications Developer",
    "AI Engineer Portfolio",
  ],
  authors: [{ name: "Syed Unais Panjathan", url: "https://unais.vercel.app" }],
  creator: "Syed Unais Panjathan",
  publisher: "Syed Unais Panjathan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://unais.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://unais.vercel.app",
    siteName: "Syed Unais Panjathan",
    title: "Syed Unais Panjathan | AI Engineer & Machine Learning Developer",
    description:
      "Portfolio of Syed Unais Panjathan — AI Engineer, Machine Learning Developer, and Generative AI specialist building intelligent applications and LLM-powered solutions.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Syed Unais Panjathan — AI Engineer & Machine Learning Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Unais Panjathan | AI Engineer & Machine Learning Developer",
    description:
      "Portfolio of Syed Unais Panjathan — AI Engineer, Machine Learning Developer, and Generative AI specialist building intelligent applications and LLM-powered solutions.",
    images: ["/opengraph-image"],
    creator: "@syed_unais_",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  category: "technology",
};

import { AIHudCursor } from "@/components/ui/AIHudCursor";
import { ClientOnly } from "@/components/ui/ClientOnly";
import SmoothScroll from "@/components/ui/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientOnly>
          <AIHudCursor />
        </ClientOnly>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
