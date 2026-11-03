import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { SiteShell } from "@/components/site-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KLYXDEV | Digital products, built differently",
  description: "Modern digital products, PWA apps, websites, AI workflows, and operational systems for ambitious teams.",
  metadataBase: new URL("https://klyxdev.dev"),
  appleWebApp: {
    capable: true,
    title: "KLYXDEV",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "KLYXDEV",
    description: "Digital products built differently.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#090A0C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#090A0C] text-white">
        <ServiceWorkerRegister />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
