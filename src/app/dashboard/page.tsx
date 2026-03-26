"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import { fetchUnifiedData } from "@/lib/dataFetcher";
import { cn } from "@/lib/utils";
import { 
  Gamepad2, 
  Clock, 
  LogOut,
  Star,
  Award,
  Swords,
  Loader2
} from "lucide-react";

// Fade-in slide-up variant
const containerVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Dashboard() {
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
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        }
        
        const steamId = localStorage.getItem("gamesphere_steam_id") || "SwastidSolanki";
        // Passing empty strings for riot to maintain backwards compatibility with fetchUnifiedData temporarily
        const unifiedData = await fetchUnifiedData(steamId, "", "");
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
    return <DashboardLoading />;
  }

  const steamProfile = data?.steam?.profile;
  const rawLibrary = data?.steam?.library || [];
  
  // Process Data
  const totalHours = Math.round(data?.steam?.totalPlaytime || 0);
  const totalGames = rawLibrary.length;
  const estimatedAchievements = Math.floor(totalHours * 1.5); // Placeholder as requested

  const sortedLibrary = [...rawLibrary].sort((a: any, b: any) => b.playtime_forever - a.playtime_forever);
  const favoriteGame = sortedLibrary.length > 0 ? sortedLibrary[0] : null;
  const top5Games = sortedLibrary.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white p-4 md:p-8 font-heading overflow-x-hidden relative selection:bg-primary/30">
      <Navbar />
      
      {/* HUD HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 relative z-10 max-w-7xl mx-auto">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6 opacity-40">
            <span className="w-12 h-[1px] bg-primary"></span>
            <h2 className="text-[10px] font-bold text-primary tracking-[0.8em] uppercase font-heading">WAR_ARCHIVES // STEAM</h2>
          </div>

          <h1 className="text-5xl md:text-8xl font-heading font-black tracking-widest text-white leading-none mb-4">
            STEAM_VAULT
          </h1>
          <p className="text-primary/60 font-mono text-xs tracking-widest uppercase">
            {steamProfile?.personaname} // VERIFIED UPLINK
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-6 pt-4">
          {steamProfile && (
              <GlassCard className="p-4 border-white/10 flex items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all bg-black/40 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-sm bg-zinc-950 border border-primary/20 overflow-hidden relative">
                      <img src={steamProfile.avatarfull} alt="PFP" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                      <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0d0e12] rounded-full", steamProfile.personastate === 1 ? "bg-green-500" : "bg-zinc-600")} />
                  </div>
                  <div className="pr-4">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{steamProfile.personaname}</p>
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">LVL: {Math.floor(totalHours / 100) || 0} // {steamProfile.loccountrycode || "GLB"}</p>
                  </div>
              </GlassCard>
          )}

          <div className="flex gap-4">
            <button 
                onClick={() => router.push('/compare')}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-[10px] font-bold tracking-widest hover:bg-primary hover:text-black transition-all font-heading uppercase"
            >
                <Swords className="w-3 h-3" /> Compare
            </button>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-950/20 border border-red-900/40 rounded-sm text-[10px] font-bold tracking-widest hover:bg-red-500 hover:text-white transition-all font-heading uppercase"
            >
                <LogOut className="w-3 h-3" /> Disconnect
            </button>
          </div>
        </div>
      </div>

      <motion.div 
        variants={containerVariant} 
        initial="hidden" 
        animate="visible"
        className="max-w-7xl mx-auto space-y-24 relative z-10"
      >
        {/* PREMIUM HERO STATS */}
        <section>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-[2px] bg-primary/40"></div>
                <h2 className="text-xl md:text-2xl font-black tracking-[0.3em] uppercase text-white/90">Overall Career</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <HeroStatCard 
                    icon={<Clock className="w-8 h-8" />} 
                    label="Total Hours" 
                    value={`${totalHours}H`} 
                    color="from-blue-500/20 to-cyan-500/5"
                    borderColor="hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                />
                <HeroStatCard 
                    icon={<Gamepad2 className="w-8 h-8" />} 
                    label="Library Size" 
                    value={totalGames} 
                    color="from-purple-500/20 to-fuchsia-500/5"
                    borderColor="hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                />
                <HeroStatCard 
                    icon={<Award className="w-8 h-8" />} 
                    label="Achievements" 
                    value={estimatedAchievements} 
                    color="from-yellow-500/20 to-orange-500/5"
                    borderColor="hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]"
                />
                <HeroStatCard 
                    icon={<Star className="w-8 h-8" />} 
                    label="Favorite Game" 
                    value={favoriteGame?.name || "N/A"} 
                    subValue={favoriteGame ? `${Math.round(favoriteGame.playtime_forever / 60)} Hours` : undefined}
                    color="from-emerald-500/20 to-green-500/5"
                    borderColor="hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                />
            </div>
        </section>

        {/* TOP GAMES SECTION */}
        <section>
            <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-[2px] bg-primary/40"></div>
                <h2 className="text-xl md:text-2xl font-black tracking-[0.3em] uppercase text-white/90">Top 5 Most Played</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {top5Games.map((game: any, index: number) => {
                    const hours = Math.round(game.playtime_forever / 60);
                    const imageSrc = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`;
                    
                    return (
                        <motion.div 
                            key={game.appid}
                            variants={itemVariant}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="group relative rounded-lg overflow-hidden border border-white/5 bg-black/40 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(0,229,255,0.15)]"
                        >
                            <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-900">
                                <img 
                                    src={imageSrc} 
                                    alt={game.name}
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/capsule_616x353.jpg`;
                                    }}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/50 to-transparent" />
                                
                                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center font-black text-xs text-primary shadow-lg">
                                    #{index + 1}
                                </div>
                            </div>
                            
                            <div className="p-5 relative z-10 -mt-6">
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-1 line-clamp-1 group-hover:text-primary transition-colors text-white/90">
                                    {game.name}
                                </h3>
                                <p className="text-xs font-mono text-zinc-500 tracking-widest group-hover:text-zinc-300 transition-colors">
                                    {hours} HOURS
                                </p>
                            </div>
                            
                            {/* Bottom active line */}
                            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out" />
                        </motion.div>
                    );
                })}
            </div>
        </section>
      </motion.div>
    </main>
  );
}

function HeroStatCard({ icon, label, value, subValue, color, borderColor }: any) {
    return (
        <motion.div 
            variants={itemVariant}
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/5 bg-black/40 p-8 backdrop-blur-sm transition-all duration-500 cursor-default group h-full",
                borderColor
            )}
        >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity duration-500", color)} />
            
            <div className="relative z-10">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-white/80 group-hover:text-white transition-colors shadow-lg">
                    {icon}
                </div>
                
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 group-hover:text-zinc-300 transition-colors">{label}</h3>
                <div className="text-3xl lg:text-4xl font-black tracking-widest text-white/90 truncate group-hover:text-white transition-colors shadow-white">
                    {value}
                </div>
                {subValue && (
                    <div className="mt-2 text-[10px] font-mono tracking-[0.2em] text-primary/80 uppercase">
                        {subValue}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center font-heading">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
        <h2 className="text-3xl font-black tracking-[0.5em] mb-4 text-white">ACCESSING_VAULT</h2>
        <p className="text-primary text-[10px] uppercase font-mono tracking-widest animate-pulse">
            SYNCHRONIZING_STEAM_ARCHIVES...
        </p>
      </div>
    </div>
  );
}

