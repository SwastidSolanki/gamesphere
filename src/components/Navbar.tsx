"use client";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <div className="flex items-center gap-1 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5 pointer-events-auto shadow-2xl">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
              pathname === item.path
                ? "bg-primary/20 text-primary"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm font-heading tracking-widest uppercase">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
