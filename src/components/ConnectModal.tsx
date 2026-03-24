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
  const [activeTab, setActiveTab] = useState<"steam" | "riot">("steam");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "steam") {
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
      } else {
        // Simple Riot simulation for now, but validating format
        if (!identifier.includes("#")) {
            setError("INVALID_FORMAT: USE NAME#TAG");
            setIsLoading(false);
            return;
        }
        setPreview({
            name: identifier.split("#")[0],
            tag: identifier.split("#")[1],
            avatar: null
        });
      }
    } catch (err) {
      setError("UPLINK_FAILURE: TRY AGAIN");
    }
    setIsLoading(false);
  };

  const handleConfirm = () => {
    onConnect(activeTab, preview.id || identifier);
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
                <h2 className="text-4xl font-heading">ACCOUNT_UPLINK</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!preview ? (
                <div className="space-y-8">
                  <div className="flex gap-4 p-1 bg-white/[0.02] border border-white/5">
                    <button
                      onClick={() => { setActiveTab("steam"); setError(null); }}
                      className={cn(
                        "flex-1 py-4 font-heading tracking-widest transition-all",
                        activeTab === "steam" ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                      )}
                    >
                      STEAM_NODE
                    </button>
                    <button
                      onClick={() => { setActiveTab("riot"); setError(null); }}
                      className={cn(
                        "flex-1 py-4 font-heading tracking-widest transition-all",
                        activeTab === "riot" ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                      )}
                    >
                      RIOT_NODE
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3 block">
                      IDENTIFIER ({activeTab === "steam" ? "Username, Vanity URL or ID" : "GameName#Tag"})
                    </label>
                    <div className="flex gap-2">
                        <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={activeTab === "steam" ? "e.g. SwastidSolanki" : "e.g. Swastid#SOLO"}
                        className="flex-1 bg-black/40 border border-white/10 py-5 px-8 text-lg focus:outline-none focus:border-white transition-all font-mono text-white"
                        />
                        <button 
                            onClick={handleVerify}
                            disabled={isLoading || !identifier}
                            className="px-8 bg-white text-black font-heading tracking-widest hover:bg-primary transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "SEARCH"}
                        </button>
                    </div>
                  </div>

                  {activeTab === "steam" && (
                    <>
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[8px] uppercase font-black text-zinc-600 tracking-[0.5em] bg-[#0d0e12] px-2">OFFICIAL_AUTH</div>
                      </div>

                      <button
                        onClick={() => {
                            window.location.href = "/api/auth/steam";
                        }}
                        className="w-full py-6 bg-[#171a21] text-white font-heading text-xl tracking-widest hover:bg-[#2a475e] transition-all flex items-center justify-between px-10 border border-white/10 group shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                      >
                        <span className="font-black">LOGIN WITH STEAM</span>
                        <img src="https://community.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg?t=96bea98" alt="Steam" className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </>
                  )}

                  {activeTab === "riot" && (
                    <>
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[8px] uppercase font-black text-zinc-600 tracking-[0.5em] bg-[#0d0e12] px-2">OFFICIAL_AUTH</div>
                      </div>

                      <button
                        onClick={() => {
                            window.location.href = "/api/auth/riot";
                        }}
                        className="w-full py-6 bg-[#d13639] text-white font-heading text-xl tracking-widest hover:bg-[#ff4655] transition-all flex items-center justify-between px-10 border border-white/10 group shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                      >
                        <span className="font-black">LOGIN WITH RIOT CLIENT</span>
                        <img src="https://www.riotgames.com/dark-riot-logo.png" alt="Riot" className="w-10 h-10 object-contain invert brightness-0 group-hover:brightness-100 transition-all" />
                      </button>

                      <div className="mt-4 p-4 bg-zinc-950/50 border border-white/5 text-[8px] font-black tracking-widest text-zinc-500 uppercase leading-relaxed font-mono">
                        NOTE: Production identity binding requires verified RSO client.
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-10"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-heading mb-2 tracking-widest text-primary">SELECT_IDENTITY</h3>
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
                        <p className="text-[8px] font-black tracking-widest opacity-40 uppercase">{activeTab === "steam" ? `STEAM_ARCHIVE: ${preview.id}` : `RIOT_ACCOUNT: #${preview.tag}`}</p>
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
                           <p className="font-heading text-sm opacity-60">ADDITIONAL_RECORDS...</p>
                           <p className="text-[8px] font-black tracking-widest">ENCRYPTED_ID_CONFLICT</p>
                        </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setPreview(null)}
                    className="w-full py-5 border border-white/10 font-heading text-xs tracking-widest hover:text-red-500 transition-all uppercase"
                  >
                    RETURN_TO_SEARCH
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
