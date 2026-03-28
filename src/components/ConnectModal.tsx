"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, User, Search, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platform: "steam" | "riot", identifier: string) => void;
}

export default function ConnectModal({ isOpen, onClose, onConnect }: ConnectModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"input" | "select">("input");

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    try {
        // Broad search first
        const searchRes = await fetch(`/api/steam?endpoint=search&q=${identifier}`);
        const searchData = await searchRes.json();
        
        if (searchData.success && searchData.results && searchData.results.length > 0) {
          setResults(searchData.results);
          setMode("select");
        } else {
          // Fallback to exact vanity/id lookup if search returns nothing
          const res = await fetch(`/api/steam?endpoint=vanity&vanityurl=${identifier}`);
          const data = await res.json();
          let steamid = identifier;
          
          if (data.response?.success === 1) {
            steamid = data.response.steamid;
          }

          const profileRes = await fetch(`/api/steam?endpoint=profile&steamid=${steamid}`);
          const profileData = await profileRes.json();
          
          if (profileData.response?.players?.[0]) {
            const player = profileData.response.players[0];
            setResults([{
              name: player.personaname,
              avatar: player.avatarfull,
              id: steamid
            }]);
            setMode("select");
          } else {
            setError("ARCHIVE_NULL: NO IDENTITY MATCH FOUND");
          }
        }
    } catch (err) {
      setError("UPLINK_CRITICAL_FAILURE: RECONNECT");
    }
    setIsLoading(false);
  };

  const handleSelect = (result: any) => {
    onConnect("steam", result.id);
    onClose();
    reset();
  };

  const reset = () => {
    setResults([]);
    setIdentifier("");
    setMode("input");
    setError(null);
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
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-[#0a0a0d] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          >
            {/* HUD Scan Line animation */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-hud-scan z-20" />

            <div className="p-8 sm:p-12">
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-5xl font-heading font-bold tracking-tighter text-white leading-none uppercase">System Uplink</h2>
                  <p className="text-[9px] font-bold text-primary/40 tracking-[0.6em] uppercase font-mono">Network // 0xPROTO_0</p>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-3 hover:bg-white/5 transition-all rounded-full group"
                >
                  <X className="w-6 h-6 text-zinc-500 group-hover:text-white" />
                </button>
              </div>

              {mode === "input" ? (
                <div className="space-y-10">
                  <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                       <label className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em]">
                        Identity Resolver
                      </label>
                      <span className="text-[10px] font-mono text-primary animate-pulse uppercase">ready for connection</span>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-primary" />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && identifier && handleVerify()}
                        placeholder="Input protocol identifier..."
                        className="w-full bg-white/[0.03] border border-white/10 focus:border-primary/50 py-6 pl-16 pr-8 text-sm focus:outline-none font-mono tracking-wider text-white placeholder:text-zinc-800 transition-all rounded-lg"
                      />
                    </div>
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-red-500 font-black text-[10px] tracking-widest bg-red-500/10 p-4 border-l-4 border-red-500"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}

                    <button 
                        onClick={handleVerify}
                        disabled={isLoading || !identifier}
                        className="w-full py-6 bg-primary text-black font-bold text-xs tracking-[0.3em] uppercase hover:bg-white transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3 group rounded-lg"
                    >
                        {isLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            Resolve Identity
                            <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                          </>
                        )}
                    </button>
                  </div>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-[9px] uppercase font-black text-zinc-600 tracking-[0.6em] bg-[#0a0a0d] px-4 italic">OR DIRECT CONNECTION</div>
                  </div>

                  <button
                    onClick={() => { window.location.href = "/api/auth/steam"; }}
                    className="w-full py-8 bg-[#171a21] text-white font-heading text-2xl tracking-tight hover:bg-[#2a475e] transition-all flex items-center justify-between px-10 border border-white/10 group shadow-2xl relative overflow-hidden rounded-xl"
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-bold relative z-10 uppercase text-sm tracking-widest">Access Node // Steam</span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" alt="Steam" className="w-12 h-12 opacity-30 group-hover:opacity-60 transition-all filter invert transform group-hover:rotate-6" />
                  </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="border-l-4 border-primary pl-6 py-2 bg-primary/5">
                    <h3 className="text-2xl font-black font-heading tracking-widest text-primary italic">Identities Discovered</h3>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.4em] mt-1">Search Query: "{identifier}"</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-4 custom-scrollbar">
                    {results.map((player, idx) => (
                      <motion.div 
                          key={player.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleSelect(player)}
                          className="group relative flex flex-col items-center gap-4 p-6 bg-white/[0.02] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer rounded-xl overflow-hidden text-center"
                      >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full border-2 border-white/5 p-1 group-hover:border-primary/60 transition-all transform group-hover:scale-110 relative z-10">
                            {player.avatar ? (
                                <img src={player.avatar} alt="PFP" className="w-full h-full rounded-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all border border-white/10" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center"><User className="w-8 h-8 text-white/20" /></div>
                            )}
                          </div>
                          {/* Pulse effect */}
                          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-0 group-hover:opacity-100" />
                        </div>

                        <div className="space-y-1">
                          <p className="font-heading text-lg group-hover:text-white transition-colors tracking-tight font-bold truncate max-w-[120px]">{player.name}</p>
                          <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-primary transition-colors">ID: {player.id.slice(0, 8)}...</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {results.length === 0 && (
                       <div className="flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[9px] font-bold tracking-[0.2em] text-zinc-400 uppercase font-mono">VALHALLA_GATE: ACTIVE</span>
                    </div>
                    )}
                  </div>

                    <div className="flex gap-4">
                    <button
                      onClick={reset}
                      className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white font-heading text-[10px] font-black tracking-[0.3em] transition-all uppercase border border-white/10 italic"
                    >
                      Abort & Search Again
                    </button>
                   </div>
                </motion.div>
              )}
            </div>
            
            {/* HUD Footer decorative elements */}
            <div className="px-12 py-6 bg-white/[0.02] border-t border-white/5 flex justify-between items-center opacity-30">
               <div className="flex gap-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-[2px] bg-zinc-600" />)}
               </div>
               <span className="text-[8px] font-mono text-zinc-600 tracking-[0.5em]">SYSTEM_LOCK // V2.9.4</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
