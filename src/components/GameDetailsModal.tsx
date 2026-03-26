"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Trophy, Target, Calendar, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameDetailsModalProps {
    game: any | null; // From the library array
    onClose: () => void;
    steamId: string;
}

export default function GameDetailsModal({ game, onClose, steamId }: GameDetailsModalProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!game) return;
        
        // Prevent body scroll
        document.body.style.overflow = "hidden";
        
        async function fetchDetails() {
            setLoading(true);
            try {
                const res = await fetch(`/api/steam/game?appid=${game.appid}&steamid=${steamId}`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error("Failed to fetch detailed game stats", err);
            } finally {
                setLoading(false);
            }
        }
        
        fetchDetails();

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [game, steamId]);

    if (!game) return null;

    const playHours = Math.round(game.playtime_forever / 60);
    const storeImg = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`;
    
    // Parse description safely
    const rawDesc = data?.details?.short_description || "";
    // Remove HTML tags for clean rendering
    const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0e12] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
                >
                    {/* Header Image Area */}
                    <div className="h-64 sm:h-80 relative flex-shrink-0">
                        <img 
                            src={storeImg} 
                            alt={game.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/capsule_616x353.jpg`;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/60 to-transparent" />
                        
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                            <div>
                                <h1 className="text-3xl sm:text-5xl font-heading font-bold tracking-tight text-white shadow-black drop-shadow-lg leading-tight mb-3">
                                    {game.name}
                                </h1>
                                <div className="flex gap-3 items-center">
                                    <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary text-[10px] uppercase font-bold tracking-[0.3em] rounded-md font-mono">
                                        SYSTEM_DATA
                                    </span>
                                    <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider shadow-black drop-shadow-md">
                                        {playHours} HOURS LOGGED
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                                <p className="text-[10px] font-mono tracking-widest uppercase">Querying Central Steam Frame...</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Store Data Row */}
                                {data?.details && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <h3 className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 font-mono">
                                                <Info className="w-3 h-3" /> DATA_SUMMARY
                                            </h3>
                                            <p className="text-zinc-400 text-sm leading-relaxed font-body">
                                                {cleanDesc || "No intelligence report available for this asset."}
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-4 border-l border-white/5 pl-0 md:pl-6">
                                            <div>
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest block mb-1">Developer</span>
                                                <span className="text-white text-sm font-bold tracking-wider">{data.details.developers?.join(", ") || "UNKNOWN"}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest block mb-1">Release Date</span>
                                                <span className="text-white text-sm font-bold tracking-wider">{data.details.release_date?.date || "UNKNOWN"}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest block mb-1">Metacritic</span>
                                                <span className="text-green-400 text-xl font-bold font-heading tracking-tight">
                                                    {data.details.metacritic?.score || "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center">
                                        <Users className="w-5 h-5 text-zinc-400 mb-2" />
                                        <span className="text-2xl font-bold font-heading text-white">{data?.currentPlayers?.toLocaleString() || 0}</span>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Active Global</span>
                                    </div>
                                    
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center">
                                        <Trophy className="w-5 h-5 text-yellow-500/80 mb-2" />
                                        <span className="text-2xl font-bold font-heading text-white">
                                            {data?.userAchievements ? data.userAchievements.length : 0}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Unlocked</span>
                                    </div>
 
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center">
                                        <Target className="w-5 h-5 text-primary/80 mb-2" />
                                        <span className="text-2xl font-bold font-heading text-white">
                                            {data?.userStats?.length || 0}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Metrics</span>
                                    </div>
 
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center">
                                        <Calendar className="w-5 h-5 text-purple-500/80 mb-2" />
                                        <span className="text-2xl font-bold font-heading text-white">
                                            {(playHours / 24).toFixed(1)}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Days Played</span>
                                    </div>
                                </div>

                                {/* Raw Stats Table */}
                                {data?.userStats && data.userStats.length > 0 && (
                                    <div className="relative z-10">
                                        <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-[0.6em] mb-6">SYSTEM_TELEMETRY // RAW</h3>
                                        <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-white/5 text-[9px] uppercase tracking-[0.3em] text-zinc-500 sticky top-0 backdrop-blur-md">
                                                    <tr>
                                                        <th className="p-3 pl-4 font-bold">Metric Identifier</th>
                                                        <th className="p-3 pr-4 font-bold text-right">Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {data.userStats.slice(0, 50).map((stat: any, i: number) => (
                                                        <tr key={stat.name + i} className="hover:bg-white/5 transition-colors">
                                                            <td className="p-3 pl-4 font-mono text-zinc-300 text-[10px] break-all">
                                                                {stat.name.replace(/_/g, " ").toUpperCase()}
                                                            </td>
                                                            <td className="p-3 pr-4 font-bold font-heading text-right text-primary">
                                                                {stat.value.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {data.userStats.length > 50 && (
                                                <div className="p-3 text-center text-[10px] font-bold tracking-widest text-zinc-600 bg-black/40 border-t border-white/5 uppercase">
                                                    Displaying top 50 metrics ({data.userStats.length} total)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
