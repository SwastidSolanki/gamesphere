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
  Sword,
  ShieldCheck,
  Zap,
  Lock,
  Search,
  Check
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
  const [dashboardMode, setDashboardMode] = useState<"steam" | "riot">("steam");
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

        // Handle Riot Identity Callback
        const riotAuth = searchParams.get('riot_auth');
        const riotNameParam = searchParams.get('riot_name');
        const riotTagParam = searchParams.get('riot_tag');
        if (riotAuth === 'success' && riotNameParam && riotTagParam) {
            localStorage.setItem('gamesphere_riot_id', `${riotNameParam}#${riotTagParam}`);
            // Clean URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            window.location.reload();
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

  const unifiedLibrary = [...steamLibrary.map((g: any) => ({
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

  const riotError = searchParams.get('riot_error');

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white p-4 md:p-8 font-heading overflow-x-hidden relative">
      <Navbar />

      {/* Warning Overlay for missing credentials */}
      {riotError === 'CREDENTIALS_MISSING' && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between gap-6 backdrop-blur-xl relative z-50"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/20 rounded-full animate-pulse">
                    <ShieldCheck className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h3 className="text-lg font-black tracking-widest text-red-500 uppercase">CREDENTIALS_MISSING // RIOT_HANDSHAKE_HALTED</h3>
                    <p className="text-zinc-500 text-xs uppercase font-bold tracking-tighter">Your Spartan Vault requires a RIOT_CLIENT_ID in the .env file to forge this connection.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        localStorage.setItem('gamesphere_riot_id', 'SWIFT#FORGED');
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, '', newUrl);
                        window.location.reload();
                    }}
                    className="px-6 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase transition-all"
                >
                    FORGE_MOCK_IDENTITY
                </button>
                <button 
                    onClick={() => {
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, '', newUrl);
                        window.location.reload();
                    }}
                    className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[10px] font-black tracking-widest uppercase transition-all"
                >
                    ACKNOWLEDGE
                </button>
            </div>
        </motion.div>
      )}
      
      {/* HUD HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6 opacity-40">
            <span className="w-12 h-[1px] bg-primary"></span>
            <h2 className="text-[10px] font-bold text-primary tracking-[0.8em] uppercase font-heading">WAR_ARCHIVES // {dashboardMode.toUpperCase()}</h2>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <button 
                onClick={() => setDashboardMode("steam")}
                className={cn(
                    "px-8 py-4 font-heading text-lg tracking-[0.3em] border transition-all relative overflow-hidden group",
                    dashboardMode === "steam" ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]" : "bg-black/40 text-white/40 border-white/5 hover:border-white/20"
                )}
            >
                STEAM DASHBOARD
                {dashboardMode === "steam" && <motion.div layoutId="mode-glint" className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />}
            </button>
            <button 
                onClick={() => setDashboardMode("riot")}
                className={cn(
                    "px-8 py-4 font-heading text-lg tracking-[0.3em] border transition-all relative overflow-hidden group",
                    dashboardMode === "riot" ? "bg-[#d13639] text-white border-[#d13639] shadow-[0_0_30px_rgba(209,54,57,0.3)]" : "bg-black/40 text-white/40 border-white/5 hover:border-white/20"
                )}
            >
                RIOT DASHBOARD
                {dashboardMode === "riot" && <motion.div layoutId="mode-glint" className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />}
            </button>
          </div>

          <h1 className="text-5xl md:text-8xl font-heading font-black tracking-widest text-white leading-none">
            {dashboardMode === "steam" ? "VALHALLA_VAULT" : "RIOT_NEXUS"}
          </h1>
        </div>
        
        <div className="flex flex-col items-end gap-6 pt-4">
          {/* Steam Mini Profile always visible in header for Steam mode or when linked */}
          {dashboardMode === "steam" && steamProfile && (
              <GlassCard className="p-4 border-white/10 flex items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all">
                  <div className="w-12 h-12 rounded-sm bg-zinc-950 border border-primary/20 overflow-hidden relative">
                      <img src={steamProfile.avatarfull} alt="PFP" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                      <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0d0e12] rounded-full", steamProfile.personastate === 1 ? "bg-green-500" : "bg-zinc-600")} />
                  </div>
                  <div className="pr-4">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{steamProfile.personaname}</p>
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">LVL: {Math.floor(data?.steam?.totalPlaytime / 100) || 0} // {steamProfile.loccountrycode || "GLB"}</p>
                  </div>
              </GlassCard>
          )}

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

      {dashboardMode === "steam" ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
        {/* Steam Vault */}
        <GlassCard className="lg:col-span-3 p-12 border-primary/10 relative overflow-hidden group">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <StatBox icon={<Clock className="w-4 h-4" />} label="Record Playtime" value={`${Math.round(data?.steam?.totalPlaytime || 0)}h`} />
            <StatBox icon={<Gamepad2 className="w-4 h-4" />} label="Digital Arsenal" value={steamLibrary.length} />
            <StatBox icon={<Target className="w-4 h-4" />} label="Verified ID" value={steamProfile?.steamid?.slice(-8) || "ARCHIVED"} />
            <StatBox icon={<ShieldCheck className="w-4 h-4" />} label="Security Protocol" value="ACTIVE" />
          </div>

          <div className="h-56 w-full opacity-60 grayscale hover:grayscale-0 transition-all duration-1000">
             <div className="w-full h-full bg-gradient-to-t from-primary/5 to-transparent rounded-sm flex items-end">
                {[4,2,6,1,8,12,5,9,3,11,7,10,2,4,8,1].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/60 transition-all cursor-crosshair border-t border-primary/40" style={{ height: `${h * 8}%` }} />
                ))}
             </div>
          </div>
        </GlassCard>
      </div>
      ) : (
      <div className="mb-20">
        {riotAccount ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Large Riot Vault */}
                <GlassCard className="lg:col-span-3 p-12 border-secondary/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/10 transition-colors" />
                    
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-full bg-zinc-950 border border-secondary/30 flex items-center justify-center shadow-[0_0_30px_rgba(74,93,78,0.2)]">
                                <Target className="w-10 h-10 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-heading font-bold tracking-widest uppercase">{riotAccount.gameName}#{riotAccount.tagLine}</h3>
                                <p className="text-[10px] font-mono text-secondary/40 tracking-[0.4em] uppercase mt-2">
                                    REGION: {riotLeague?.tier ? "VALORANT_MAIN" : "UNRANKED_NODE"} // ACCESS: GRANTED
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        <div className="p-8 bg-zinc-950/60 rounded-sm border border-secondary/10 text-center relative overflow-hidden group">
                            <p className="text-[9px] font-black text-secondary/30 uppercase tracking-[0.5em] mb-4">Current Order</p>
                            <p className="text-3xl font-heading font-black text-secondary tracking-[0.2em] italic">
                                {riotLeague ? `${riotLeague.tier} ${riotLeague.rank}` : "UNRANKED"}
                            </p>
                        </div>
                        <StatBox icon={<Sword className="w-4 h-4" />} label="Victories" value={riotLeague?.wins || 0} />
                        <StatBox icon={<ShieldCheck className="w-4 h-4" />} label="Defeats" value={riotLeague?.losses || 0} />
                        <div className="p-8 bg-zinc-950/90 rounded-sm border border-primary/10 text-center relative group">
                            <p className="text-[8px] text-primary/30 mb-2 uppercase font-black tracking-[0.5em]">Battle Prowess</p>
                            <p className="text-4xl font-heading font-black text-primary tracking-widest">
                                {riotLeague?.leaguePoints ? `${riotLeague.leaguePoints} LP` : "RECRUIT"}
                            </p>
                        </div>
                    </div>

                    <div className="h-40 w-full bg-gradient-to-r from-secondary/5 via-secondary/10 to-transparent rounded-sm flex items-center justify-center border border-white/5 lowercase font-mono text-[10px] text-secondary/40 tracking-widest">
                        Handshake verified // Nexus sync active...
                    </div>
                </GlassCard>
            </div>
        ) : (
            <GlassCard className="p-20 text-center border-red-900/40">
                <Lock className="w-16 h-16 text-red-500 mx-auto mb-8 animate-pulse" />
                <h2 className="text-5xl font-heading mb-6 tracking-widest">ACCESS_DENIED</h2>
                <p className="text-zinc-500 text-xs mb-12 font-bold uppercase tracking-[0.4em] max-w-lg mx-auto leading-loose">
                    Your Spartan Vault has not been synchronized with the Riot Nexus. Link your identity to unlock Battle Prowess analytics.
                </p>
                <button 
                    onClick={() => window.location.href = "/api/auth/riot"}
                    className="px-12 py-5 bg-[#d13639] text-white font-heading tracking-[0.4em] hover:bg-[#ff4655] transition-all shadow-[0_0_50px_rgba(209,54,57,0.2)]"
                >
                    INITIATE_NEXUS_SYNC
                </button>
            </GlassCard>
        )}
      </div>
      )}

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
