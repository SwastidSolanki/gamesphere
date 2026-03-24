"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation"; // Added useRouter

export default function RiotMockLoginPage() {
    const [step, setStep] = useState(1);
    const [riotId, setRiotId] = useState(""); // Changed identifier to riotId
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Added isGoogleLoading
    const router = useRouter(); // Initialized useRouter

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        setTimeout(() => {
            const mockId = "SWIFT#SOLO";
            setRiotId(mockId);
            setIsGoogleLoading(false);
            // Auto submit after google login
            setIsLoading(true);
            setTimeout(() => {
                localStorage.setItem('gamesphere_riot_id', mockId);
                window.location.href = "/dashboard?riot_auth=success";
            }, 1000);
        }, 1500);
    };

    const handleLogin = () => {
        if (!riotId.includes("#")) return; // Changed identifier to riotId
        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem('gamesphere_riot_id', riotId); // Changed identifier to riotId
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
                
                {/* Google Loading Overlay */}
                {isGoogleLoading && (
                    <div className="absolute inset-0 bg-white z-[100] flex items-center justify-center">
                        <div className="text-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-12 h-12 mx-auto mb-4 animate-bounce" />
                            <p className="font-sans text-sm text-zinc-600">Signing in with Google...</p>
                        </div>
                    </div>
                )}

                {/* Header with Riot Logo */}
                <div className="flex justify-center mb-10">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Riot_Games_logo_2022.svg" 
                        alt="Riot Games" 
                        className="w-24 h-24 object-contain"
                    />
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight text-center">Sign In</h2>
                    
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-1">Riot ID (NAME#TAG)</label>
                        <input 
                            type="text" 
                            value={riotId} // Changed identifier to riotId
                            onChange={(e) => setRiotId(e.target.value)} // Changed setIdentifier to setRiotId
                            placeholder="e.g. Swastid#SOLO"
                            className="w-full bg-[#f9f9f9] border-2 border-transparent focus:border-[#d13639] py-4 px-4 text-black font-bold outline-none transition-all placeholder:text-zinc-300"
                        />
                    </div>

                    <p className="text-[10px] text-zinc-400 font-bold leading-relaxed text-center px-4">
                        By signing in, you agree to our Terms of Service and Privacy Policy. Mock environment active.
                    </p>

                    <button 
                        onClick={handleLogin}
                        disabled={isLoading || !riotId.includes("#")}
                        className="w-full bg-[#d13639] hover:bg-[#ff4655] disabled:bg-zinc-200 text-white font-black py-5 uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </button>
                    
                    <div className="flex justify-center gap-4 pt-4 border-t border-zinc-100">
                    <button 
                        type="button"
                        onClick={() => {}}
                        className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-sm hover:bg-zinc-200 transition-all group"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-all" />
                    </button>
                    <button 
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-sm hover:bg-zinc-200 transition-all group"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-all" />
                    </button>
                    <button 
                        type="button"
                        onClick={() => {}}
                        className="w-12 h-12 flex items-center justify-center bg-zinc-100 rounded-sm hover:bg-zinc-200 transition-all group"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="FB" className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-all" />
                    </button>
                </div>
                </div>

                <div className="absolute top-4 right-4 text-zinc-200 hover:text-black transition-colors cursor-pointer" onClick={() => window.location.href="/dashboard"}>
                    <X className="w-6 h-6" />
                </div>
            </motion.div>
        </div>
    );
}
