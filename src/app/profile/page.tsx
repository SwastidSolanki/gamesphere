"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { 
  Trophy, 
  Gamepad2, 
  Clock, 
  Target, 
  Shield, 
  Zap,
  Star,
  Activity
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";

const SKILL_DATA = [
  { subject: 'Aim', A: 120, B: 110, fullMark: 150 },
  { subject: 'Strategy', A: 98, B: 130, fullMark: 150 },
  { subject: 'Consistency', A: 86, B: 130, fullMark: 150 },
  { subject: 'Teamwork', A: 99, B: 100, fullMark: 150 },
  { subject: 'Speed', A: 85, B: 90, fullMark: 150 },
  { subject: 'Game Sense', A: 65, B: 85, fullMark: 150 },
];

export default function ProfilePage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-12">
        <div className="h-64 rounded-3xl overflow-hidden relative border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-black bg-zinc-900 overflow-hidden shadow-2xl relative shrink-0">
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                </div>
            </div>
            <div className="pb-1 md:pb-2">
              <h1 className="text-2xl md:text-4xl font-heading font-bold tracking-tight mb-1 uppercase">SWASTID_SOLANKI</h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20">ELITE TIER</span>
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Global Rank #1,240</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Metrics */}
        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> SKILL_ENGINE
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILL_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 8 }} />
                  <Radar
                    name="Swastid"
                    dataKey="A"
                    stroke="#00E5FF"
                    fill="#00E5FF"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-secondary" /> TROPHY_CASE
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Star className="w-4 h-4 text-secondary/40 group-hover:text-secondary" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Middle/Right Column: Multi-Platform Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="flex flex-col h-full">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> INTEGRATED_TIMELINE
            </h3>
            
            <div className="space-y-8 pl-4 border-l border-white/5 relative">
              <TimelineItem 
                platform="RIOT"
                title="Promoted to Diamond IV"
                desc="Win streak: 5 matches in Valorant Competitive"
                time="2h ago"
                color="text-secondary"
              />
              <TimelineItem 
                platform="STEAM"
                title="God-Slayer Achievement"
                desc="Completed Elden Ring: Shadow of the Erdtree"
                time="1d ago"
                color="text-primary"
              />
              <TimelineItem 
                platform="RIOT"
                title="MVP Performance"
                desc="25 kills, 4 deaths as Jett in Ascent"
                time="2d ago"
                color="text-secondary"
              />
              <TimelineItem 
                platform="STEAM"
                title="New Top Record"
                desc="12,000 damage dealt in Black Myth: Wukong"
                time="3d ago"
                color="text-primary"
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ platform, title, desc, time, color }: any) {
  return (
    <div className="relative">
      <div className={cn("absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-black border-2 border-primary", platform === "RIOT" && "border-secondary")} />
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className={cn("text-[10px] font-bold tracking-tighter px-2 py-0.5 rounded bg-white/5", color)}>{platform}</span>
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{time}</span>
        </div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-zinc-500 font-light">{desc}</p>
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

import { cn } from "@/lib/utils";
