"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, X } from "lucide-react";

export default function RiotMockLoginPage() {
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        if (!identifier.includes("#")) return;
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem('gamesphere_riot_id', identifier);
            window.location.href = "/dashboard?riot_auth=success";
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center font-sans p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.contentstack.io/v3/assets/blt73064112e3748276/blt85150824b077a280/6178c66e6b414d603aede68f/Riot_Games_Wallpapers_Generic_Logo_White.jpg')] bg-cover bg-center opacity-10 grayscale scale-110 blur-sm" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md bg-white p-12 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#d13639]" />
                
                <div className="mb-12 flex justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Riot_Games_logo_2022.svg" alt="Riot" className="h-8 filter brightness-0" />
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight text-center">Sign In</h2>
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Riot ID (NAME#TAG)</label>
                        <input 
                            type="text" 
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="e.g. Swastid#SOLO"
                            className="w-full bg-[#f9f9f9] border-2 border-transparent focus:border-[#d13639] py-4 px-4 text-black font-bold outline-none transition-all placeholder:text-zinc-300"
                        />
                    </div>

                    <p className="text-[10px] text-zinc-400 font-bold leading-relaxed text-center px-4">
                        By signing in, you agree to our Terms of Service and Privacy Policy. Mock environment active.
                    </p>

                    <button 
                        onClick={handleLogin}
                        disabled={isLoading || !identifier.includes("#")}
                        className="w-full bg-[#d13639] hover:bg-[#ff4655] disabled:bg-zinc-200 text-white font-black py-5 uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                    
                    <div className="pt-8 border-t border-zinc-100 flex justify-between gap-4">
                        <div className="w-10 h-10 bg-[#f9f9f9] rounded-sm flex items-center justify-center cursor-not-allowed opacity-40"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-5" /></div>
                        <div className="w-10 h-10 bg-[#f9f9f9] rounded-sm flex items-center justify-center cursor-not-allowed opacity-40"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-5" /></div>
                        <div className="w-10 h-10 bg-[#f9f9f9] rounded-sm flex items-center justify-center cursor-not-allowed opacity-40"><img src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Logo_Facebook.svg" className="w-5" /></div>
                    </div>
                </div>

                <div className="absolute top-4 right-4 text-zinc-200 hover:text-black transition-colors cursor-pointer" onClick={() => window.location.href="/dashboard"}>
                    <X className="w-6 h-6" />
                </div>
            </motion.div>
        </div>
    );
}
