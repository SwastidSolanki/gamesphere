"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import GameLibrary from "@/components/GameLibrary";
import Navbar from "@/components/Navbar";
import { fetchUnifiedData } from "@/lib/dataFetcher";
import { cn } from "@/lib/utils";
import { 
  Trophy, 
  Gamepad2, 
  Clock, 
  Target, 
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart,
  Area,
  Tooltip, 
  ResponsiveContainer
} from "recharts";

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
        setError("UPLINK_FAILURE: Verify your connection identifiers.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-heading font-bold tracking-[0.3em] text-primary/60 text-xs">SYNCHRONIZING_DATA_VAULT...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-6">
        <GlassCard className="max-w-md w-full p-8 border-red-900/20 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold mb-4">UPLINK_FAILURE</h2>
          <p className="text-zinc-500 text-sm mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all text-xs tracking-widest"
          >
            RETRY_UPLINK
          </button>
        </GlassCard>
      </div>
    );
  }

  const steamProfile = data?.steam?.profile;
  const steamLibrary = data?.steam?.library || [];
  const riotAccount = data?.riot?.account;
  const riotLeague = data?.riot?.league;

  // Merge Libraries
  const unifiedLibrary = [...steamLibrary.map(g => ({
    name: g.name,
    playtime: g.playtime_forever,
    platform: "steam" as const,
    appid: g.appid,
    icon: g.img_icon_url
  }))];

  // Manually add Valorant if Riot data exists
  if (riotAccount) {
    unifiedLibrary.unshift({
      name: "Valorant",
      playtime: 0, // We don't have exact hours from basic Riot API easily without match history sum
      platform: "riot" as const,
      appid: undefined,
      icon: undefined
    });
  }

  const powerScore = Math.round(data.steam.totalPlaytime * 0.4 + (riotLeague?.leaguePoints || 0) * 1.5 + (riotLeague?.wins || 0) * 10);

  return (
    <main className="min-h-screen bg-background font-body pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <Navbar />
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="text-[10px] font-bold text-primary tracking-[0.5em] mb-4 uppercase opacity-50">Command Center</h2>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">PLAYER_ARCHIVE</h1>
        </div>
        
        <div className="flex items-center gap-6 bg-zinc-950/40 border border-white/5 px-8 py-5 rounded-2xl backdrop-blur-3xl">
          <div className="text-right">
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mb-2">Power Score</p>
            <p className="text-4xl font-serif font-bold text-primary">{powerScore}</p>
          </div>
          <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center bg-primary/5">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Steam Summary */}
        <GlassCard className="lg:col-span-2 p-10 border-primary/10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden ring-1 ring-primary/20 ring-offset-4 ring-offset-background">
                {steamProfile?.avatarfull ? (
                  <img src={steamProfile.avatarfull} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Gamepad2 className="w-8 h-8 text-primary mx-auto mt-4" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold">{steamProfile?.personaname || "Unknown Subject"}</h3>
                <p className="text-[10px] font-mono text-primary/60 tracking-widest uppercase mt-1">
                  Status: {steamProfile?.personastate === 1 ? "ONLINE" : "OFFLINE"}
                </p>
              </div>
            </div>
            <a href={steamProfile?.profileurl} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10">
              <ExternalLink className="w-4 h-4 text-zinc-500" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            <StatBox icon={<Clock />} label="Total Playtime" value={`${Math.round(data.steam.totalPlaytime)}h`} />
            <StatBox icon={<Gamepad2 />} label="Games Owned" value={steamLibrary.length} />
            <StatBox icon={<TrendingUp />} label="Last Session" value={steamProfile?.lastlogoff ? new Date(steamProfile.lastlogoff * 1000).toLocaleDateString() : "NEVER"} />
          </div>

          <div className="h-48 w-full opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{d:1,h:4},{d:2,h:2},{d:3,h:6},{d:4,h:1},{d:5,h:8},{d:6,h:12},{d:7,h:5}]}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a7b49e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a7b49e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="h" stroke="#a7b49e" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Riot Summary */}
        <GlassCard className="p-10 border-secondary/10">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold">Riot Identity</h3>
              <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                {riotAccount?.gameName ? `${riotAccount.gameName}#${riotAccount.tagLine}` : "NOT_FOUND"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-zinc-950/40 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Competitive Tier</p>
              <p className="text-2xl font-serif font-bold text-secondary italic">
                {riotLeague ? `${riotLeague.tier} ${riotLeague.rank}` : "UNRANKED"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-600 mb-1 uppercase font-bold tracking-widest">Wins</p>
                <p className="text-xl font-serif font-bold">{riotLeague?.wins || 0}</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-600 mb-1 uppercase font-bold tracking-widest">Losses</p>
                <p className="text-xl font-serif font-bold">{riotLeague?.losses || 0}</p>
              </div>
            </div>

            <div className="p-6 bg-zinc-950/80 rounded-2xl border border-primary/10 text-center">
              <p className="text-[9px] text-primary/40 mb-1 uppercase font-black tracking-[0.3em]">Skill Rating</p>
              <p className="text-3xl font-serif font-bold italic text-primary">
                {riotLeague?.leaguePoints ? `${riotLeague.leaguePoints} LP` : "RECRUIT"}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-[10px] font-black text-primary/40 tracking-[0.6em] mb-3 uppercase">Archives</h2>
            <h1 className="text-3xl font-serif font-bold">UNIFIED_VAULT</h1>
          </div>
          <p className="text-[9px] font-mono text-zinc-600 tracking-tighter">{unifiedLibrary.length} TITLES_DETECTED</p>
        </div>
        <GameLibrary games={unifiedLibrary} />
      </div>

      {/* Dynamic Stats - No fake numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatSummary label="Platform Count" value="2" sub="Steam + Riot" />
        <StatSummary label="Competitive Wins" value={(riotLeague?.wins || 0).toString()} sub="Verified Match Records" />
        <StatSummary label="Total Hours" value={`${Math.round(data.steam.totalPlaytime)}h`} sub="Uplink Confirmed" />
        <StatSummary label="Tier Rating" value={riotLeague?.tier || "UNRANKED"} sub="Live League Data" />
      </div>
    </main>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
      <div className="flex items-center gap-3 mb-2 text-primary/40">
        <div className="p-1.5 bg-primary/5 rounded-lg">{icon}</div>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="text-2xl font-serif font-bold tracking-tight">{value}</p>
    </div>
  );
}

function StatSummary({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <GlassCard className="p-8 border-white/5 hover:border-primary/10 transition-all cursor-default">
      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em] mb-4">{label}</p>
      <p className="text-3xl font-serif font-bold mb-2">{value}</p>
      <p className="text-[10px] font-mono text-primary/40 tracking-widest">{sub}</p>
    </GlassCard>
  );
}
