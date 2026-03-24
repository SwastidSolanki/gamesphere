"use client";

import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import { Gamepad2, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Game {
  name: string;
  playtime: number; // in minutes
  platform: "steam" | "riot";
  logo?: string;
  appid?: number;
  icon?: string;
}

const MOCK_LIBRARY: Game[] = [
  { name: "Elden Ring", playtime: 12400, platform: "steam" },
  { name: "Valorant", playtime: 45000, platform: "riot" },
  { name: "Cyberpunk 2077", playtime: 5600, platform: "steam" },
  { name: "Black Myth: Wukong", playtime: 3200, platform: "steam" },
  { name: "League of Legends", playtime: 89000, platform: "riot" },
];

export default function GameLibrary({ games = MOCK_LIBRARY }: { games?: Game[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xs font-heading font-bold text-primary tracking-[0.3em] mb-2 uppercase opacity-60">Archive</h2>
          <h1 className="text-3xl font-heading font-bold tracking-tight">UNIFIED_LIBRARY</h1>
        </div>
        <p className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">{games.length} TITLES_DETECTED</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.sort((a, b) => b.playtime - a.playtime).map((game, index) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="group bg-zinc-900/50 border border-white/5 p-4 rounded-2xl hover:border-white/20 transition-all hover:bg-zinc-800/50">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center overflow-hidden">
                  {game.appid && game.icon ? (
                    <img 
                      src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.icon}.jpg`} 
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Gamepad2 className={cn("w-5 h-5", game.platform === "steam" ? "text-primary" : "text-secondary")} />
                  )}
                </div>
                <div className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter border",
                    game.platform === "steam" ? "border-primary/30 text-primary" : "border-secondary/30 text-secondary"
                )}>
                    {game.platform}
                </div>
              </div>
              
              <h3 className="font-heading font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">{game.name}</h3>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-mono font-bold">{Math.round(game.playtime / 60)}h</span>
                </div>
                <button className="text-zinc-700 group-hover:text-white transition-colors">
                    <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
