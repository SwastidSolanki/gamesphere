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
    <html lang="en" className={`${monoFont.variable}`}>
      <body className="font-heading bg-[#0a0a0b] text-white antialiased">
        <ThreeBackground />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
