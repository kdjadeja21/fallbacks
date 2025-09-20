import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ErrorTriggerProvider } from "./contexts/ErrorTriggerContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fallbacks | A Gallery of React Error Boundary Templates",
  description:
    "Explore 20+ ready-made error boundary component templates for React applications",
  icons: {
    icon: [
      { url: "/favicon.ico" }, // fallback for older browsers
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #e2e8f0 100%)`,
            backgroundSize: "100% 100%",
          }}
        />
        <div className="relative z-10">
          <ErrorTriggerProvider initialTriggerState={false}>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </ErrorTriggerProvider>
        </div>
        <Toaster richColors closeButton position="bottom-right" theme="light" />
        <Analytics />
      </body>
    </html>
  );
}
