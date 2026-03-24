"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2, Target, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platform: "steam" | "riot", identifier: string) => void;
}

export default function ConnectModal({ isOpen, onClose, onConnect }: ConnectModalProps) {
  const [activeTab, setActiveTab] = useState<"steam" | "riot">("steam");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate API validation/handshake
    await new Promise(r => setTimeout(r, 1500));
    onConnect(activeTab, identifier);
    setIsLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-heading font-bold">CONNECT_ACCOUNT</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 p-1 bg-black/40 rounded-2xl mb-8 border border-white/5">
                <button
                  onClick={() => setActiveTab("steam")}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-heading font-bold transition-all",
                    activeTab === "steam" ? "bg-primary text-black" : "text-zinc-500 hover:text-white"
                  )}
                >
                  STEAM
                </button>
                <button
                  onClick={() => setActiveTab("riot")}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-heading font-bold transition-all",
                    activeTab === "riot" ? "bg-secondary text-black" : "text-zinc-500 hover:text-white"
                  )}
                >
                  RIOT_GAMES
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">
                    {activeTab === "steam" ? "Steam Vanity URL or ID" : "Riot ID (GameName#Tag)"}
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={activeTab === "steam" ? "e.g. SwastidSolanki" : "e.g. Swastid#SOLO"}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-primary/50 transition-all font-mono"
                  />
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-tighter">
                    {activeTab === "steam" 
                      ? "By connecting Steam, we fetch your playtime, achievements, and library statistics in real-time."
                      : "Connecting Riot Games allows us to track your competitive rank and match performance across League and Valorant."
                    }
                  </p>
                </div>

                <button
                  onClick={handleConnect}
                  disabled={!identifier || isLoading}
                  className={cn(
                    "w-full py-4 rounded-2xl font-heading font-bold transition-all relative overflow-hidden flex items-center justify-center gap-2",
                    activeTab === "steam" ? "bg-primary text-black" : "bg-secondary text-black",
                    (!identifier || isLoading) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      ESTABLISH_LINK
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
