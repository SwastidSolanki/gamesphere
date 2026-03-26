"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
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
      const steamId = localStorage.getItem("gamesphere_steam_id") || "SwastidSolanki";
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
          <h2 className="text-3xl font-black tracking-[0.5em] mb-4 text-white uppercase">ACCESSING_PROFILE</h2>
          <p className="text-primary text-sm uppercase font-mono tracking-widest animate-pulse">
            SYNCHRONIZING_PERSONAL_ARCHIVES...
          </p>
        </div>
      </div>
    );
  }

  const profile = data?.steam?.profile;
  const rawLibrary = data?.steam?.library || [];
  const level = data?.steam?.level ?? 0;

  const filteredLibrary = rawLibrary.filter((g: any) => g.playtime_forever >= 60);
  const sortedLibrary = [...filteredLibrary].sort((a: any, b: any) => b.playtime_forever - a.playtime_forever);

  const totalHours = Math.round(data?.steam?.totalPlaytime || 0);
  const totalGames = rawLibrary.length;
  const playedGames = filteredLibrary.length;
  const favoriteGame = sortedLibrary[0] || null; 

  const top5 = sortedLibrary.slice(0, 5);
  const isOnline = profile?.personastate === 1;

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white font-heading overflow-x-hidden">
      <Navbar />

      {/* Profile Banner */}
      <div className="pt-24 pb-8 relative">
        {/* Banner BG */}
        <div className="h-64 absolute top-0 left-0 right-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#0d0e12] to-primary/10 transition-opacity duration-1000" />
          {favoriteGame && (
            <img 
              src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${favoriteGame.appid}/library_hero.jpg`}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
              className="w-full h-full object-cover opacity-30 blur-sm scale-105"
              alt=""
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-6 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Avatar Container */}
          <div className="relative flex-shrink-0 group">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl border-2 border-primary/40 overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.2)] bg-zinc-900">
              {profile?.avatarfull ? (
                <img src={profile.avatarfull} alt={profile.personaname} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                  <Gamepad2 className="w-20 h-20" />
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className={cn(
              "absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-[#0d0e12] shadow-lg",
              isOnline ? "bg-green-500 animate-pulse" : "bg-zinc-600"
            )} />
          </div>

          {/* Identity Details */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-4 pb-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-[0.1em] text-white">
                {profile?.personaname || "UNKNOWN_SEEKER"}
              </h1>
              {/* Pro Level Badge */}
              <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#4a90d9] to-[#1a5fa8] rounded-sm border border-white/20 shadow-[0_0_15px_rgba(74,144,217,0.5)]">
                <span className="text-white font-black text-base leading-none">Level {level}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase bg-white/5 px-3 py-1 rounded">
                STEAM_ID: <span className="text-primary/70">{profile?.steamid || "N/A"}</span>
              </p>
              <span className={cn(
                "px-3 py-1 rounded border text-[10px] font-black tracking-[0.2em] uppercase",
                isOnline ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-zinc-400 border-zinc-600/30 bg-zinc-800/20"
              )}>
                {isOnline ? "OPERATIONAL" : "INACTIVE"}
              </span>
              <span className="text-zinc-600 font-bold text-xs uppercase tracking-widest">
                {profile?.loccountrycode || "GLOBAL_ARCHIVE"}
              </span>
            </div>

            {profile?.profileurl && (
              <a 
                href={profile.profileurl} 
                target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-xs font-black text-primary/60 hover:text-primary transition-all tracking-[0.2em] uppercase"
              >
                <ExternalLink className="w-4 h-4" /> 
                <span className="border-b border-primary/0 group-hover:border-primary/40 transition-all">Verify on Steam</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 pb-32 space-y-24">
        {/* KPI OVERVIEW */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Clock className="w-6 h-6" />} label="Total Hours" value={`${totalHours.toLocaleString()}H`} color="text-blue-400" />
            <StatCard icon={<Gamepad2 className="w-6 h-6" />} label="Games Owned" value={totalGames} color="text-fuchsia-400" />
            <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Engagement" value={`${playedGames} Active`} color="text-primary" />
            <StatCard icon={<ShieldCheck className="w-6 h-6" />} label="Account Tier" value={`Level ${level}`} color="text-yellow-400" />
          </div>
        </section>

        {/* MOST ENGAGED GAMES */}
        <section>
          <SectionHeader title="Most Engaged Titles" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {top5.map((game: any, i: number) => {
              const hours = Math.round(game.playtime_forever / 60);
              const pct = Math.min(100, Math.round((game.playtime_forever / (top5[0]?.playtime_forever || 1)) * 100));
              return (
                <motion.div
                  key={game.appid}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-black/40 border border-white/5 rounded-xl overflow-hidden hover:border-primary/40 transition-all cursor-default shadow-xl"
                >
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    <img
                      src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                      alt={game.name}
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.dataset.fb) { img.dataset.fb = "1"; img.src = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`; }
                        else img.style.display = "none";
                      }}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/80 flex items-center justify-center text-xs font-black text-primary border border-white/10 shadow-lg">
                      #{i + 1}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold tracking-wider text-white group-hover:text-primary transition-colors line-clamp-1 mb-2 leading-tight uppercase">
                      {game.name}
                    </p>
                    <div className="flex justify-between items-end mb-3">
                        <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase">{hours} Hours Logged</p>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary/60 rounded-full" 
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FULL LIBRARY TABLE */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[2px] bg-primary/40" />
              <h2 className="text-2xl md:text-3xl font-black tracking-[0.2em] uppercase text-white/90">Full Arsenal Archive</h2>
            </div>
            <p className="text-sm font-mono text-zinc-500 uppercase tracking-[0.2em] hidden sm:block">
              {sortedLibrary.length} Verified Titles (&gt;1H)
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 border-b border-white/5 bg-white/3">
                  <th className="px-6 py-5 font-black text-center w-16">Rank</th>
                  <th className="px-6 py-5 font-black">Archive_Entry</th>
                  <th className="px-6 py-5 font-black text-right">Hours_Logged</th>
                  <th className="px-6 py-5 font-black text-right hidden lg:table-cell">%_Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedLibrary.map((game: any, i: number) => {
                  const hours = Math.round(game.playtime_forever / 60);
                  const pct = totalHours > 0 ? ((game.playtime_forever / 60) / totalHours * 100).toFixed(1) : "0";
                  return (
                    <tr key={game.appid} className={cn(
                        "group transition-all hover:bg-primary/5",
                        i === 0 && "bg-primary/3"
                    )}>
                      <td className="px-6 py-5 text-center font-mono text-xs text-zinc-600 group-hover:text-primary transition-colors">{i + 1}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img 
                            src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                            className="w-10 h-10 rounded border border-white/10 group-hover:border-primary/50 transition-all shadow-lg"
                            alt=""
                          />
                          <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors uppercase tracking-wide">
                            {game.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono font-black text-primary text-base min-w-[120px]">
                        {hours.toLocaleString()}h
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-xs text-zinc-500 hidden lg:table-cell tracking-widest">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
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
      <div className="text-4xl font-black tracking-widest text-white truncate shadow-white leading-none">
        {value}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
