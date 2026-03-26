"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { fetchUnifiedData } from "@/lib/dataFetcher";
import { Search, Loader2, Sword, Shield, Target, Swords, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Default ID if none set
    const savedId = localStorage.getItem("gamesphere_steam_id");
    if (savedId && !id1) setId1(savedId);
  }, []);

  const handleCompare = async () => {
    if (!id2) return;
    setLoading(true);
    try {
      const p1 = await fetchUnifiedData(id1 || "SwastidSolanki", "", "");
      const p2 = await fetchUnifiedData(id2, "", "");
      setResults({ p1, p2 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen font-mono pt-32 pb-32 px-6 max-w-7xl mx-auto bg-[#0d0e12] selection:bg-primary/30 relative">
      <Navbar />
      
      {/* Header section with cinematic typography */}
      <div className="relative z-10 mb-20">
        <div className="flex items-center gap-3 mb-6 opacity-40">
          <span className="w-12 h-[1px] bg-primary"></span>
          <p className="text-[10px] font-bold tracking-[0.6em] text-red-500 mb-6 uppercase">Trial_of_the_Gods // BATTLE_ANALYSIS</p>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-12 uppercase leading-[0.8]">
            FATES <br /> <span className="text-red-500">INTERTWINED</span>
          </h1>
        <p className="text-zinc-500 max-w-2xl font-mono text-xs tracking-widest uppercase leading-relaxed">
          Differential analysis between two player entities. Synchronizing Steam archives for objective evaluation.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard className="p-8 border-white/5 bg-black/60 backdrop-blur-md">
            <label className="text-[10px] font-black text-primary/60 tracking-[0.4em] block mb-5 uppercase font-mono">UNIT_01 (Current ID)</label>
            <div className="relative group">
              <input 
                type="text" 
                value={id1}
                onChange={(e) => setId1(e.target.value)}
                placeholder="YOUR_UPLINK_ID"
                className="w-full bg-zinc-950/50 border border-white/10 p-5 rounded-xl font-mono text-sm tracking-widest focus:border-primary/40 focus:outline-none transition-all pl-14 text-white placeholder:text-zinc-700"
              />
              <User className="absolute left-5 top-5 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard className="p-8 border-white/5 bg-black/60 backdrop-blur-md">
            <label className="text-[10px] font-black text-primary/60 tracking-[0.4em] block mb-5 uppercase font-mono">UNIT_02 (Target ID)</label>
            <div className="relative group">
              <input 
                type="text" 
                value={id2}
                onChange={(e) => setId2(e.target.value)}
                placeholder="TARGET_UPLINK_ID"
                className="w-full bg-zinc-950/50 border border-white/10 p-5 rounded-xl font-mono text-sm tracking-widest focus:border-primary/40 focus:outline-none transition-all pl-14 text-white placeholder:text-zinc-700"
              />
              <Target className="absolute left-5 top-5 w-5 h-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <button 
        onClick={handleCompare}
        disabled={loading || !id2}
        className="w-full py-7 bg-white/5 border border-white/10 text-white font-black tracking-[0.6em] mb-16 hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-4 disabled:opacity-20 rounded-xl group relative overflow-hidden uppercase text-xs"
      >
        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 flex items-center gap-3">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Swords className="w-5 h-5" /> SYNC_NODES</>}
        </span>
      </button>

      <AnimatePresence mode="wait">
        {results && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-start"
          >
            {/* Player 1 Card */}
            <div className={cn("lg:col-span-2 transition-all duration-700", results.p1.steam.profile.personaname.toLowerCase().includes("kratos") ? "scale-105" : "")}>
               <PlayerCompareCard player={results.p1} />
            </div>

            {/* Comparison Metrics */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex flex-col items-center gap-6 mb-8 justify-center">
                <div className="p-4 bg-zinc-950 border border-white/10 rounded-full shadow-2xl relative">
                   <Swords className="w-8 h-8 text-primary" />
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-primary tracking-[0.5em]">VS</div>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </div>
              
              <MetricComp label="Total Playtime" val1={Math.round(results.p1.steam.totalPlaytime)} val2={Math.round(results.p2.steam.totalPlaytime)} unit="H" />
              <MetricComp label="Titles Logged" val1={results.p1.steam.library.length} val2={results.p2.steam.library.length} />
              <MetricComp label="Account Tier" val1={results.p1.steam.level || 0} val2={results.p2.steam.level || 0} prefix="LVL " />
              <MetricComp label="Battle Power" val1={(results.p1.steam.totalPlaytime * 0.4) + (results.p1.steam.level * 10)} val2={(results.p2.steam.totalPlaytime * 0.4) + (results.p2.steam.level * 10)} unit=" BP" />
              
              <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <p className="text-[10px] font-mono text-primary/60 tracking-widest uppercase mb-1 relative z-10">Combat Result</p>
                <p className="text-sm font-black text-white tracking-[0.2em] uppercase relative z-10">
                  {results.p1.steam.profile.personaname.toLowerCase().includes("kratos") 
                    ? "DIVINE_ENTROP_ESTABLISHED // KRATOS_VICTORY" 
                    : results.p1.steam.totalPlaytime > results.p2.steam.totalPlaytime 
                      ? "UNIT_01_DOMINANCE" 
                      : "UNIT_02_SUPERIORITY"}
                </p>
              </div>
            </div>

            {/* Player 2 Card */}
            <div className="lg:col-span-2">
               <PlayerCompareCard player={results.p2} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function PlayerCompareCard({ player }: { player: any }) {
  const profile = player.steam.profile;
  const level = player.steam.level ?? 0;
  const isOnline = profile.personastate === 1;

  return (
    <GlassCard className="p-8 border-white/5 bg-black/40 backdrop-blur-md hover:border-primary/20 transition-all">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-32 h-32 rounded-2xl border-2 border-primary/30 overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.1)] relative">
          <img src={profile.avatarfull} className="w-full h-full object-cover grayscale-[0.3]" alt="PFP" />
          <div className={cn("absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-[#0d0e12]", isOnline ? "bg-green-500" : "bg-zinc-600")} />
        </div>
        
        <div>
            <h2 className="text-2xl font-black tracking-tighter mb-6 uppercase">ASCEND_TO_THE_HALL_OF_HEROES</h2>
            <p className="text-zinc-500 text-sm mb-8 font-bold tracking-tight">
              Forge your identity across the multi-verse. Choose your realm and enter the archive.
            </p>
          <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4">
            {profile.loccountrycode || "GLOBAL"} // {isOnline ? "ONLINE" : "OFFLINE"}
          </p>
          
          {/* Steam Level Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#4a90d9] to-[#1a5fa8] rounded-sm border border-white/20 shadow-[0_0_15px_rgba(74,144,217,0.4)]">
            <span className="text-white font-black text-lg">Level {level}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function MetricComp({ label, val1, val2, unit = "", prefix = "" }: { label: string, val1: number, val2: number, unit?: string, prefix?: string }) {
  const diff = val1 - val2;
  return (
    <div className="bg-black/40 p-6 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
      <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 text-center">{label}</p>
      <div className="flex items-center justify-between gap-6 px-2">
        <div className="w-20 text-center">
            <span className={cn("text-2xl font-black font-heading transition-all", diff > 0 ? "text-primary scale-110" : "text-zinc-600")}>
                {prefix}{Math.round(val1)}{unit}
            </span>
        </div>
        
        <div className="h-[2px] flex-1 bg-white/5 relative overflow-hidden rounded-full">
          <div className={cn(
              "absolute inset-0 transition-all duration-1000",
              diff > 0 ? "bg-gradient-to-r from-primary/40 to-transparent" : "bg-gradient-to-l from-primary/40 to-transparent"
          )} style={{ width: Math.abs(diff) > 0 ? '100%' : '0%' }} />
          <div className={cn(
              "absolute top-0 bottom-0 w-2 shadow-[0_0_10px_rgba(0,229,255,0.8)] bg-primary transition-all duration-700",
              diff > 0 ? "left-0" : diff < 0 ? "right-0" : "left-1/2 -translate-x-1/2 opacity-0"
          )} />
        </div>

        <div className="w-20 text-center">
            <span className={cn("text-2xl font-black font-heading transition-all", diff < 0 ? "text-primary scale-110" : "text-zinc-600")}>
                {prefix}{Math.round(val2)}{unit}
            </span>
        </div>
      </div>
    </div>
  );
}
