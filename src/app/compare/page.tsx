"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { fetchUnifiedData } from "@/lib/dataFetcher";
import { Search, Loader2, Sword, Shield, Target } from "lucide-react";

export default function ComparePage() {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
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
    <main className="min-h-screen bg-background font-body pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <Navbar />
      
      <div className="text-center mb-16">
        <h2 className="text-[10px] font-bold text-primary tracking-[0.8em] mb-4 uppercase opacity-50">Military Intelligence</h2>
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-widest text-white mb-8">COMBAT_COMPARISON</h1>
        <p className="text-zinc-500 max-w-xl mx-auto font-serif italic text-lg opacity-80">
          Measure thy strength against thy peers. Bound by data, judged by skill.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <GlassCard className="p-8">
          <label className="text-[10px] font-bold text-primary/60 tracking-widest block mb-4 uppercase font-mono">Warrior I (Current or Steam ID)</label>
          <div className="relative">
            <input 
              type="text" 
              value={id1}
              onChange={(e) => setId1(e.target.value)}
              placeholder="CURRENT_UPLINK"
              className="w-full bg-zinc-950/50 border border-white/10 p-5 rounded-xl font-mono text-xs tracking-widest focus:border-primary/40 focus:outline-none transition-all pl-12"
            />
            <Search className="absolute left-4 top-4 w-5 h-5 text-zinc-600" />
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <label className="text-[10px] font-bold text-primary/60 tracking-widest block mb-4 uppercase font-mono">Warrior II (Opponent Steam ID)</label>
          <div className="relative">
            <input 
              type="text" 
              value={id2}
              onChange={(e) => setId2(e.target.value)}
              placeholder="TARGET_UPLINK_ID"
              className="w-full bg-zinc-950/50 border border-white/10 p-5 rounded-xl font-mono text-xs tracking-widest focus:border-primary/40 focus:outline-none transition-all pl-12"
            />
            <Search className="absolute left-4 top-4 w-5 h-5 text-zinc-600" />
          </div>
        </GlassCard>
      </div>

      <button 
        onClick={handleCompare}
        disabled={loading}
        className="w-full py-6 bg-primary/10 border border-primary/40 text-primary font-serif font-bold tracking-[0.4em] mb-16 hover:bg-primary hover:text-background transition-all flex items-center justify-center gap-4 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "EXECUTE_COMPARISON"}
      </button>

      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Warrior 1 Column */}
          <div className="space-y-6">
             <PlayerCompareCard player={results.p1} />
          </div>

          {/* Comparison Center */}
          <div className="space-y-6 flex flex-col justify-center">
            <MetricComp label="Record Playtime" val1={results.p1.steam.totalPlaytime} val2={results.p2.steam.totalPlaytime} unit="h" />
            <MetricComp label="Titles Owned" val1={results.p1.steam.library.length} val2={results.p2.steam.library.length} />
          </div>

          {/* Warrior 2 Column */}
          <div className="space-y-6">
             <PlayerCompareCard player={results.p2} />
          </div>
        </motion.div>
      )}
    </main>
  );
}

function PlayerCompareCard({ player }: { player: any }) {
  const profile = player.steam.profile;
  return (
    <GlassCard className="p-8 border-primary/10">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-primary/20 overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.1)]">
          <img src={profile.avatarfull} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-2xl font-serif font-bold leading-tight">{profile.personaname}</h3>
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest mt-1">LVL {player.steam.level || "ARCHIVED"}</p>
        </div>
      </div>
    </GlassCard>
  );
}

function MetricComp({ label, val1, val2, unit = "" }: { label: string, val1: number, val2: number, unit?: string }) {
  const diff = val1 - val2;
  return (
    <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">{label}</p>
      <div className="flex items-center justify-between gap-8 px-4">
        <span className={cn("text-2xl font-serif font-bold", diff > 0 && "text-primary")}>{val1}{unit}</span>
        <div className="h-px flex-1 bg-white/10 relative">
          <div className={cn("absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full", diff > 0 ? "bg-primary left-0" : "bg-zinc-500 right-0")} />
        </div>
        <span className={cn("text-2xl font-serif font-bold", diff < 0 && "text-primary")}>{val2}{unit}</span>
      </div>
    </div>
  );
}
