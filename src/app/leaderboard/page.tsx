"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import { 
  Trophy, 
  Search, 
  Filter, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  Gamepad2,
  Loader2,
  Target,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchLeaderboardData } from "@/lib/dataFetcher";

export default function LeaderboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setIsLoading(true);
    setPlayers([]);
    try {
      const identifier = localStorage.getItem("gamesphere_steam_id");
        
      if (!identifier) {
          return;
      }

      const data = await fetchLeaderboardData("steam", identifier);
      setPlayers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-6 opacity-30">
            <span className="w-12 h-[1px] bg-primary"></span>
            <h2 className="text-[10px] font-bold text-primary tracking-[0.8em] mb-4 uppercase opacity-50">WAR_INTELLIGENCE</h2>
          </div>
            <h1 className="text-2xl sm:text-4xl md:text-8xl font-heading font-black tracking-widest text-white mb-2">PLATFORM_LADDER</h1>
            <p className="text-[8px] sm:text-[10px] font-mono text-primary/40 tracking-[0.6em] uppercase">Warriors Synchronized // Real-Time Archives</p>
        </div>
        
            <div className="flex gap-4">
                <div className="flex bg-white/5 border border-white/10 rounded-full focus-within:border-primary/50 transition-all overflow-hidden group h-10 items-center">
                    <div className="pl-5">
                        <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-primary transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="SEARCH_WARRIOR..." 
                        className="bg-transparent py-2 pl-3 pr-6 text-[10px] font-bold tracking-widest focus:outline-none w-32 focus:w-48 transition-all text-white placeholder:text-zinc-700 uppercase"
                    />
                </div>
            </div>
      </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="font-heading tracking-[0.4em] text-primary/60 text-xs text-primary animate-pulse">ARCHIVING_BATTLE_RECORDS...</p>
            </div>
          ) : players.length === 0 ? (
            <div className="py-20 text-center border border-white/5 bg-white/5 rounded-sm">
              <p className="font-heading tracking-[0.4em] text-zinc-600 text-xs">NO_WARRIORS_DETECTED_IN_THIS_REALM</p>
            </div>
          ) : (
            players.map((player) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={player.name}
              >
                <GlassCard className="p-6 flex items-center justify-between group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-sm bg-black border border-white/10 overflow-hidden relative">
                      {player.avatar ? (
                          <img src={player.avatar} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                              <User className="w-5 h-5 text-zinc-600" />
                          </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold tracking-widest text-lg">{player.name}</h3>
                      <p className="text-[8px] font-black text-zinc-500 tracking-widest uppercase">{player.platform} // {player.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Power Score</p>
                      <p className="font-heading font-bold text-xl text-primary">{player.score.toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center">
                        {player.trend === "up" ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : player.trend === "down" ? (
                            <TrendingDown className="w-5 h-5 text-red-500" />
                        ) : (
                            <Minus className="w-5 h-5 text-zinc-700" />
                        )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
    </div>
  );
}
