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
  Minus,
  Clock,
  Gamepad2
} from "lucide-react";
import { cn } from "@/lib/utils";

const LEADERBOARD_DATA = [
  { rank: 1, name: "AcePlayer", score: 9840, tier: "Legend", trend: "up", platform: "Steam", hours: 4250, games: 142, achievements: 856 },
  { rank: 2, name: "ValorantGod", score: 9720, tier: "Legend", trend: "down", platform: "Riot", hours: 3120, games: 4, achievements: 142 },
  { rank: 3, name: "Swastid_Solanki", score: 8420, tier: "Elite", trend: "up", platform: "Steam", hours: 1240, games: 85, achievements: 412 },
  { rank: 4, name: "ShadowNinja", score: 8100, tier: "Elite", trend: "stable", platform: "Riot", hours: 2100, games: 2, achievements: 98 },
  { rank: 5, name: "GamerPro", score: 7950, tier: "Elite", trend: "up", platform: "Steam", hours: 940, games: 112, achievements: 654 },
  { rank: 6, name: "Striker", score: 7600, tier: "Elite", trend: "down", platform: "Riot", hours: 1560, games: 1, achievements: 56 },
  { rank: 7, name: "Phoenix", score: 6800, tier: "Pro", trend: "stable", platform: "Steam", hours: 820, games: 45, achievements: 210 },
  { rank: 8, name: "Zeus", score: 6500, tier: "Pro", trend: "up", platform: "Riot", hours: 1100, games: 3, achievements: 88 },
];

export default function LeaderboardPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-xs font-heading font-bold text-primary tracking-[0.3em] mb-2 uppercase opacity-60">Global Ranking</h2>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">PLATFORM_LADDER</h1>
        </div>
        
        <div className="flex gap-4">
            <div className="flex bg-white/5 border border-white/10 rounded-full focus-within:border-primary/50 transition-all overflow-hidden group h-12">
                <div className="flex items-center pl-5">
                    <Search className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search Players..." 
                    className="bg-transparent py-2 pl-4 pr-6 text-sm focus:outline-none w-48 focus:w-64 transition-all text-white placeholder:text-zinc-600"
                />
            </div>
            <button className="bg-white/5 border border-white/10 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-all">
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
                <div className="w-8 text-center font-heading font-bold text-xl text-zinc-600 group-hover:text-primary transition-colors">
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

              <div className="flex items-center gap-16">
                {/* Detailed Stats */}
                <div className="hidden lg:flex items-center gap-10">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-xs font-bold text-zinc-400">{player.hours.toLocaleString()}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-xs font-bold text-zinc-400">{player.games} Games</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-xs font-bold text-zinc-400">{player.achievements}</span>
                    </div>
                </div>

                <div className="text-right min-w-[100px]">
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Power Score</p>
                    <p className="font-heading font-bold text-lg">{player.score.toLocaleString()}</p>
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
