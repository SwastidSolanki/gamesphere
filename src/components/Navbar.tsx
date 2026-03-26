"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, User, Trophy, Users2, Home } from "lucide-react";

const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  { name: "Compare", path: "/compare", icon: Users2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!mounted) return null;

  return (
    <nav className={cn(
      "fixed left-0 right-0 z-50 flex justify-center transition-all duration-500",
      "top-6 md:top-10 p-4 pointer-events-none",
      visible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
    )}>
      <div className="flex items-center gap-1 md:gap-2 p-1.5 md:p-3 bg-black/80 backdrop-blur-2xl rounded-full border border-white/10 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.9)] max-w-fit mx-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3.5 rounded-full transition-all duration-500",
              pathname === item.path
                ? "bg-primary text-black font-black"
                : "text-zinc-500 hover:text-white hover:bg-white/10"
            )}
          >
            <item.icon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-[11px] font-sans tracking-[0.2em] md:tracking-[0.3em] font-black uppercase hidden lg:inline-block">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
