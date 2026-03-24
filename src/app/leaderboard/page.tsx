"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { 
  Trophy, 
  Search, 
  Filter, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

const LEADERBOARD_DATA = [
  { rank: 1, name: "AcePlayer", score: 9840, tier: "Legend", trend: "up", platform: "Steam" },
  { rank: 2, name: "ValorantGod", score: 9720, tier: "Legend", trend: "down", platform: "Riot" },
  { rank: 3, name: "Swastid_Solanki", score: 8420, tier: "Elite", trend: "up", platform: "Steam" },
  { rank: 4, name: "ShadowNinja", score: 8100, tier: "Elite", trend: "stable", platform: "Riot" },
  { rank: 5, name: "GamerPro", score: 7950, tier: "Elite", trend: "up", platform: "Steam" },
  { rank: 6, name: "Striker", score: 7600, tier: "Elite", trend: "down", platform: "Riot" },
  { rank: 7, name: "Phoenix", score: 6800, tier: "Pro", trend: "stable", platform: "Steam" },
  { rank: 8, name: "Zeus", score: 6500, tier: "Pro", trend: "up", platform: "Riot" },
];

export default function LeaderboardPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-sm font-space-grotesk font-bold text-primary tracking-[0.2em] mb-2 uppercase">Global Ranking</h2>
          <h1 className="text-4xl md:text-5xl font-space-grotesk font-bold tracking-tight">PLATFORM_LADDER</h1>
        </div>
        
        <div className="flex gap-2">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Players..." 
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all w-48 focus:w-64"
                />
            </div>
            <button className="bg-white/5 border border-white/10 rounded-full p-2 hover:bg-white/10 transition-all">
                <Filter className="w-4 h-4 text-zinc-500" />
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {LEADERBOARD_DATA.map((player, index) => (
          <motion.div
            key={player.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className={cn(
                "p-4 flex items-center justify-between group",
                player.name === "Swastid_Solanki" && "border-primary/30 bg-primary/5"
            )}>
              <div className="flex items-center gap-6">
                <div className="w-8 text-center font-space-grotesk font-bold text-xl text-zinc-600 group-hover:text-primary transition-colors">
                    {player.rank.toString().padStart(2, '0')}
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-zinc-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white group-hover:text-primary transition-colors">{player.name}</h4>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{player.platform}</span>
                    </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Power Score</p>
                    <p className="font-space-grotesk font-bold text-glow">{player.score}</p>
                </div>

                <div className="w-24 text-center">
                    <span className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-full border",
                        player.tier === "Legend" ? "border-primary/50 text-primary bg-primary/10" : 
                        player.tier === "Elite" ? "border-secondary/50 text-secondary bg-secondary/10" :
                        "border-white/10 text-zinc-400 bg-white/5"
                    )}>
                        {player.tier}
                    </span>
                </div>

                <div className="w-8 flex justify-center">
                    {player.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {player.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                    {player.trend === "stable" && <Minus className="w-4 h-4 text-zinc-600" />}
                </div>

                <button className={cn(
                    "p-2 rounded-full bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all",
                    player.name === "Swastid_Solanki" && "bg-primary/20 border-primary"
                )}>
                    <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
    return (
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
}
