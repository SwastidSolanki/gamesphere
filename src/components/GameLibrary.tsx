"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Game {
  name: string;
  playtime: number; // in minutes
  platform: "steam" | "riot";
  logo?: string;
  appid?: number;
  icon?: string;
}

interface GameLibraryProps {
  games: Game[];
}

export default function GameLibrary({ games }: GameLibraryProps) {
  // Relaxed filtering to show all games as per user request
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
            className="group relative bg-zinc-950/40 border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all aspect-[16/9]"
          >
            {/* Banner Image */}
            <div className="absolute inset-0 z-0">
              {game.appid ? (
                <SteamBanner appid={game.appid} name={game.name} />
              ) : (
                <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                  <Gamepad2 className="w-12 h-12 text-primary/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 h-full p-6 flex flex-col justify-end">
              <div className="flex justify-between items-end gap-4">
                <div className="flex-1">
                  <div className={cn(
                    "inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border mb-3",
                    game.platform === "steam" ? "border-primary/30 text-primary/80" : "border-secondary/30 text-secondary/80"
                  )}>
                    {game.platform}
                  </div>
                  <h4 className="text-xl font-heading font-black group-hover:text-primary transition-colors leading-tight mb-1 truncate tracking-wider">
                    {game.name}
                  </h4>
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono tracking-widest">
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
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-zinc-500 font-heading tracking-widest uppercase text-xs">No war records found.</p>
        </div>
      )}
    </div>
  );
}
