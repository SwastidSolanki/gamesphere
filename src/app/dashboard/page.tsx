"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { cn } from "@/lib/utils";
import { 
  Trophy, 
  Gamepad2, 
  Clock, 
  Target, 
  TrendingUp,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const MOCK_DATA = {
  powerScore: 8420,
  rank: "Elite",
  steam: {
    name: "Swastid Solanki",
    hours: 2450,
    achievements: 412,
    topGame: "Elden Ring",
    recentActivity: [
      { day: "Mon", hours: 4 },
      { day: "Tue", hours: 2 },
      { day: "Wed", hours: 6 },
      { day: "Thu", hours: 1 },
      { day: "Fri", hours: 8 },
      { day: "Sat", hours: 12 },
      { day: "Sun", hours: 5 },
    ]
  },
  riot: {
    summoner: "GameSphere#SOLO",
    rank: "Diamond IV",
    winRate: 58,
    kd: 1.42,
    matches: [
      { id: 1, result: "Win", champ: "Jett", kda: "18/5/2" },
      { id: 2, result: "Loss", champ: "Reyna", kda: "12/15/4" },
      { id: 3, result: "Win", champ: "Sage", kda: "8/10/25" },
    ]
  }
};

export default function DashboardPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-xs font-heading font-bold text-primary tracking-[0.3em] mb-2 uppercase opacity-60">Command Center</h2>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">PLAYER_DASHBOARD</h1>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900/50 border border-white/5 px-6 py-4 rounded-2xl backdrop-blur-md">
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Overall Power Score</p>
            <p className="text-3xl font-heading font-bold text-primary">{MOCK_DATA.powerScore}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary/10">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Steam Overview */}
        <GlassCard className="lg:col-span-2 border-primary/20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Steam Profile</h3>
                <p className="text-sm text-zinc-500">{MOCK_DATA.steam.name}</p>
              </div>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatBox icon={<Clock className="w-4 h-4" />} label="Total Playtime" value={`${MOCK_DATA.steam.hours}h`} />
            <StatBox icon={<Trophy className="w-4 h-4" />} label="Achievements" value={MOCK_DATA.steam.achievements} />
            <StatBox icon={<Gamepad2 className="w-4 h-4" />} label="Top Game" value={MOCK_DATA.steam.topGame} />
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA.steam.recentActivity}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="hours" stroke="#00E5FF" fillOpacity={1} fill="url(#colorHours)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131314", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#00E5FF" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Riot Stats */}
        <GlassCard className="border-secondary/20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Riot Games</h3>
                <p className="text-sm text-zinc-500">{MOCK_DATA.riot.summoner}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-zinc-500 text-sm">Current Rank</span>
              <span className="text-secondary font-bold font-space-grotesk">{MOCK_DATA.riot.rank}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-tighter">Win Rate</p>
                <p className="text-xl font-bold">{MOCK_DATA.riot.winRate}%</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-zinc-500 mb-1 uppercase tracking-tighter">KD Ratio</p>
                <p className="text-xl font-bold">{MOCK_DATA.riot.kd}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Recent Matches</p>
              {MOCK_DATA.riot.matches.map(match => (
                <div key={match.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className={match.result === "Win" ? "text-green-500" : "text-red-500"}>{match.result}</span>
                    <span className="text-sm">{match.champ}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">{match.kda}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatSummary label="Global Rank" value="#1,240" delta="+12" />
        <StatSummary label="Achievements" value="94%" delta="+2%" />
        <StatSummary label="Tournament Wins" value="14" delta="0" />
        <StatSummary label="Skill Rating" value="A+" delta="-" />
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center gap-2 mb-1 text-zinc-500">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-bold font-space-grotesk tracking-tight">{value}</p>
    </div>
  );
}

function StatSummary({ label, value, delta }: { label: string, value: string, delta: string }) {
  return (
    <GlassCard className="p-4">
      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold font-space-grotesk">{value}</p>
        <span className={cn(
          "text-xs font-bold font-mono px-2 py-1 rounded bg-white/5",
          delta.startsWith("+") ? "text-green-500" : delta === "-" ? "text-zinc-500" : "text-zinc-500"
        )}>{delta}</span>
      </div>
    </GlassCard>
  );
}
