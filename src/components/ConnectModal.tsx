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
                        className="w-full py-6 bg-[#171a21] text-white font-heading text-xl tracking-widest hover:bg-[#2a475e] transition-all flex items-center justify-center gap-3 border border-white/10"
                      >
                        LOGIN_VIA_STEAM_SECURE
                      </button>
                    </>
                  )}

                  {activeTab === "riot" && (
                    <div className="p-4 bg-zinc-950/50 border border-white/5 text-[8px] font-black tracking-widest text-zinc-500 uppercase leading-relaxed">
                      NOTE: OFFICIAL RIOT_LOGIN REQUIRES PRODUCTION_OAUTH_CLIENT. PREVIEWING VIA VERIFIED_HANDSHAKE FOR CURRENT UPLINK.
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 text-center"
                >
                  <div className="relative inline-block">
                    {preview.avatar ? (
                        <img src={preview.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-primary shadow-[0_0_30px_rgba(160,192,208,0.3)]" />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/5">
                            <User className="w-12 h-12 text-zinc-500" />
                        </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-full">
                        <ShieldCheck className="w-5 h-5 text-black" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-heading mb-1">{preview.name.toUpperCase()}</h3>
                    <p className="text-xs font-black text-primary tracking-[0.5em]">{activeTab === "steam" ? "STEAM_LEGACY_FOUND" : `RIOT_ACCOUNT_FOUND: #${preview.tag}`}</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setPreview(null)}
                      className="flex-1 py-5 border border-white/10 font-heading text-lg tracking-widest hover:bg-white/5 transition-all"
                    >
                      WRONG_ACCOUNT
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 py-5 bg-white text-black font-heading text-lg tracking-widest hover:bg-primary transition-all"
                    >
                      BIND_IDENTITY
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
