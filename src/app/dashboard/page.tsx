"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Gamepad2, 
  Clock, 
  TrendingUp, 
  Swords, 
  Zap,
  BarChart3,
  LogOut,
  ChevronRight,
  Search,
  Settings,
  Terminal,
  Play,
  History,
  AlertCircle,
  X,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import GameImage from "@/components/GameImage";

const mLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];

export default function DashboardPage() {
  const [steamProfile, setSteamProfile] = useState<any>(null);
  const [steamLevel, setSteamLevel] = useState<number>(0);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [gameStats, setGameStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchIdentity = async () => {
      let storedId = localStorage.getItem("gamesphere_steam_id");
      if (!storedId) {
        setLoading(false);
        return;
      }

      try {
        let actualSteamId = storedId;
        if (!/^\d+$/.test(storedId)) {
          const vanityRes = await fetch(`/api/steam?endpoint=vanity&vanityurl=${storedId}`);
          const vanityData = await vanityRes.json();
          if (vanityData.response?.steamid) {
            actualSteamId = vanityData.response.steamid;
          }
        }

        const [profileRes, gamesRes, levelRes] = await Promise.all([
          fetch(`/api/steam?endpoint=profile&steamid=${actualSteamId}`),
          fetch(`/api/steam?endpoint=owned-games&steamid=${actualSteamId}`),
          fetch(`/api/steam?endpoint=level&steamid=${actualSteamId}`)
        ]);

        const [profileData, gamesData, levelData] = await Promise.all([
          profileRes.json(),
          gamesRes.json(),
          levelRes.json()
        ]);
        
        if (profileData.response?.players?.[0]) setSteamProfile(profileData.response.players[0]);
        if (gamesData.response?.games) setGames(gamesData.response.games);
        if (levelData.response?.player_level) setSteamLevel(levelData.response.player_level);
      } catch (err) {
        console.error("IDENTITY_SYNC_FAILURE", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdentity();
  }, []);

  const fetchGameStats = async (game: any) => {
    setSelectedGame(game);
    setStatsLoading(true);
    setGameStats(null);
    try {
      const storedId = localStorage.getItem("gamesphere_steam_id");
      let actualSteamId = storedId;
      if (storedId && !/^\d+$/.test(storedId)) {
         const v = await fetch(`/api/steam?endpoint=vanity&vanityurl=${storedId}`);
         const d = await v.json();
         actualSteamId = d.response.steamid;
      }
      const res = await fetch(`/api/steam?endpoint=stats&steamid=${actualSteamId}&appid=${game.appid}`);
      const data = await res.json();
      setGameStats(data.playerstats);
    } catch (err) {
      console.error("STATS_FETCH_FAILURE", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("gamesphere_steam_id");
    window.location.href = "/";
  };


  const sortedGames = [...games].sort((a, b) => b.playtime_forever - a.playtime_forever);
  const topGames = sortedGames.slice(0, 5);
  const maxPlaytimeRaw = Math.max(...topGames.map(g => g.playtime_forever), 600 * 60);
  const maxPlaytimeHours = Math.ceil(maxPlaytimeRaw / 60 / 150) * 150;
  const maxPlaytime = maxPlaytimeHours * 60;
  const barColors = ['#00f2ff', '#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#6366f1'];
  const filteredGames = sortedGames.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalPlaytimeHours = Math.round(games.reduce((acc, g) => acc + g.playtime_forever, 0) / 60);

  return (
    <main className="min-h-screen bg-[#050608] text-white">
      <Navbar />
      
      <div className="max-w-[1850px] mx-auto px-10 pt-40 pb-32">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 md:gap-12 mb-16 md:mb-20 pt-10 text-center lg:text-left">
          <div className="space-y-4 md:space-y-6 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-sans font-black tracking-tight uppercase leading-[0.95] text-white select-none whitespace-normal break-words">
              PLAYER <br /> <span className="text-primary text-3xl sm:text-4xl md:text-8xl lg:text-9xl">OVERVIEW</span>
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-zinc-500 font-bold tracking-tight uppercase text-[10px] md:text-xs font-mono opacity-80">
              <span className="text-primary truncate max-w-[150px]">{steamProfile?.personaname || "ANONYMOUS"}</span>
              <span>//</span>
              <span className="flex-shrink-0">PLAYER_ID // 001</span>
            </div>
          </div>

            {steamProfile ? (
              <GlassCard className="p-6 md:p-10 border-white/10 flex flex-col sm:flex-row items-center gap-6 md:gap-8 group cursor-pointer hover:border-primary/40 transition-all bg-black/60 backdrop-blur-xl relative z-10 w-full lg:max-w-md shadow-2xl">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-sm bg-zinc-950 border-2 border-primary/30 overflow-hidden relative flex-shrink-0 shadow-2xl">
                  <img src={steamProfile.avatarfull} alt="PFP" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className={cn("absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-4 border-[#0d0e12] rounded-full", steamProfile.personastate === 1 ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]" : "bg-zinc-600")} />
                </div>
                <div className="space-y-2 md:space-y-4 text-center sm:text-left">
                  <p className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors leading-none truncate max-w-[200px]">{steamProfile.personaname}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <div className="flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-[#4a90d9] to-[#1a5fa8] rounded border border-white/30 shadow-xl">
                      <span className="text-white font-black text-base md:text-xl leading-none">Level {steamLevel}</span>
                    </div>
                  </div>
                  <div className="space-y-1 pt-1 md:pt-2">
                    <p className="text-[10px] md:text-[12px] text-zinc-500 font-bold uppercase tracking-[0.4em] font-mono opacity-60">Status: {steamProfile.personastate === 1 ? "ACTIVE_NODE" : "SLEEP_MODE"}</p>
                    <p className="text-[9px] md:text-[10px] text-primary font-bold uppercase tracking-[0.5em] font-mono">{steamProfile.loccountrycode || "GLOBAL_ARCHIVE"}</p>
                  </div>
                </div>
              </GlassCard>
            ) : (
                <div className="p-10 border border-white/5 bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 text-center w-full max-w-md min-h-[220px]">
                    <AlertCircle className="w-10 h-10 text-zinc-700" />
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-relaxed">Identity Manifest Unavailable.</p>
                </div>
            )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <StatCard icon={<Clock className="w-8 h-8" />} label="TOTAL PLAYTIME" value={`${totalPlaytimeHours.toLocaleString()}H`} color="text-primary" />
          <StatCard icon={<Gamepad2 className="w-8 h-8" />} label="TOTAL TITLES" value={games.length.toString()} color="text-zinc-400" />
          <StatCard icon={<Trophy className="w-8 h-8" />} label="TOP PLAYED" value={topGames[0]?.name || "N/A"} subValue={`${Math.round(topGames[0]?.playtime_forever / 60 || 0)} HOURS`} color="text-green-500" />
          <StatCard icon={<TrendingUp className="w-8 h-8" />} label="STEAM LEVEL" value={`Level ${steamLevel}`} color="text-[#4a90d9]" />
        </div>

        <section className="space-y-12">
           <div className="flex items-center justify-between border-b border-white/5 pb-8">
              <h2 className="text-3xl font-black tracking-tight uppercase">Statistics & Analysis</h2>
              <div className="w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
           </div>
           
           <div className="grid grid-cols-1 gap-12">
              <div className="space-y-12">
                {/* Fixed Graph */}
                 <div className="p-10 bg-black/40 border border-white/5 rounded-2xl relative group overflow-hidden">
                    <div className="flex items-center gap-3 mb-10">
                       <div className="w-1.5 h-6 bg-primary" />
                       <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Most Hours Spent</h3>
                    </div>
                    
                    <div className="relative h-[400px] flex items-end">
                       {/* Y-Axis Labels */}
                       <div className="absolute left-0 h-full flex flex-col justify-between text-[11px] font-mono text-zinc-600 font-black pb-24">
                          <span>{maxPlaytimeHours}H</span>
                          <span>{Math.round(maxPlaytimeHours * 0.75)}H</span>
                          <span>{Math.round(maxPlaytimeHours * 0.5)}H</span>
                          <span>{Math.round(maxPlaytimeHours * 0.25)}H</span>
                          <span>0H</span>
                       </div>

                       {/* Grid Lines */}
                       <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-10 pointer-events-none pb-24">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full border-t border-dashed border-zinc-700" />
                          ))}
                       </div>

                       {/* Bars Container */}
                       <div className="flex-1 h-full flex items-end justify-between pl-20 pr-6 pb-24 relative z-10">
                          {topGames.map((game, i) => (
                            <div key={game.appid} className="flex flex-col items-center flex-1 h-full justify-end group/bar px-3">
                               <motion.div
                                 initial={{ height: 0 }}
                                 animate={{ height: `${(game.playtime_forever / maxPlaytime) * 100}%` }}
                                 transition={{ delay: i * 0.1, duration: 1, ease: [0.33, 1, 0.68, 1] }}
                                 style={{ backgroundColor: barColors[i % barColors.length] }}
                                 className="w-full rounded-t-xl relative hover:brightness-125 transition-all cursor-pointer shadow-lg"
                                 onClick={() => fetchGameStats(game)}
                               >
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-black/95 border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black z-30 shadow-2xl">
                                     {game.name}: {Math.round(game.playtime_forever/60)}h
                                  </div>
                               </motion.div>
                               <div className="absolute bottom-5 w-full text-center">
                                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest truncate px-2 group-hover:text-zinc-400 transition-colors font-bold">
                                     {game.name}
                                  </p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                {/* Top Titles Grid */}
                <div>
                   <div className="flex items-center gap-4 mb-8">
                      <Trophy className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-sans font-black uppercase tracking-tight">TOP PLAYED GAMES</h3>
                   </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
                       {topGames.map((game) => (
                         <div 
                           key={game.appid} 
                           onClick={() => fetchGameStats(game)}
                           className="flex flex-col gap-8 p-10 bg-white/[0.03] border border-white/10 rounded-3xl hover:border-primary/60 hover:bg-white/[0.05] transition-all group cursor-pointer hover:scale-[1.03] shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                         >
                            <div className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-white/10 ring-1 ring-white/5 group-hover:ring-primary/20 relative shadow-2xl">
                               <GameImage appid={game.appid} alt={game.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-2xl font-black truncate uppercase text-primary mb-3 group-hover:text-white transition-colors tracking-tight">{game.name}</h4>
                               <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest font-black opacity-80">{Math.round(game.playtime_forever / 60)} HOURS LOGGED</p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                               <span className="text-[10px] font-mono text-zinc-600 font-bold tracking-[0.2em]">ACT_NODE_ID_{game.appid}</span>
                               <ChevronRight className="w-6 h-6 text-zinc-800 group-hover:text-primary transition-all group-hover:translate-x-3" />
                            </div>
                         </div>
                       ))}
                    </div>
                </div>
              </div>
           </div>

           {/* Full Collection Section */}
           <div className="pt-20">
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                 <div className="flex items-center gap-4">
                    <History className="w-6 h-6 text-zinc-500" />
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">My Collection</h2>
                 </div>
                 <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full w-full md:w-auto">
                    <Search className="w-4 h-4 text-zinc-500" />
                    <input type="text" placeholder="FILTER_COLLECTION..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest w-full md:w-48 placeholder:text-zinc-700 uppercase" />
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                 {filteredGames.slice(0, 30).map((game) => (
                   <div key={game.appid} onClick={() => fetchGameStats(game)} className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/5 hover:scale-[1.04] transition-all cursor-pointer shadow-xl">
                      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-zinc-950 border border-white/5 mb-8 relative shadow-2xl">
                         <GameImage appid={game.appid} alt={game.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                      </div>
                      <h4 className="text-base font-black uppercase truncate text-primary group-hover:text-white transition-colors tracking-tight">{game.name}</h4>
                      <p className="text-[11px] font-mono text-zinc-500 mt-3 uppercase font-black">{Math.round(game.playtime_forever/60)}H RECORDED</p>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary fill-primary" />
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </div>

      {/* Game Detail Modal */}
      <AnimatePresence>
        {selectedGame && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedGame(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-4xl bg-[#0d0e12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10"
            >
               <button onClick={() => setSelectedGame(null)} className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20">
                  <X className="w-6 h-6" />
               </button>

               <div className="relative h-64 md:h-80 w-full">
                  <img src={`https://steamcdn-a.akamaihd.net/steam/apps/${selectedGame.appid}/header.jpg`} className="w-full h-full object-cover opacity-40 blur-sm scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-10 flex items-end gap-8">
                     <div className="w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <img src={`https://steamcdn-a.akamaihd.net/steam/apps/${selectedGame.appid}/header.jpg`} className="w-full h-full object-cover" />
                     </div>
                     <div className="pb-4 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{selectedGame.name}</h2>
                        <div className="flex items-center gap-6">
                           <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                              <Clock className="w-4 h-4 text-primary" />
                              <span className="text-xl font-black">{Math.round(selectedGame.playtime_forever/60)}H</span>
                           </div>
                           <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">TOTAL_LOGGED_MANIFEST</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <div className="flex items-center gap-4">
                        <Trophy className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-black uppercase tracking-tight italic">Achievement Protocol</h3>
                     </div>
                     {statsLoading ? (
                        <div className="space-y-4 animate-pulse">
                           <div className="h-4 bg-white/5 rounded w-full" />
                           <div className="h-4 bg-white/5 rounded w-3/4" />
                        </div>
                     ) : gameStats?.achievements ? (
                        <div className="space-y-4">
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(gameStats.achievements.filter((a: any) => a.achieved === 1).length / gameStats.achievements.length) * 100}%` }}
                                className="h-full bg-primary"
                              />
                           </div>
                           <div className="flex justify-between text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                              <span>Progress</span>
                              <span>{gameStats.achievements.filter((a: any) => a.achieved === 1).length} / {gameStats.achievements.length} UNLOCKED</span>
                           </div>
                           <div className="grid grid-cols-2 gap-4 pt-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                              {gameStats.achievements.slice(0, 10).map((a: any) => (
                                 <div key={a.name} className={cn("p-3 rounded-lg border flex items-center gap-3", a.achieved === 1 ? "bg-primary/5 border-primary/20" : "bg-white/5 border-white/5 opacity-40")}>
                                    <Trophy className={cn("w-4 h-4", a.achieved === 1 ? "text-primary" : "text-zinc-600")} />
                                    <span className="text-[9px] font-bold uppercase truncate">{a.name.replace(/_/g, " ")}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : (
                        <div className="p-8 bg-white/5 border border-white/5 rounded-xl flex flex-col items-center gap-4 text-center">
                           <AlertCircle className="w-8 h-8 text-zinc-800" />
                           <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">No achievement data available for this manifest.</p>
                        </div>
                     )}
                  </div>

                   <div className="space-y-8">
                      <div className="flex items-center gap-4">
                         <Target className="w-6 h-6 text-green-500" />
                         <h3 className="text-xl font-black uppercase tracking-tight italic">Live Telemetry</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <DetailCard label="TOTAL HOURS" value={`${Math.round(selectedGame.playtime_forever / 60)}H`} />
                         <DetailCard label="ACHIEVEMENTS" value={gameStats?.achievements ? `${gameStats.achievements.filter((a: any) => a.achieved === 1).length}` : "0"} />
                         <DetailCard label="LAST 14 DAYS" value={`${Math.round((selectedGame.playtime_2weeks || 0) / 60)}H`} />
                         <DetailCard label="MANIFEST_ID" value={`#${selectedGame.appid}`} />
                      </div>
                   </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function DetailCard({ label, value }: any) {
   return (
      <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-1">
         <p className="text-[9px] font-mono text-zinc-600 uppercase font-bold tracking-widest">{label}</p>
         <p className="text-lg font-black uppercase">{value}</p>
      </div>
   );
}

function StatCard({ icon, label, value, subValue, color }: any) {
  return (
    <GlassCard className="p-10 space-y-8 border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={cn("mb-4 transition-transform group-hover:scale-110", color)}>{icon}</div>
      <div className="space-y-3 relative z-10">
        <p className="text-[9px] font-bold tracking-[0.4em] text-zinc-500 uppercase font-mono group-hover:text-zinc-400 transition-colors">{label}</p>
        <h3 className="text-5xl font-black tracking-tighter uppercase group-hover:text-white transition-all leading-tight">{value}</h3>
        {subValue && <p className="text-[9px] font-mono text-primary tracking-[0.3em] uppercase font-bold opacity-60">{subValue}</p>}
      </div>
    </GlassCard>
  );
}


function ActivityItem({ label, time, detail, highlight = false }: any) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-4">
          <div className={cn("w-1.5 h-1.5 rounded-full", highlight ? "bg-primary shadow-[0_0_10px_white]" : "bg-zinc-800")} />
          <div>
             <p className="text-[10px] font-black tracking-tight text-white uppercase">{label}</p>
             <p className="text-[8px] font-mono text-zinc-600 uppercase truncate max-w-[120px]">{detail}</p>
          </div>
       </div>
       <span className="text-[8px] font-mono text-zinc-700 font-bold">{time}</span>
    </div>
  );
}
