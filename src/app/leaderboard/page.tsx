"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Trophy, Clock, Gamepad2, TrendingUp, Loader2, ShieldCheck, User, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchLeaderboardData, fetchVerifiedElites } from "@/lib/dataFetcher";

type Metric = "score" | "hours" | "games" | "achievements";

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
  { key: "achievements", label: "Achievements", icon: <Trophy className="w-3.5 h-3.5" />,   unit: ""    },
];

export default function LeaderboardPage() {
  const [rawPlayers, setRawPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metric, setMetric] = useState<Metric>("score");
  // const [scope, setScope] = useState<"local" | "global">("local"); // TODO: re-enable when global leaderboard is ready
  const [page, setPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const playersPerPage = 20;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const id = localStorage.getItem("gamesphere_steam_id");
        if (!id) return;
        
        // TODO: re-enable global scope when ready
        // if (scope === "global") {
        //   const data = await fetchVerifiedElites(id);
        //   setRawPlayers(data);
        // } else {
          const data = await fetchLeaderboardData("steam", id);
          setRawPlayers(data);
        // }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []); // removed [scope] dep – always loads local

  // TODO: re-enable when scope toggle comes back
  // useEffect(() => {
  //   setPage(1);
  // }, [scope]);

  // Sort by selected metric, filter private profiles (0 hours AND 0 games means private), assign rank
  const ranked = useMemo(() => {
    const filtered = rawPlayers.filter(p =>
      p.isSelf || (p.hours > 0 || p.games > 0)
    );
    const sorted = [...filtered].sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0));
    return sorted.map((p, i) => ({ ...p, position: i + 1 }));
  }, [rawPlayers, metric]);

  const currentMetric = METRIC_OPTIONS.find(m => m.key === metric)!;

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white font-heading">
      <Navbar />

      {/* Page header */}
      <div className="max-w-[1850px] mx-auto px-10 pb-12 pt-8 md:pt-20 relative overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute -top-20 -left-10 text-[15rem] md:text-[25rem] font-black text-white/[0.03] select-none pointer-events-none uppercase tracking-tighter">
          Rankings
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6 opacity-50">
              <span className="w-12 h-[1px] bg-primary" />
              <p className="text-sm font-bold text-primary tracking-[0.8em] uppercase">Platform Rankings</p>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-4 bg-gradient-to-br from-white via-white to-primary/40 bg-clip-text text-transparent">
              Platform <br /><span className="text-white">Ladder</span>
            </h1>
            <p className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase opacity-60">Steam Network // Real-Time Data Analysis</p>
          </div>

          {/* Scope Toggle – desktop only – TODO: re-enable when global leaderboard is ready */}
          {/* <div className="hidden md:flex bg-black/40 p-1 rounded-sm border border-white/10 backdrop-blur-xl shrink-0">
             <button 
               onClick={() => setScope("local")}
               className={cn(
                 "px-6 py-2 text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 rounded-sm",
                 scope === "local" ? "bg-primary text-black shadow-[0_0_20px_rgba(0,229,255,0.2)]" : "text-zinc-500 hover:text-white"
               )}
             >
               Local Friends
             </button>
             <button 
               onClick={() => setScope("global")}
               className={cn(
                 "px-6 py-2 text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 rounded-sm",
                 scope === "global" ? "bg-primary text-black shadow-[0_0_20px_rgba(0,229,255,0.2)]" : "text-zinc-500 hover:text-white"
               )}
             >
               Global Elites
             </button>
          </div> */}
        </div>
      </div>

      <div className="max-w-[1850px] mx-auto px-10 pb-24">
        {/* Mobile dropdowns – TODO: re-enable scope select when global is ready */}
        <div className="flex md:hidden items-center gap-3 mb-8 flex-wrap">
          {/* <select
            value={scope}
            onChange={e => { setScope(e.target.value as "local" | "global"); setPage(1); }}
            className="flex-1 bg-black/60 border border-white/10 text-white text-xs font-black tracking-widest uppercase rounded-sm px-4 py-3 focus:border-primary/40 focus:outline-none font-mono"
          >
            <option value="local">Local Friends</option>
            <option value="global">Global Elites</option>
          </select> */}
          <select
            value={metric}
            onChange={e => setMetric(e.target.value as Metric)}
            className="flex-1 bg-black/60 border border-white/10 text-white text-xs font-black tracking-widest uppercase rounded-sm px-4 py-3 focus:border-primary/40 focus:outline-none font-mono"
          >
            {METRIC_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Desktop metric toggle */}
        <div className="hidden md:flex items-center gap-2 mb-12 flex-wrap">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-4 font-mono">Rank by Sort:</span>
          {METRIC_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setMetric(opt.key)}
              className={cn(
                "flex items-center gap-3 px-6 py-3 rounded-sm text-xs font-black tracking-widest uppercase border transition-all duration-300",
                metric === opt.key
                  ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(160,192,208,0.4)] scale-105"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/10"
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
        {/* List Content */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-xs font-mono text-primary/60 tracking-widest uppercase animate-pulse">
              Syncing local manifold...
            </p>
            <p className="text-[10px] font-mono text-zinc-600 tracking-widest">
              Real-time Steam telemetry initialization active
            </p>
          </div>
        ) : ranked.length === 0 ? (
          <div className="py-24 text-center border border-white/5 rounded-xl bg-white/3">
            <p className="text-sm font-heading text-zinc-500 tracking-widest uppercase">No identities detected — ensure friends list is manifest</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="w-full space-y-4">
                {ranked.slice((page - 1) * playersPerPage, page * playersPerPage).map((player, i) => {
                  const tier = getRankTier(player.score);
                  // Global position is page-aware
                  const globalPos = (page - 1) * playersPerPage + i + 1;
                  const top3 = globalPos <= 3 ? TOP3_STYLES[globalPos - 1] : null;

                  return (
                    <motion.div
                      key={player.steamid || player.name}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.35 }}
                      className={cn(
                        "group flex flex-col sm:flex-row items-center gap-6 md:gap-12 p-5 md:p-8 rounded-2xl border transition-all duration-300",
                        "hover:bg-white/[0.03] cursor-default w-full relative overflow-hidden",
                        top3 ? `${top3.border} ${top3.glow} ${top3.bg}` : "border-white/5 bg-black/40",
                        player.isSelf && "ring-2 ring-primary/40 shadow-[0_0_30px_rgba(0,229,255,0.1)]"
                      )}
                    >
                      {/* Left: Rank & Profile */}
                      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 md:gap-12 min-w-0 flex-1 w-full">
                        <div className="w-12 md:w-20 shrink-0 flex flex-col items-center">
                          {globalPos <= 3 ? (
                            <Trophy className={cn("w-8 h-8 md:w-12 md:h-12 drop-shadow-2xl", top3?.num)} />
                          ) : (
                            <span className="text-2xl md:text-4xl font-black text-zinc-700 font-mono tracking-tighter italic">#{globalPos}</span>
                          )}
                        </div>

                        <div className="relative group shrink-0">
                          <div className={cn(
                            "w-16 h-16 md:w-24 md:h-24 rounded-2xl border-2 overflow-hidden bg-zinc-950 transition-all duration-500 group-hover:scale-105 group-hover:border-primary/50",
                            top3 ? top3.border : "border-white/10"
                          )}>
                            {player.avatar ? (
                              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-10 h-10 text-zinc-800" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 w-full sm:w-auto">
                          <div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap">
                            <h4 className={cn(
                              "text-xl md:text-4xl font-black tracking-tighter uppercase truncate leading-none",
                              player.isSelf ? "text-primary" : "text-white group-hover:text-primary transition-colors"
                            )}>
                              {player.name}
                            </h4>
                            {player.isSelf && (
                              <span className="text-[10px] font-mono px-3 py-1 bg-primary text-black font-black tracking-widest rounded-sm shadow-[0_0_15px_rgba(0,229,255,0.4)]">YOU</span>
                            )}
                            <div className={cn("px-3 py-1 rounded-sm text-[10px] font-black tracking-widest border font-mono uppercase", tier.bg, tier.color)}>
                              {tier.label}
                            </div>
                            <a 
                              href={`https://steamcommunity.com/profiles/${player.steamid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/5 border border-white/10 rounded-sm hover:border-primary/40 hover:text-primary transition-all group"
                              title="View Steam Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                            </a>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-3 flex-wrap">
                             <div className="flex items-center gap-2 px-3 py-1 bg-[#1a5fa8]/20 border border-[#4a90d9]/20 rounded-sm">
                                <span className="text-[10px] font-black text-[#7ab8f5] tracking-widest uppercase">LVL {player.level || 0}</span>
                             </div>
                             <div className="w-1 h-1 rounded-full bg-zinc-800 hidden sm:block" />
                             <p className="text-[10px] font-mono text-zinc-600 tracking-[0.4em] font-black uppercase">Identity Verified</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Telemetry Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase mb-1 font-black">Score</p>
                          <p className={cn("text-2xl md:text-3xl font-black tracking-tighter font-mono italic", metric === "score" ? "text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]" : "text-white/60")}>
                            {Math.round(player.score).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase mb-1 font-black">Hours</p>
                          <p className={cn("text-2xl md:text-3xl font-black tracking-tighter font-mono italic", metric === "hours" ? "text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]" : "text-white/60")}>
                            {Math.round(player.hours || 0).toLocaleString()}H
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase mb-1 font-black">Games</p>
                          <p className={cn("text-2xl md:text-3xl font-black tracking-tighter font-mono italic", metric === "games" ? "text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]" : "text-white/60")}>
                            {player.games || 0}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-mono text-zinc-600 tracking-[0.3em] uppercase mb-1 font-black underline decoration-primary/30 underline-offset-4">Achievements</p>
                          <p className={cn("text-2xl md:text-3xl font-black tracking-tighter font-mono italic", metric === "achievements" ? "text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]" : "text-white/60")}>
                            {player.achievements || 0}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </AnimatePresence>
        )}

        {/* Pagination Controls */}
        {!isLoading && ranked.length > playersPerPage && (
          <div className="mt-20 flex items-center justify-center gap-10">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-10 py-5 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black tracking-widest uppercase disabled:opacity-20 hover:bg-white/10 transition-all hover:border-primary/40 text-primary"
            >
              Previous Manifold
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-zinc-600 mb-1">PAGE</span>
              <span className="text-2xl font-black text-white font-mono">{page} <span className="text-zinc-700">/</span> {Math.ceil(ranked.length / playersPerPage)}</span>
            </div>
            <button 
              disabled={page >= Math.ceil(ranked.length / playersPerPage)}
              onClick={() => setPage(p => p + 1)}
              className="px-10 py-5 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black tracking-widest uppercase disabled:opacity-20 hover:bg-white/10 transition-all hover:border-primary/40 text-primary"
            >
              Next Manifold
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
