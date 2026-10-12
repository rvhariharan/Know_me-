import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://knowme.app"),
  title: "KnowMe – How Well Do Your Friends Really Know You?",
  description:
    "Create a fun quiz about yourself, share it with your friends on WhatsApp, Instagram, or Telegram, and discover who really knows you best!",
  keywords: [
    "KnowMe",
    "friendship quiz",
    "how well do you know me",
    "best friend test",
    "viral quiz",
    "social trivia",
    "buddy meter",
  ],
  authors: [{ name: "KnowMe Social" }],
  creator: "KnowMe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://knowme.app",
    title: "KnowMe – How Well Do Your Friends Really Know You?",
    description:
      "Create a fun quiz about yourself, share it with your friends, and discover who really knows you best!",
    siteName: "KnowMe",
  },
  twitter: {
    card: "summary_large_image",
    title: "KnowMe – How Well Do Your Friends Really Know You?",
    description:
      "Create a fun quiz about yourself, share it with your friends, and discover who really knows you!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-[#090b14] text-slate-100 antialiased selection:bg-pink-500/30 selection:text-pink-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
