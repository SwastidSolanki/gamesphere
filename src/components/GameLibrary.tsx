"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import GameBanner from "./GameBanner";

interface Game {
  name: string;
  playtime: number; // in minutes
  logo?: string;
  appid?: number;
  icon?: string;
}

interface GameLibraryProps {
  games: Game[];
}

export default function GameLibrary({ games }: GameLibraryProps) {
  const sortedGames = [...games].sort((a, b) => b.playtime - a.playtime);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedGames.map((game, index) => (
          <motion.div
            key={`${game.name}-${index}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-zinc-950/40 border border-primary/20 rounded-sm overflow-hidden hover:border-primary/60 transition-all aspect-[16/9] shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            {/* Banner Image */}
            <div className="absolute inset-0 z-0">
               <GameBanner 
                appid={game.appid} 
                name={game.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 h-full p-8 flex flex-col justify-end">
              <div className="flex justify-between items-end gap-4">
                <div className="flex-1">
                  <div className="inline-block px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-[0.3em] border mb-4 border-primary/30 text-primary/80 bg-primary/5">
                    STEAM
                  </div>
                  <h4 className="text-2xl font-heading font-black group-hover:text-primary transition-colors leading-tight mb-2 truncate tracking-widest">
                    {game.name}
                  </h4>
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono tracking-[0.4em] font-bold">
                    <Clock className="w-3 h-3" />
                    {Math.floor(game.playtime / 60)} HOURS RECORDED
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedGames.length === 0 && (
        <div className="py-24 text-center border border-dashed border-white/10 rounded-sm bg-white/5">
          <p className="text-zinc-500 font-heading tracking-[0.6em] uppercase text-xs">No war records found.</p>
        </div>
      )}
    </div>
  );
}
