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
  Target,
  BarChart2,
  ExternalLink
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from "recharts";
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
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchIdentity = async () => {
      let storedId = localStorage.getItem("steamintel_steam_id");
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
    setShowAllAchievements(false); // Reset showAllAchievements when a new game is selected
    try {
      const storedId = localStorage.getItem("steamintel_steam_id");
      let actualSteamId = storedId;
      if (storedId && !/^\d+$/.test(storedId)) {
         const v = await fetch(`/api/steam?endpoint=vanity&vanityurl=${storedId}`);
         const d = await v.json();
         actualSteamId = d.response.steamid;
      }
      
      const [statsRes, achievRes, schemaRes] = await Promise.all([
        fetch(`/api/steam?endpoint=stats&steamid=${actualSteamId}&appid=${game.appid}`),
        fetch(`/api/steam?endpoint=achievements&steamid=${actualSteamId}&appid=${game.appid}`),
        fetch(`/api/steam?endpoint=schema&appid=${game.appid}`)
      ]);

      const [statsData, achievData, schemaData] = await Promise.all([
        statsRes.json(),
        achievRes.json(),
        schemaRes.json()
      ]);

      const userAchievs = achievData.playerstats?.achievements || [];
      const schemaAchievs = schemaData.game?.availableGameStats?.achievements || [];

      // Merge data
      const merged = userAchievs.map((uA: any) => {
        const schema = schemaAchievs.find((sA: any) => sA.name === uA.apiname);
        return {
          ...uA,
          name: schema?.displayName || uA.apiname.replace(/_/g, " "),
          description: schema?.description || "",
          icon: schema?.icon || null
        };
      });

      setGameStats({
        ...statsData.playerstats,
        achievements: merged
      });
    } catch (err) {
      console.error("STATS_FETCH_FAILURE", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("steamintel_steam_id");
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
    <main className="min-h-screen bg-[#0d0f14] text-white">
      <Navbar isVisible={!selectedGame} />
      
      <div className="max-w-[1850px] mx-auto px-10 pt-0 pb-32 relative overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute -top-20 -left-10 text-[15rem] md:text-[25rem] font-black text-white/[0.05] select-none pointer-events-none uppercase tracking-tighter whitespace-nowrap">
          Archive
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 md:gap-12 mb-16 md:mb-20 pt-0 text-center lg:text-left relative z-10">
          <div className="space-y-4 md:space-y-6 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-heading font-black tracking-tight uppercase leading-[0.95] text-white select-none whitespace-normal break-words">
              PLAYER <br /> <span className="text-primary text-3xl sm:text-4xl md:text-8xl lg:text-9xl">OVERVIEW</span>
            </h1>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-zinc-500 font-bold tracking-tight uppercase text-[10px] md:text-xs font-mono opacity-80">
              <span className="text-primary truncate max-w-[150px]">{steamProfile?.personaname || "ANONYMOUS"}</span>
              <span>//</span>
              <span className="flex-shrink-0">PLAYER_ID // 001</span>
            </div>
          </div>

            {steamProfile ? (
              <GlassCard className="p-6 md:p-10 border-white/20 border flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10 hover:border-primary/40 transition-all bg-black/60 backdrop-blur-xl relative z-10 w-full lg:max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-zinc-950 border-2 border-primary/30 overflow-hidden relative flex-shrink-0 shadow-2xl">
                  <img src={steamProfile.avatarfull} alt="PFP" className="w-full h-full object-cover hover:scale-105 transition-all duration-700" />
                  <div className={cn("absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-4 border-[#0d0e12] rounded-full", steamProfile.personastate === 1 ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]" : "bg-zinc-600")} />
                </div>
                <div className="space-y-4 text-center sm:text-left w-full min-w-0">
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter transition-colors leading-none truncate font-heading drop-shadow-xl w-full">{steamProfile.personaname}</h2>
                    <div className="flex flex-col xl:flex-row xl:items-center justify-center sm:justify-start gap-3 md:gap-4">
                      <div className="flex items-center justify-center gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-[#4a90d9] to-[#1a5fa8] rounded-md border border-white/30 shadow-xl self-start sm:self-auto inline-flex">
                        <span className="text-white font-black text-base md:text-xl leading-none">Level {steamLevel}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-zinc-500 font-bold uppercase tracking-[0.2em] font-mono text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className={cn("w-1.5 h-1.5 rounded-full", steamProfile.personastate === 1 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-zinc-500")} />
                          <span className={cn(steamProfile.personastate === 1 ? "text-green-500" : "text-zinc-500")}>
                            {steamProfile.personastate === 1 ? "ONLINE" : "OFFLINE"}
                          </span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/20" />
                        <div className="flex items-center gap-2 text-primary">
                           {steamProfile.loccountrycode || "GLOBAL_ARCHIVE"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 pt-2">
                      <a 
                        href={steamProfile.profileurl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-3 bg-white/5 border border-white/10 rounded-md text-[10px] sm:text-xs font-black tracking-widest text-zinc-300 hover:text-primary hover:border-primary/40 hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn whitespace-nowrap"
                      >
                        VIEW STEAM_ID <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                      <button 
                        onClick={handleDisconnect}
                        className="w-full sm:w-auto px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-md text-[10px] sm:text-xs font-black tracking-widest text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2 group/btn whitespace-nowrap"
                      >
                        DISCONNECT PROFILE <LogOut className="w-3.5 h-3.5 group-hover/btn:-translate-x-1 transition-transform" />
                      </button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-8">
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
      <AnimatePresence mode="wait">
        {selectedGame && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedGame(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="relative w-full max-w-6xl max-h-[90vh] bg-[#0d0f14] border border-white/10 rounded-2xl overflow-hidden overflow-y-auto custom-scrollbar shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
               <button onClick={() => setSelectedGame(null)} className="absolute top-6 right-6 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all z-[100] border border-white/10 group">
                  <X className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors" />
               </button>

                <div className="relative h-64 md:h-96 w-full group/hero">
                   <div className="absolute inset-0 z-0">
                      <img src={`https://steamcdn-a.akamaihd.net/steam/apps/${selectedGame.appid}/header.jpg`} className="w-full h-full object-cover opacity-30 blur-2xl scale-125" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-transparent" />
                   </div>
                   
                   <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                      <div className="flex flex-col md:flex-row items-end gap-10">
                         <div className="w-40 h-56 md:w-56 md:h-80 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 shrink-0 transform -rotate-2 group-hover/hero:rotate-0 transition-transform duration-700 bg-black">
                            <GameImage appid={selectedGame.appid} alt={selectedGame.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="space-y-6 pb-4">
                            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl">{selectedGame.name}</h2>
                            <div className="flex flex-wrap items-center gap-6">
                               <div className="flex items-center gap-3 px-5 py-2 bg-primary/20 border border-primary/30 rounded-sm">
                                  <Clock className="w-5 h-5 text-primary" />
                                  <span className="text-xl md:text-2xl font-black text-primary italic">{Math.round(selectedGame.playtime_forever/60)}H</span>
                               </div>
                               <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-[0.4em] opacity-60">
                                  Manifest // Active_Session // AppID_{selectedGame.appid}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

               <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-white/5">
                  <div className="space-y-10">
                     <div className="flex items-center gap-4">
                        <Trophy className="w-8 h-8 text-primary shadow-primary" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic font-heading">Achievement Protocol</h3>
                     </div>
                     
                     {statsLoading ? (
                        <div className="space-y-6">
                           <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary/20 animate-shimmer" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}
                           </div>
                        </div>
                     ) : gameStats?.achievements ? (
                        <div className="space-y-8">
                           <div className="space-y-4">
                              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${(gameStats.achievements.filter((a: any) => a.achieved === 1).length / gameStats.achievements.length) * 100}%` }}
                                   transition={{ duration: 1.5, ease: "circOut" }}
                                   className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.5)]"
                                 />
                              </div>
                              <div className="flex justify-between items-center px-1">
                                 <span className="text-[10px] font-mono text-zinc-500 font-black tracking-widest uppercase italic">Operational Efficiency</span>
                                 <span className="text-[10px] font-mono text-primary font-black tracking-widest uppercase">{gameStats.achievements.filter((a: any) => a.achieved === 1).length} OF {gameStats.achievements.length} UNLOCKED</span>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {gameStats.achievements.slice(0, showAllAchievements ? undefined : 6).map((a: any, i: number) => (
                                 <motion.div 
                                    key={a.name} 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: i * 0.05 }}
                                    className={cn(
                                       "p-4 rounded-xl border flex items-center gap-4 group/item transition-all", 
                                       a.achieved === 1 
                                          ? "bg-primary/[0.03] border-primary/20 hover:bg-primary/[0.08]" 
                                          : "bg-white/[0.02] border-white/5 opacity-30 grayscale hover:opacity-50 hover:grayscale-0"
                                    )}
                                 >
                                    <div className={cn("shrink-0 p-2 rounded-lg", a.achieved === 1 ? "bg-primary/20" : "bg-white/5")}>
                                       <Trophy className={cn("w-5 h-5", a.achieved === 1 ? "text-primary" : "text-zinc-700")} />
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-[11px] font-black uppercase text-white truncate leading-none mb-1">{a.name.replace(/_/g, " ")}</p>
                                       <p className="text-[8px] font-mono text-zinc-600 truncate uppercase tracking-widest">{a.achieved === 1 ? "SYNC_COMPLETE" : "SYNC_LOCKED"}</p>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>

                           {gameStats.achievements.length > 6 && (
                              <button 
                                onClick={() => setShowAllAchievements(!showAllAchievements)}
                                className="w-full py-5 bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 text-xs font-black tracking-[0.5em] uppercase text-zinc-500 hover:text-primary transition-all rounded-xl relative group overflow-hidden"
                              >
                                <span className="relative z-10">{showAllAchievements ? "CONDENSE_PROTOCOL" : `EXPAND_ARCHIVE // ${gameStats.achievements.length - 6}+ MORE`}</span>
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                           )}
                        </div>
                     ) : (
                        <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center gap-4 text-center">
                           <AlertCircle className="w-12 h-12 text-zinc-800" />
                           <p className="text-xs font-mono text-zinc-700 uppercase tracking-[0.3em] leading-relaxed">No achievement data available for this manifest.</p>
                        </div>
                     )}
                  </div>

                  <div className="space-y-10">
                     <div className="flex items-center gap-4">
                        <Target className="w-8 h-8 text-green-500 shadow-green-500" />
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic font-heading">Live Telemetry</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <DetailCard label="TOTAL_HOURS_LOGGED" value={`${Math.round(selectedGame.playtime_forever / 60)}H`} icon={<Clock className="w-5 h-5 text-primary" />} />
                        <DetailCard label="ACHIEVEMENTS_EARNED" value={gameStats?.achievements ? `${gameStats.achievements.filter((a: any) => a.achieved === 1).length}` : "0"} icon={<Trophy className="w-5 h-5 text-yellow-500" />} />
                        <DetailCard label="SESSION_14_DAYS" value={`${Math.round((selectedGame.playtime_2weeks || 0) / 60)}H`} icon={<TrendingUp className="w-5 h-5 text-blue-500" />} />
                        <DetailCard label="MANIFEST_ID" value={`#${selectedGame.appid}`} icon={<Terminal className="w-5 h-5 text-zinc-500" />} />
                     </div>

                     <div className="mt-8 p-10 bg-gradient-to-br from-zinc-950 to-[#0d0f14] border border-white/10 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center text-center gap-6">
                           <div className="p-5 bg-white/5 rounded-full border border-white/10">
                              <Zap className="w-10 h-10 text-primary animate-pulse" />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-2xl font-black uppercase tracking-tighter italic italic">System Integrity Optimum</h4>
                              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest max-w-[280px]">Real-time synchronization with Steam network archives successful. Protocol verified.</p>
                           </div>
                        </div>
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

function DetailCard({ label, value, icon }: any) {
   return (
      <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4 hover:border-white/20 transition-all group shadow-xl">
         <div className="flex items-center justify-between">
            <p className="text-[9px] font-mono text-zinc-600 uppercase font-black tracking-[0.3em]">{label}</p>
            <div className="opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
         </div>
         <p className="text-3xl font-black uppercase tracking-tighter text-white font-mono italic">{value}</p>
      </div>
   );
}

function StatCard({ icon, label, value, subValue, color }: any) {
  return (
    <GlassCard className="p-10 space-y-8 border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative shadow-2xl">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={cn("transition-transform group-hover:scale-110", color)}>{icon}</div>
      <div className="space-y-4 relative z-10">
        <p className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase font-mono group-hover:text-zinc-400 transition-colors">{label}</p>
        <h3 className="text-6xl font-black tracking-tighter uppercase group-hover:text-white transition-all leading-tight italic">{value}</h3>
        {subValue && (
           <div className="flex items-center gap-3">
              <div className="w-1 h-3 bg-primary rounded-full" />
              <p className="text-[10px] font-mono text-primary tracking-[0.3em] uppercase font-black">{subValue}</p>
           </div>
        )}
      </div>
    </GlassCard>
  );
}

function ActivityItem({ label, time, detail, highlight = false }: any) {
  return (
    <div className="flex items-center justify-between group">
       <div className="flex items-center gap-5">
          <div className={cn("w-2 h-2 rounded-full transition-all", highlight ? "bg-primary shadow-[0_0_15px_white]" : "bg-zinc-800 group-hover:bg-zinc-600")} />
          <div className="space-y-1">
             <p className="text-xs font-black tracking-widest text-white uppercase italic">{label}</p>
             <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest truncate max-w-[150px]">{detail}</p>
          </div>
       </div>
       <span className="text-[9px] font-mono text-zinc-800 font-black uppercase group-hover:text-zinc-600 transition-colors uppercase italic">{time}</span>
    </div>
  );
}
