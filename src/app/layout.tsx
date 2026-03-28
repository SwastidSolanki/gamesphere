import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThreeBackground from "@/components/ThreeBackground";
import Navbar from "@/components/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SteamIntel | Unified Player Stats",
  description: "Connect your Steam account for deep player analytics.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/favicon.png?v=2", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png?v=2" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="font-mono bg-[#0d0f14] text-white antialiased selection:bg-primary/30">
        <main className="relative z-10 pt-28 md:pt-36">{children}</main>
      </body>
    </html>
  );
}
