"use client";

import { Cinzel } from "next/font/google";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/Navbar";
import ConnectModal from "@/components/ConnectModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Globe } from "lucide-react";

const cinzel = Cinzel({ 
  subsets: ["latin"], 
  weight: ["400", "700", "900"],
  variable: "--font-serif"
});

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  useLenis();

  const handleConnect = (platform: string, id: string) => {
    localStorage.setItem(`gamesphere_${platform}_id`, id);
    router.push("/dashboard");
  };

  return (
    <main className={`${cinzel.variable} min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white font-body`}>
      <Navbar />
      
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.45]" 
          style={{ backgroundImage: `url('/elden_ring_bg.png')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      <section className="relative z-10 pt-48 pb-32 px-6 min-h-screen flex flex-col justify-center text-center">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-4 mb-12 opacity-80">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-primary"></div>
              <span className="text-[10px] font-bold tracking-[0.8em] uppercase font-serif text-primary">Seek the Elden Data</span>
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-primary"></div>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif font-black tracking-widest mb-10 leading-[1.1] text-primary drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              GAMESPHERE <br /> 
              <span className="text-white opacity-90 text-4xl md:text-5xl tracking-[0.4em]">ASCENSION</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-16 font-serif italic tracking-wide opacity-80 leading-relaxed">
              Thy records are eternal. Bind thy Steam and Riot identities to 
              unveil the true depth of thy journey across the digital lands.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative px-12 py-6 bg-primary/10 border border-primary/40 text-primary font-serif font-bold rounded-sm overflow-hidden transition-all hover:bg-primary hover:text-background active:scale-95 text-xs tracking-[0.3em]"
              >
                <span className="relative z-10 flex items-center gap-3">
                  BIND_IDENTITIES <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>

              <button 
                onClick={() => router.push('/leaderboard')}
                className="px-10 py-6 bg-zinc-950/80 border border-white/5 text-white font-serif font-bold rounded-sm hover:bg-white/5 transition-all active:scale-95 text-xs tracking-[0.3em] backdrop-blur-md"
              >
                VIEW_THE_VALIANT
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <ConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConnect={handleConnect}
      />
    </main>
  );
}
