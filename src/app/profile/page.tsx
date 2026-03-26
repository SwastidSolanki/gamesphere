"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import GameImage from "@/components/GameImage";
import { fetchUnifiedData } from "@/lib/dataFetcher";
import { 
  Clock,
  Gamepad2,
  Star,
  Loader2,
  ExternalLink,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      async function load() {
        const steamId = typeof window !== "undefined" ? localStorage.getItem("gamesphere_steam_id") || "SwastidSolanki" : "SwastidSolanki";
        const unifiedData = await fetchUnifiedData(steamId, "", "");
        setData(unifiedData);
        setIsLoading(false);
      }
      load();
    }, []);
  
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center font-heading">
          <Navbar />
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
            <h2 className="text-3xl font-black tracking-[0.5em] mb-4 text-white uppercase tracking-[0.4em]">Accessing Profile</h2>
            <p className="text-primary text-sm uppercase font-mono tracking-widest animate-pulse">
              Synchronizing personal archives...
            </p>
          </div>
        </div>
      );
    }
  
    const profile = data?.steam?.profile;
    const rawLibrary = data?.steam?.library || [];
    const level = data?.steam?.level ?? 0;
    const theme = data?.steam?.theme || {};
    const bans = data?.steam?.bans || {};
  
    const filteredLibrary = rawLibrary.filter((g: any) => g.playtime_forever >= 60);
    const sortedLibrary = [...filteredLibrary].sort((a: any, b: any) => b.playtime_forever - a.playtime_forever);
  
    const totalHours = Math.round(data?.steam?.totalPlaytime || 0);
    const totalGames = rawLibrary.length;
    const playedGames = filteredLibrary.length;
  
    const top5 = sortedLibrary.slice(0, 5);
    const isOnline = profile?.personastate === 1;
  
    return (
      <div className="min-h-screen bg-[#0d0e12] text-white font-heading overflow-x-hidden relative">
        <Navbar />
  
        {/* Steam Authentic Background */}
        {theme.background && (
            <div 
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 blur-sm scale-110"
                style={{ backgroundImage: `url(${theme.background})` }}
            />
        )}
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0d0e12]" />
  
        <div className="relative z-10">
            {/* Profile Banner */}
            <div className="pt-32 pb-8 relative">
                <div className="relative max-w-[1850px] mx-auto px-10 pt-32 pb-6 flex flex-col md:flex-row items-center md:items-end gap-10">
                {/* Avatar Container with Frame */}
                <div className="relative flex-shrink-0 group">
                    <div className="w-40 h-40 md:w-52 md:h-52 overflow-hidden shadow-2xl relative">
                        {/* Avatar Image */}
                        <div className="absolute inset-[8%] z-10 overflow-hidden">
                            {profile?.avatarfull ? (
                                <img src={profile.avatarfull} alt={profile.personaname} className="w-full h-full object-cover transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                                    <Gamepad2 className="w-20 h-20" />
                                </div>
                            )}
                        </div>
                        {/* Steam Avatar Frame */}
                        {theme.frame && (
                            <img 
                                src={theme.frame} 
                                alt="Frame" 
                                className="absolute inset-0 w-full h-full x-20 pointer-events-none scale-[1.12]" 
                            />
                        )}
                    </div>
                    {/* Online indicator */}
                    <div className={cn(
                    "absolute bottom-[10%] right-[10%] w-6 h-6 rounded-full border-4 border-[#0d0e12] shadow-lg z-30",
                    isOnline ? "bg-green-500 animate-pulse" : "bg-zinc-600"
                    )} />
                </div>
    
                {/* Identity Details */}
                <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6 pb-2">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase">
                                {profile?.personaname || "UNKNOWN_SEEKER"}
                            </h1>
                            <div className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-blue-600 rounded-sm border border-white/20 shadow-xl">
                                <span className="text-black font-black text-xl leading-none">Lvl {level}</span>
                            </div>
                        </div>
                        <p className="text-zinc-500 font-mono text-sm tracking-[0.3em] uppercase">User Identity Index // {profile?.steamid || "N/A"}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        {/* Security Clearance HUD */}
                        <div className={cn(
                            "flex items-center gap-3 px-5 py-2 rounded-sm border-2 font-black text-xs tracking-[0.2em] uppercase backdrop-blur-md",
                            bans?.VACBanned || bans?.NumberOfGameBans > 0 
                                ? "text-red-500 border-red-500/30 bg-red-500/10" 
                                : "text-primary border-primary/30 bg-primary/10"
                        )}>
                            <ShieldCheck className="w-5 h-5" />
                            {bans?.VACBanned || bans?.NumberOfGameBans > 0 ? "Compromised // Restricted" : "Secure // Verified"}
                        </div>

                        <div className="flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-sm text-xs font-bold tracking-widest uppercase">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {profile?.loccountrycode || "Global Archive"}
                        </div>
                    </div>
    
                    {profile?.profileurl && (
                    <a 
                        href={profile.profileurl} 
                        target="_blank" rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 text-[10px] font-black text-white/40 hover:text-primary transition-all tracking-[0.4em] uppercase"
                    >
                        <ExternalLink className="w-4 h-4" /> 
                        <span className="border-b border-white/0 group-hover:border-primary/40 transition-all">Verify Connection Protocol</span>
                    </a>
                    )}
                </div>
                </div>
            </div>
    
            {/* Main Content Sections */}
            <div className="max-w-[1850px] mx-auto px-10 pb-32 space-y-24">
                {/* KPI OVERVIEW */}
                <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={<Clock className="w-6 h-6" />} label="Service Hours" value={`${totalHours.toLocaleString()}H`} color="text-blue-400" />
                    <StatCard icon={<Gamepad2 className="w-6 h-6" />} label="Library Manifest" value={totalGames} color="text-fuchsia-400" />
                    <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Engagement Index" value={`${playedGames} Games`} color="text-primary" />
                    <StatCard icon={<ShieldCheck className="w-6 h-6" />} label="Account Standing" value={bans?.VACBanned ? "Flagged" : "Pristine"} color="text-yellow-400" />
                </div>
                </section>
    
                {/* MOST ENGAGED GAMES */}
                <section>
                <SectionHeader title="High Engagement Archives" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
                    {top5.map((game: any, i: number) => {
                    const hours = Math.round(game.playtime_forever / 60);
                    const pct = Math.min(100, Math.round((game.playtime_forever / (top5[0]?.playtime_forever || 1)) * 100));
                    return (
                        <motion.div
                        key={game.appid}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-black/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-all cursor-default shadow-2xl"
                        >
                        <div className="aspect-video sm:aspect-[3/4] relative overflow-hidden bg-zinc-900 shadow-2xl">
                            <GameImage
                                appid={game.appid}
                                alt={game.name}
                                className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-xs font-mono text-primary tracking-widest uppercase mb-2 font-black">{hours} Hours</p>
                                <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${pct}%` }}
                                        viewport={{ once: true }}
                                        className="h-full bg-primary" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                            <p className="text-sm font-black tracking-widest text-white/70 group-hover:text-white transition-colors uppercase truncate">
                            {game.name}
                            </p>
                        </div>
                        </motion.div>
                    );
                    })}
                </div>
                </section>
    
                {/* FULL LIBRARY TABLE */}
                <section>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                    <div className="w-12 h-[1px] bg-primary" />
                    <h2 className="text-3xl font-sans font-black tracking-[0.3em] uppercase text-white">Full Archive</h2>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em] hidden sm:block">
                    Indexed {sortedLibrary.length} titles
                    </p>
                </div>
    
                <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 border-b border-white/5 bg-white/2">
                        <th className="px-8 py-6 font-black text-center w-20">Rank</th>
                        <th className="px-8 py-6 font-black">Designation</th>
                        <th className="px-8 py-6 font-black text-right">Log_Time</th>
                        <th className="px-8 py-6 font-black text-right hidden lg:table-cell">Comp_Rating</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedLibrary.map((game: any, i: number) => {
                        const hours = Math.round(game.playtime_forever / 60);
                        return (
                            <tr key={game.appid} className="group transition-all hover:bg-primary/5">
                            <td className="px-8 py-6 text-center font-mono text-xs text-zinc-700 group-hover:text-primary transition-colors">[{String(i + 1).padStart(2, '0')}]</td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-6">
                                <div className="relative flex-shrink-0">
                                    <img 
                                        src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                                        className="w-6 h-6 md:w-8 md:h-8 rounded-sm transition-all opacity-40 group-hover:opacity-100"
                                        alt=""
                                    />
                                </div>
                                <span className="text-[10px] md:text-sm font-black text-white/40 group-hover:text-white transition-all uppercase tracking-widest truncate max-w-[120px] md:max-w-none">
                                    {game.name}
                                </span>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right font-mono font-black text-primary/60 group-hover:text-primary text-base transition-all">
                                {hours.toLocaleString()}H
                            </td>
                            <td className="px-8 py-6 text-right font-mono text-[10px] text-zinc-700 hidden lg:table-cell tracking-[0.4em]">ALPHA</td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                </div>
                </section>
            </div>
        </div>
      </div>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
      <div className="flex items-center gap-4 mb-8">
        <div className="w-8 h-[2px] bg-primary/40"></div>
        <h2 className="text-2xl md:text-3xl font-black tracking-[0.2em] uppercase text-white/90">{title}</h2>
      </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl p-8 flex flex-col gap-4 hover:border-primary/30 hover:bg-primary/3 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
        {icon}
      </div>
      <div className={cn("flex items-center gap-3", color)}>
        <span className="text-sm font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">{label}</span>
      </div>
      <div className="text-3xl md:text-4xl font-black tracking-widest text-white whitespace-normal leading-tight break-words">
        {value}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
