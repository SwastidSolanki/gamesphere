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

import { useEffect, useState } from "react";
import GameLibrary from "@/components/GameLibrary";
import { fetchUnifiedData } from "@/lib/dataFetcher";
import { Loader2, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const steamId = localStorage.getItem("gamesphere_steam_id") || "SwastidSolanki";
        const riotId = localStorage.getItem("gamesphere_riot_id") || "Swastid#SOLO";
        
        const [riotName, riotTag] = riotId.split("#");
        
        const unifiedData = await fetchUnifiedData(steamId, riotName, riotTag || "SOLO");
        setData(unifiedData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("CONNECTION_INTERRUPTED: Check your API keys and identifiers.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-heading font-bold tracking-tighter text-zinc-500">SYNCHRONIZING_DATA_STREAM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black px-6">
        <GlassCard className="max-w-md w-full p-8 border-red-500/20 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold mb-4">UPLINK_FAILURE</h2>
          <p className="text-zinc-500 text-sm mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-heading font-bold hover:bg-white/10 transition-all"
          >
            RETRY_CONNECTION
          </button>
        </GlassCard>
      </div>
    );
  }

  const steamProfile = data?.steam?.profile || MOCK_DATA.steam;
  const steamLibrary = data?.steam?.library || [];
  const powerScore = data ? Math.round(data.steam.totalPlaytime * 0.5 + (data.riot.league?.leaguePoints || 0) * 2) : MOCK_DATA.powerScore;

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
            <p className="text-3xl font-heading font-bold text-primary">{powerScore}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary/10">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Steam Overview */}
        <GlassCard className="lg:col-span-2 border-primary/20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                {steamProfile.avatar ? (
                  <img src={steamProfile.avatar} alt="Steam Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Gamepad2 className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{steamProfile.personaname || "Steam Profile"}</h3>
                <p className="text-sm text-zinc-500 uppercase tracking-widest font-mono text-[10px]">
                  {steamProfile.realname || "REDACTED"}
                </p>
              </div>
            </div>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatBox icon={<Clock className="w-4 h-4" />} label="Total Playtime" value={`${Math.round(data?.steam.totalPlaytime || MOCK_DATA.steam.hours)}h`} />
            <StatBox icon={<Trophy className="w-4 h-4" />} label="Titles Owned" value={steamLibrary.length} />
            <StatBox icon={<Gamepad2 className="w-4 h-4" />} label="Steam Status" value={steamProfile.personastate === 1 ? "ONLINE" : "OFFLINE"} />
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
                <p className="text-sm text-zinc-500">{data?.riot.account.gameName || MOCK_DATA.riot.summoner}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Current Rank</span>
              <span className="text-secondary font-bold font-heading text-sm">
                {data?.riot.league ? `${data.riot.league.tier} ${data.riot.league.rank}` : "UNRANKED"}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest font-bold">Wins</p>
                <p className="text-xl font-bold font-mono">{data?.riot.league?.wins || 0}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest font-bold">Losses</p>
                <p className="text-xl font-bold font-mono">{data?.riot.league?.losses || 0}</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 text-center">
              <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest font-bold">League Points</p>
              <p className="text-2xl font-bold text-secondary font-heading">{data?.riot.league?.leaguePoints || 0} LP</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-12">
        <GameLibrary games={steamLibrary.map((g: any) => ({
          name: g.name,
          playtime: g.playtime_forever,
          platform: "steam" as const,
          appid: g.appid,
          icon: g.img_icon_url
        }))} />
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
