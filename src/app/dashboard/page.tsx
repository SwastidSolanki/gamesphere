"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  AlertCircle,
  LogOut,
  Sword
} from "lucide-react";
import { 
  AreaChart,
  Area,
  ResponsiveContainer
} from "recharts";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="font-heading tracking-[0.6em] text-primary/60 text-xs">SYNCING_WAR_ARCHIVES...</p>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function loadData() {
      try {
        const steamAuth = searchParams.get("steam_auth");
        if (steamAuth) {
          localStorage.setItem("gamesphere_steam_id", steamAuth);
          // Clear param from URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        }

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
  }, [searchParams]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-heading tracking-[0.6em] text-primary/60 text-xs">SYNCING_WAR_ARCHIVES...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-6">
        <GlassCard className="max-w-md w-full p-10 border-red-900/40 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-4xl font-heading mb-4 tracking-widest">UPLINK_SEVERED</h2>
          <p className="text-zinc-500 text-[10px] mb-10 font-bold uppercase tracking-widest leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-primary/10 border border-primary/40 text-primary font-heading hover:bg-white hover:text-black transition-all text-sm tracking-[0.4em]"
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

  const unifiedLibrary = [...steamLibrary.map(g => ({
    name: g.name,
    playtime: g.playtime_forever,
    platform: "steam" as const,
    appid: g.appid,
    icon: g.img_icon_url
  }))];

  if (riotAccount) {
    // Better estimate: Matches * ~35 mins. Base 120 mins.
    const estimatedPlaytime = ((riotLeague?.wins || 0) + (riotLeague?.losses || 0)) * 35 + 120;
    unifiedLibrary.unshift({
      name: "Valorant",
      playtime: estimatedPlaytime,
      platform: "riot" as const,
      appid: undefined,
      icon: "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt90cd899f8d5cf486/660c681284d72d6226fc965f/VAL_Header.jpg"
    });
  }

  const powerScore = Math.round((data?.steam?.totalPlaytime || 0) * 0.4 + (riotLeague?.leaguePoints || 0) * 1.5 + (riotLeague?.wins || 0) * 10);

  return (
    <main className="min-h-screen font-body pt-32 pb-24 px-6 max-w-7xl mx-auto bg-transparent">
      <Navbar />
      
      {/* HUD HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-6 opacity-40">
            <span className="w-12 h-[1px] bg-primary"></span>
            <h2 className="text-[10px] font-bold text-primary tracking-[0.8em] uppercase font-heading">WAR_ARCHIVES</h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-widest text-white leading-none">SPARTAN_VAULT</h1>
        </div>
        
        <div className="flex flex-col items-end gap-6">
          <div className="flex items-center gap-8 bg-black/60 border border-primary/20 px-10 py-6 rounded-sm backdrop-blur-3xl shadow-[0_0_40px_rgba(212,175,55,0.05)]">
            <div className="text-right">
              <p className="text-[9px] text-primary/40 font-bold uppercase tracking-[0.5em] mb-2">Ascension Score</p>
              <p className="text-5xl font-heading font-bold text-primary">{Math.round(powerScore)}</p>
            </div>
            <div className="w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 shadow-inner">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={() => router.push('/compare')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-bold tracking-widest hover:bg-primary hover:text-black transition-all font-heading"
            >
                <Sword className="w-3 h-3" /> SYNC_WARRIORS
            </button>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-950/20 border border-red-900/40 rounded-sm text-[10px] font-bold tracking-widest hover:bg-red-500 hover:text-white transition-all font-heading"
            >
                <LogOut className="w-3 h-3" /> CLOSE_UPLINK
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
        {/* Steam Vault */}
        <GlassCard className="lg:col-span-2 p-12 border-primary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
          
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-sm bg-zinc-950 border border-primary/20 overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                {steamProfile?.avatarfull ? (
                  <img src={steamProfile.avatarfull} alt="Avatar" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <Gamepad2 className="w-10 h-10 text-primary mx-auto mt-6" />
                )}
              </div>
              <div>
                <h3 className="text-3xl font-heading font-bold tracking-widest">{steamProfile?.personaname || "Unknown Subject"}</h3>
                <p className="text-[10px] font-mono text-primary/40 tracking-[0.4em] uppercase mt-2">
                  LOC: {steamProfile?.loccountrycode || "GLOBAL"} // STATUS: {steamProfile?.personastate === 1 ? "ONLINE" : "OFFLINE"}
                </p>
              </div>
            </div>
            <a href={steamProfile?.profileurl} target="_blank" className="p-4 bg-primary/5 rounded-sm hover:bg-primary transition-all border border-primary/30 group/btn">
              <ExternalLink className="w-5 h-5 text-primary group-hover/btn:text-background" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <StatBox icon={<Clock className="w-4 h-4" />} label="Record Playtime" value={`${Math.round(data?.steam?.totalPlaytime || 0)}h`} />
            <StatBox icon={<Gamepad2 className="w-4 h-4" />} label="Digital Arsenal" value={steamLibrary.length} />
            <StatBox icon={<Target className="w-4 h-4" />} label="Verified ID" value={steamProfile?.steamid?.slice(-8) || "ARCHIVED"} />
          </div>

          <div className="h-56 w-full opacity-60 grayscale hover:grayscale-0 transition-all duration-1000">
             {/* Chart area remains subtle */}
             <div className="w-full h-full bg-gradient-to-t from-primary/5 to-transparent rounded-sm flex items-end">
                {[4,2,6,1,8,12,5,9,3,11].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/60 transition-all cursor-crosshair border-t border-primary/40" style={{ height: `${h * 8}%` }} />
                ))}
             </div>
          </div>
        </GlassCard>

        {/* Riot Vault */}
        <GlassCard className="p-12 border-secondary/10">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-zinc-950 border border-secondary/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,93,78,0.2)]">
              <Target className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-heading font-bold uppercase tracking-widest">RIOT_HUB</h3>
            <p className="text-[10px] font-mono text-secondary/50 tracking-[0.3em] uppercase mt-1">
              {riotAccount?.gameName ? `${riotAccount.gameName}#${riotAccount.tagLine}` : "NOT_FOUND"}
            </p>
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-zinc-950/60 rounded-sm border border-secondary/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <p className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.5em] mb-4">Current Order</p>
              <p className="text-3xl font-heading font-black text-secondary tracking-[0.2em] italic">
                {riotLeague ? `${riotLeague.tier} ${riotLeague.rank}` : "UNRANKED"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 rounded-sm border border-white/5 text-center">
                <p className="text-[8px] text-zinc-600 mb-2 uppercase font-bold tracking-[0.4em]">Victories</p>
                <p className="text-2xl font-heading font-bold text-white tracking-widest">{riotLeague?.wins || 0}</p>
              </div>
              <div className="p-6 bg-white/5 rounded-sm border border-white/5 text-center">
                <p className="text-[8px] text-zinc-600 mb-2 uppercase font-bold tracking-[0.4em]">Defeats</p>
                <p className="text-2xl font-heading font-bold text-zinc-400 tracking-widest">{riotLeague?.losses || 0}</p>
              </div>
            </div>

            <div className="p-8 bg-zinc-950/90 rounded-sm border border-primary/10 text-center relative group">
              <p className="text-[8px] text-primary/30 mb-2 uppercase font-black tracking-[0.5em]">Battle Prowess</p>
              <p className="text-4xl font-heading font-black text-primary tracking-widest">
                {riotLeague?.leaguePoints ? `${riotLeague.leaguePoints} LP` : "RECRUIT"}
              </p>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mb-24">
        <div className="flex items-center justify-between mb-16 px-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-primary/40"></div>
            <h1 className="text-4xl font-heading font-black tracking-[0.3em]">GRAND_VAULT</h1>
          </div>
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest">DETECTED: {unifiedLibrary.length} TITLES</p>
        </div>
        <GameLibrary games={unifiedLibrary} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <MiniStat label="Legacy Links" value="02" sub="Platforms Synchronized" />
        <MiniStat label="Battle Victories" value={(Math.round(riotLeague?.wins || 0)).toString()} sub="Live War Records" />
        <MiniStat label="Total Playtime" value={`${Math.round(data?.steam?.totalPlaytime || 0)}h`} sub="Journey Confirmed" />
        <MiniStat label="Order Level" value={riotLeague?.tier || "NONE"} sub="Live Ranking" />
      </div>
    </main>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="p-8 bg-primary/5 rounded-sm border border-primary/10 hover:border-primary/40 transition-all backdrop-blur-md">
      <div className="flex items-center gap-4 mb-4 text-primary/50">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.4em] font-heading">{label}</span>
      </div>
      <p className="text-3xl font-heading font-bold tracking-widest text-white">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <GlassCard className="p-10 border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.5em] mb-4 group-hover:text-primary transition-colors">{label}</p>
      <p className="text-4xl font-heading font-bold mb-3 tracking-widest">{value}</p>
      <p className="text-[10px] font-heading italic text-white/30 tracking-widest opacity-60">{sub}</p>
    </GlassCard>
  );
}
