"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "amber";
  delay?: number;
}

export default function GlassCard({ children, className, glow, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className={cn(
        "glass-card p-6 relative group transition-all duration-300",
        glow === "cyan" && "hover:glow-cyan",
        glow === "amber" && "hover:glow-amber",
        className
      )}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Top corner highlight */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-tl-xl" />
      
      {children}
    </motion.div>
  );
}
