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
  Shield,
  Loader2,
  ExternalLink,
  TrendingUp
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
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 animate-pulse">Loading Profile...</p>
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

  // Top 5 recent games (highest playtime, as Steam doesn't expose last 2 weeks reliably)
  const top5 = sortedLibrary.slice(0, 5);

  const isOnline = profile?.personastate === 1;

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white font-heading">
      <Navbar />

      {/* Profile Banner */}
      <div className="pt-24 pb-6 relative">
        {/* Banner BG */}
        <div className="h-52 absolute top-0 left-0 right-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-[#0d0e12] to-primary/10" />
          {favoriteGame && (
            <img 
              src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${favoriteGame.appid}/library_hero.jpg`}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
              className="w-full h-full object-cover opacity-20 blur-sm"
              alt=""
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-4 flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl border-2 border-primary/30 overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.15)] bg-zinc-900">
              {profile?.avatarfull ? (
                <img src={profile.avatarfull} alt={profile.personaname} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <Gamepad2 className="w-12 h-12 text-zinc-700" />
                </div>
              )}
            </div>
            {/* Online indicator */}
            <span className={cn("absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-[#0d0e12]", isOnline ? "bg-green-400" : "bg-zinc-600")} />
          </div>

          {/* Info */}
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-widest uppercase text-white">
                {profile?.personaname || "UNKNOWN"}
              </h1>
              {/* Steam Level Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#4a90d9] to-[#1a5fa8] rounded-sm shadow-[0_0_10px_rgba(74,144,217,0.4)] border border-white/10">
                <span className="text-white font-black text-sm leading-none">☆ {level}</span>
              </div>
              <span className={cn("px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase border", isOnline ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-zinc-400 border-zinc-600/30 bg-zinc-800/30")}>
                {isOnline ? "■ ONLINE" : "■ OFFLINE"}
              </span>
            </div>
            <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
              STEAM_ID: {profile?.steamid || "N/A"} &nbsp;·&nbsp; {profile?.loccountrycode || "GLOBAL"}
            </p>
            {profile?.profileurl && (
              <a 
                href={profile.profileurl} 
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold text-primary/60 hover:text-primary transition-colors tracking-widest uppercase"
              >
                <ExternalLink className="w-3 h-3" /> View on Steam
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Clock className="w-5 h-5" />} label="Total Hours" value={`${totalHours}H`} color="text-blue-400" />
          <StatCard icon={<Gamepad2 className="w-5 h-5" />} label="Games Owned" value={totalGames} color="text-purple-400" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Played &gt; 1H" value={playedGames} color="text-primary" />
          <StatCard icon={<Star className="w-5 h-5" />} label="Steam Level" value={level} color="text-yellow-400" />
        </div>

        {/* MOST PLAYED */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-[2px] bg-primary/40" />
            <h2 className="text-lg font-black tracking-[0.3em] uppercase text-white/80">Most Played Games</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {top5.map((game: any, i: number) => {
              const hours = Math.round(game.playtime_forever / 60);
              const pct = Math.min(100, Math.round((game.playtime_forever / (top5[0]?.playtime_forever || 1)) * 100));
              return (
                <motion.div
                  key={game.appid}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="group bg-black/40 border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-default"
                >
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    <img
                      src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`}
                      alt={game.name}
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.dataset.fb) { img.dataset.fb = "1"; img.src = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/capsule_616x353.jpg`; }
                        else img.style.display = "none";
                      }}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-[10px] font-black text-primary border border-white/10">
                      {i + 1}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold tracking-wider text-white/80 line-clamp-1 mb-1">{game.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500">{hours}H PLAYED</p>
                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FULL LIBRARY TABLE */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-[2px] bg-primary/40" />
            <h2 className="text-lg font-black tracking-[0.3em] uppercase text-white/80">Full Library</h2>
            <span className="ml-auto text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{sortedLibrary.length} titles</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 border-b border-white/5 bg-white/3">
                  <th className="p-4 font-bold">#</th>
                  <th className="p-4 font-bold">Game</th>
                  <th className="p-4 font-bold text-right">Hours Played</th>
                  <th className="p-4 font-bold text-right hidden sm:table-cell">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedLibrary.map((game: any, i: number) => {
                  const hours = Math.round(game.playtime_forever / 60);
                  const pct = totalHours > 0 ? ((game.playtime_forever / 60) / totalHours * 100).toFixed(1) : "0";
                  return (
                    <tr key={game.appid} className={cn("hover:bg-white/3 transition-colors", i === 0 && "bg-primary/3")}>
                      <td className="p-4 font-mono text-[10px] text-zinc-600">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                            className="w-8 h-8 rounded object-cover"
                            alt=""
                          />
                          <span className="text-sm font-bold text-white/80 hover:text-white transition-colors">{game.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right font-mono font-black text-primary text-sm">{hours}h</td>
                      <td className="p-4 text-right font-mono text-[11px] text-zinc-500 hidden sm:table-cell">{pct}%</td>
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

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) {
  return (
    <div className="bg-black/40 border border-white/5 rounded-xl p-5 flex flex-col gap-3 hover:border-white/10 transition-all">
      <div className={cn("flex items-center gap-2", color)}>
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70">{label}</span>
      </div>
      <div className="text-3xl font-black tracking-widest text-white truncate">{value}</div>
    </div>
  );
}
