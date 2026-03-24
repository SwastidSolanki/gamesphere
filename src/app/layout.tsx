import type { Metadata } from "next";
import { Unbounded, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThreeBackground from "@/components/ThreeBackground";
import Navbar from "@/components/Navbar";

const headingFont = Unbounded({ subsets: ["latin"], variable: "--font-heading" });
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "GameSphere | Unified Player Stats",
  description: "Connect your Steam and Riot accounts for unified analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${headingFont.variable} ${monoFont.variable}`}>
      <body className="font-mono bg-[#0a0a0b] text-white antialiased">
        <ThreeBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
