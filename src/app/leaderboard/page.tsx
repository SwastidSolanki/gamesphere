"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Trophy, Clock, Gamepad2, TrendingUp, Loader2, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchLeaderboardData } from "@/lib/dataFetcher";

type Metric = "score" | "hours" | "games";

const RANK_TIERS = [
  { min: 3000, label: "PLATINUM", color: "text-cyan-300",   bg: "bg-cyan-400/10 border-cyan-400/30"   },
  { min: 1500, label: "GOLD",     color: "text-yellow-300", bg: "bg-yellow-400/10 border-yellow-400/30" },
  { min: 500,  label: "SILVER",   color: "text-zinc-300",   bg: "bg-zinc-400/10 border-zinc-400/20"   },
  { min: 0,    label: "BRONZE",   color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30" },
];

function getRankTier(score: number) {
  return RANK_TIERS.find(t => score >= t.min) || RANK_TIERS[3];
}

const TOP3_STYLES = [
  { border: "border-yellow-400/40", glow: "shadow-[0_0_20px_rgba(250,204,21,0.12)]",  num: "text-yellow-400",  bg: "bg-yellow-400/5"  }, // #1 gold
  { border: "border-zinc-400/30",   glow: "shadow-[0_0_16px_rgba(212,212,216,0.08)]", num: "text-zinc-300",    bg: "bg-zinc-400/5"    }, // #2 silver
  { border: "border-orange-400/30", glow: "shadow-[0_0_16px_rgba(251,146,60,0.08)]",  num: "text-orange-400",  bg: "bg-orange-400/5"  }, // #3 bronze
];

const METRIC_OPTIONS: { key: Metric; label: string; icon: React.ReactNode; unit: string }[] = [
  { key: "score",  label: "Player Score",  icon: <TrendingUp className="w-3.5 h-3.5" />, unit: "pts" },
  { key: "hours",  label: "Hours Played",  icon: <Clock className="w-3.5 h-3.5" />,      unit: "h"   },
  { key: "games",  label: "Games Owned",   icon: <Gamepad2 className="w-3.5 h-3.5" />,   unit: ""    },
];

export default function LeaderboardPage() {
  const [rawPlayers, setRawPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metric, setMetric] = useState<Metric>("score");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const id = localStorage.getItem("gamesphere_steam_id");
        if (!id) return;
        const data = await fetchLeaderboardData("steam", id);
        setRawPlayers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Sort by selected metric, assign rank positions
  const ranked = useMemo(() => {
    const sorted = [...rawPlayers].sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0));
    return sorted.map((p, i) => ({ ...p, position: i + 1 }));
  }, [rawPlayers, metric]);

  const currentMetric = METRIC_OPTIONS.find(m => m.key === metric)!;

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white font-heading">
      <Navbar />

      {/* Page header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-4 opacity-50">
          <span className="w-10 h-[1px] bg-primary" />
          <p className="text-[10px] font-bold text-primary tracking-[0.6em] uppercase">Platform Rankings</p>
        </div>
        <h1 className="text-4xl md:text-6xl font-sans font-black tracking-tight text-white mb-3 leading-none uppercase">
          Platform Ladder
        </h1>
        <p className="text-sm font-mono text-primary/50 tracking-widest uppercase">
          Steam Network // Real-time data
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* Metric Toggle */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-2">Rank by:</span>
          {METRIC_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setMetric(opt.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-black tracking-widest uppercase border transition-all duration-200",
                metric === opt.key
                  ? "bg-primary text-black border-primary shadow-[0_0_12px_rgba(0,229,255,0.3)]"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Leaderboard */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-xs font-mono text-primary/60 tracking-widest uppercase animate-pulse">
              Fetching Steam network data...
            </p>
            <p className="text-[10px] font-mono text-zinc-600 tracking-widest">
              This may take ~30s while we load friend stats
            </p>
          </div>
        ) : ranked.length === 0 ? (
          <div className="py-24 text-center border border-white/5 rounded-xl bg-white/3">
            <p className="text-sm font-heading text-zinc-500 tracking-widest">No players detected — ensure friends list is public</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-[600px] space-y-3">
                {ranked.map((player, i) => {
                  const tier = getRankTier(player.score);
                  const top3 = i < 3 ? TOP3_STYLES[i] : null;
                  const metricVal = player[metric] ?? 0;
                  const displayVal = metric === "score"
                    ? metricVal.toLocaleString()
                    : `${metricVal.toLocaleString()}${currentMetric.unit}`;

                  return (
                    <motion.div
                      key={player.steamid || player.name}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.35 }}
                      className={cn(
                        "group flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-xl border transition-all duration-300",
                        "hover:bg-white/3 cursor-default",
                        top3 ? `${top3.border} ${top3.glow} ${top3.bg}` : "border-white/5 bg-black/30",
                        player.isSelf && "ring-1 ring-primary/30"
                      )}
                    >
                      {/* Rank number */}
                      <div className={cn(
                        "w-10 text-center font-black text-xl flex-shrink-0",
                        top3 ? top3.num : "text-zinc-600"
                      )}>
                        {i < 3 ? (
                          <Trophy className={cn("w-6 h-6 mx-auto", top3?.num)} />
                        ) : (
                          <span className="text-base">{player.position}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden bg-zinc-900 flex-shrink-0">
                        {player.avatar ? (
                          <img
                            src={player.avatar}
                            alt={player.name}
                            className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-5 h-5 text-zinc-600" />
                          </div>
                        )}
                      </div>

                      {/* Name + badges */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm tracking-wider text-white truncate">
                            {player.name}
                          </h3>
                          {player.isSelf && (
                            <span className="px-2 py-0.5 bg-primary/15 border border-primary/30 rounded text-[8px] font-black text-primary tracking-widest uppercase flex-shrink-0">
                              YOU
                            </span>
                          )}
                          {/* Rank Tier Badge */}
                          <span className={cn("hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[8px] font-black tracking-widest uppercase flex-shrink-0", tier.bg, tier.color)}>
                            <ShieldCheck className="w-2.5 h-2.5" />
                            {tier.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {/* Steam Level badge */}
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-[#1a5fa8]/30 border border-[#4a90d9]/30 rounded text-[9px] font-black text-[#7ab8f5]">
                            Lvl {player.level}
                          </div>
                          <span className={cn("text-[9px] font-mono", player.status === "Online" ? "text-green-500" : "text-zinc-600")}>
                            {player.status}
                          </span>
                        </div>
                      </div>

                      {/* All 3 metrics — small */}
                      <div className="hidden lg:flex items-center gap-6 text-right flex-shrink-0">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">Score</p>
                          <p className={cn("text-xs font-black", metric === "score" ? "text-primary" : "text-zinc-400")}>
                            {player.score.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">Hours</p>
                          <p className={cn("text-xs font-black", metric === "hours" ? "text-primary" : "text-zinc-400")}>
                            {player.hours.toLocaleString()}h
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-0.5">Games</p>
                          <p className={cn("text-xs font-black", metric === "games" ? "text-primary" : "text-zinc-400")}>
                            {player.games}
                          </p>
                        </div>
                      </div>

                      {/* Primary metric (mobile-visible, highlighted) */}
                      <div className="flex-shrink-0 text-right lg:hidden">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">{currentMetric.label}</p>
                        <p className="text-base font-black text-primary">{displayVal}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
