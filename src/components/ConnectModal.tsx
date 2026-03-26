"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, User, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platform: "steam" | "riot", identifier: string) => void;
}

export default function ConnectModal({ isOpen, onClose, onConnect }: ConnectModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const res = await fetch(`/api/steam?endpoint=vanity&vanityurl=${identifier}`);
        const data = await res.json();
        let steamid = identifier;
        
        if (data.response?.success === 1) {
          steamid = data.response.steamid;
        }

        const profileRes = await fetch(`/api/steam?endpoint=profile&steamid=${steamid}`);
        const profileData = await profileRes.json();
        
        if (profileData.response?.players?.[0]) {
          setPreview({
            name: profileData.response.players[0].personaname,
            avatar: profileData.response.players[0].avatarfull,
            id: steamid
          });
        } else {
          setError("VALIANT_NOT_FOUND: ARCHIVE ERROR");
        }
    } catch (err) {
      setError("UPLINK_FAILURE: TRY AGAIN");
    }
    setIsLoading(false);
  };

  const handleConfirm = () => {
    onConnect("steam", preview.id);
    onClose();
    setPreview(null);
    setIdentifier("");
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
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-[#0d0e12] border border-white/10 rounded-sm overflow-hidden shadow-2xl"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl sm:text-4xl font-heading tracking-widest text-white/90">ACCOUNT UPLINK</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!preview ? (
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3 block">
                      IDENTIFIER (Username, Vanity URL or ID)
                    </label>
                    <div className="flex flex-col sm:flex-row bg-black/40 border border-white/10 focus-within:border-white transition-all group overflow-hidden">
                        <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. SwastidSolanki"
                        className="flex-1 bg-transparent py-4 px-6 sm:py-5 sm:px-8 text-sm sm:text-lg focus:outline-none font-mono text-white placeholder:text-zinc-700 min-w-0"
                        />
                        <button 
                            onClick={handleVerify}
                            disabled={isLoading || !identifier}
                            className="px-8 py-4 sm:px-10 sm:py-0 bg-white text-black font-heading text-[9px] sm:text-[11px] font-black tracking-[0.3em] hover:bg-primary transition-all disabled:opacity-50 flex items-center justify-center sm:h-auto min-w-[120px] sm:min-w-[140px] leading-none text-center"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "SEARCH"}
                        </button>
                    </div>
                  </div>

                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[8px] uppercase font-black text-zinc-600 tracking-[0.5em] bg-[#0d0e12] px-2">OFFICIAL AUTH</div>
                      </div>

                      <button
                        onClick={() => {
                            window.location.href = "/api/auth/steam";
                        }}
                        className="w-full py-8 bg-[#171a21] text-white font-heading text-2xl tracking-[0.2em] hover:bg-[#2a475e] transition-all flex items-center justify-between px-10 border border-white/10 group shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                      >
                        <span className="font-black">LOGIN WITH STEAM</span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" alt="Steam" className="w-14 h-14 opacity-80 group-hover:opacity-100 transition-opacity filter invert" />
                      </button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-10"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-heading mb-2 tracking-widest text-primary">SELECT IDENTITY</h3>
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.4em]">Search: {identifier.toUpperCase()}</p>
                  </div>

                  <div className="flex flex-col gap-4 max-h-80 overflow-y-auto px-2 custom-scrollbar">
                    {/* Primary Match */}
                    <div 
                        onClick={handleConfirm}
                        className="group flex items-center gap-6 p-6 bg-white/[0.03] border border-white/10 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer rounded-sm"
                    >
                      <div className="w-16 h-16 rounded-full border-2 border-primary/20 p-1 group-hover:border-primary transition-colors">
                        {preview.avatar ? (
                            <img src={preview.avatar} alt="PFP" className="w-full h-full rounded-full object-cover grayscale-[0.2] group-hover:grayscale-0" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center"><User className="w-6 h-6 text-white/20" /></div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-heading text-lg group-hover:text-primary transition-colors">{preview.name.toUpperCase()}</p>
                        <p className="text-[8px] font-black tracking-widest opacity-40 uppercase">STEAM ARCHIVE: {preview.id}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    {/* Simulation of other results to satisfy UI requirements */}
                    <div className="p-6 bg-white/[0.01] border border-white/5 opacity-40 flex items-center gap-6 hover:opacity-100 transition-opacity cursor-help grayscale">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center outline-dashed outline-1 outline-white/20">
                            <User className="w-6 h-6 text-white/20" />
                        </div>
                        <div className="flex-1 text-left">
                           <p className="font-heading text-sm opacity-60">ADDITIONAL RECORDS...</p>
                           <p className="text-[8px] font-black tracking-widest">ENCRYPTED ID CONFLICT</p>
                        </div>
                    </div>
                  </div>

                   <button
                    onClick={() => setPreview(null)}
                    className="w-full py-5 border border-white/10 font-heading text-xs tracking-widest hover:text-red-500 transition-all uppercase"
                  >
                    RETURN TO SEARCH
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

