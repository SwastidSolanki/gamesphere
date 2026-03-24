"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { 
  Users2, 
  Swords, 
  Zap, 
  Target, 
  Shield, 
  Activity,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";

const COMPARISON_DATA = {
  p1: {
    name: "Swastid_Solanki",
    score: 8420,
    tier: "Elite",
    stats: [
        { subject: 'Aim', val: 120 },
        { subject: 'Strategy', val: 98 },
        { subject: 'Consistency', val: 86 },
        { subject: 'Teamwork', val: 99 },
        { subject: 'Game Sense', val: 65 },
    ]
  },
  p2: {
    name: "AcePlayer",
    score: 9840,
    tier: "Legend",
    stats: [
        { subject: 'Aim', val: 145 },
        { subject: 'Strategy', val: 130 },
        { subject: 'Consistency', val: 140 },
        { subject: 'Teamwork', val: 120 },
        { subject: 'Game Sense', val: 140 },
    ]
  }
};

const MERGED_SKILLS = COMPARISON_DATA.p1.stats.map((s, i) => ({
    subject: s.subject,
    A: s.val,
    B: COMPARISON_DATA.p2.stats[i].val,
    fullMark: 150
}));

export default function ComparePage() {
  const matchScore = 78; // Calculated match percentage

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-xs font-heading font-bold text-primary tracking-[0.3em] mb-2 uppercase opacity-60">Combat Comparison</h2>
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">VERSUS_MATCH_ENGINE</h1>
        <p className="text-zinc-500 max-w-xl mx-auto text-xs font-mono opacity-50">Analyzing playstyles, performance data, and cross-platform achievements to find your perfect competitive match.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 items-center">
        {/* Player 1 */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <PlayerVersusCard player={COMPARISON_DATA.p1} color="cyan" />
        </div>

        {/* Comparison Engine */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <GlassCard className="p-8 text-center bg-primary/5 border-primary/20">
            <div className="flex justify-center mb-8 relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center bg-black relative z-10">
                    <Swords className="w-12 h-12 text-primary" />
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Sync Compatibility</h3>
                <div className="text-5xl font-heading font-bold text-primary">{matchScore}%</div>
                <div className="text-xs font-bold text-primary mt-2 uppercase tracking-tighter">GOOD_MATCH_DETECTED</div>
            </div>

            <div className="h-64 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MERGED_SKILLS}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 10 }} />
                    <Radar
                        name={COMPARISON_DATA.p1.name}
                        dataKey="A"
                        stroke="#00E5FF"
                        fill="#00E5FF"
                        fillOpacity={0.3}
                    />
                    <Radar
                        name={COMPARISON_DATA.p2.name}
                        dataKey="B"
                        stroke="#FFB300"
                        fill="#FFB300"
                        fillOpacity={0.3}
                    />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-tighter opacity-60">
                Playstyle overlap: High | Strategic alignment: Medium | Rank gap: 1 Tier
            </p>
          </GlassCard>
        </div>

        {/* Player 2 */}
        <div className="lg:col-span-2 space-y-6 order-3">
          <PlayerVersusCard player={COMPARISON_DATA.p2} color="amber" />
        </div>
      </div>
    </div>
  );
}

function PlayerVersusCard({ player, color }: any) {
    return (
        <GlassCard className="text-center p-8 bg-black/40 border-white/5">
            <div className="w-24 h-24 rounded-3xl border-2 border-white/5 bg-zinc-900 mx-auto mb-6 flex items-center justify-center">
                <UserIcon className={cn("w-12 h-12", color === "cyan" ? "text-primary" : "text-secondary")} />
            </div>
            <h4 className="font-heading font-bold text-lg mb-1 truncate">{player.name}</h4>
            <span className={cn(
                "text-[10px] font-bold px-3 py-1 rounded-full border mb-6 inline-block uppercase",
                color === "cyan" ? "border-primary/30 text-primary bg-primary/5" : "border-secondary/30 text-secondary bg-secondary/5"
            )}>
                {player.tier} RANK
            </span>

            <div className="space-y-3 pt-6 border-t border-white/5">
                {player.stats.slice(0, 3).map((s: any) => (
                    <div key={s.subject} className="flex justify-between items-center px-2">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{s.subject}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className={cn("h-full", color === "cyan" ? "bg-primary" : "bg-secondary")} style={{ width: `${(s.val/150)*100}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400">{s.val}</span>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
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
