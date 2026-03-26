"use client";

import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/Navbar";
import ConnectModal from "@/components/ConnectModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  LayoutDashboard, 
  Trophy, 
  Sword, 
  User, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock
} from "lucide-react";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  useLenis();

  const handleConnect = (platform: string, id: string) => {
    if (platform === "steam") {
        localStorage.setItem(`gamesphere_${platform}_id`, id);
    }
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen text-foreground font-heading overflow-x-hidden bg-[#0d0e12]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYcg7Oi0q.png" 
                alt="Fimbulwinter Vault" 
                className="w-full h-full object-cover opacity-60 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0e12]/40 to-[#0d0e12]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0d0e12_80%)]" />
        </div>

        {/* HUD Scanner Line */}
        <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-primary/20 z-10 shadow-[0_0_20px_rgba(160,192,208,0.3)]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-20 max-w-6xl px-6"
        >
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-[1px] w-12 bg-primary/40" />
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">GAMESPHERE_VERCEL_STABLE</span>
            </div>
            <a 
              href="https://gamesphere-ascent.vercel.app" 
              target="_blank"
              className="text-[8px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors"
            >
              UPLINK_LIVE
            </a>
            <div className="h-[1px] w-12 bg-primary/40" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-[8rem] font-black mb-10 leading-[0.9] tracking-tighter uppercase break-words">
            <span className="block text-zinc-600 opacity-50">MASTER</span>
            <motion.span 
                animate={{ opacity: [0.9, 1, 0.9], x: [0, 2, -2, 0] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
                className="block text-white"
            >
                THY_LEGACY
            </motion.span>
          </h1>

          <p className="text-xs md:text-sm text-zinc-500 font-heading uppercase tracking-[0.3em] mb-16 leading-relaxed px-4 text-center">
            The fimbulwinter of fragmented data is over. <br className="hidden md:block" />
            Synchronize thy Steam archives into a single high-fidelity HUD. <br className="hidden md:block" />
            Command thy legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto group relative px-10 md:px-16 py-5 md:py-7 bg-white text-black font-black hover:bg-primary transition-all active:scale-95 text-xs md:text-sm tracking-[0.4em] uppercase overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-4">
                BIND_IDENTITY <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-7 bg-white/5 border border-white/10 text-white font-black hover:bg-white hover:text-black transition-all active:scale-95 text-xs md:text-sm tracking-[0.4em] uppercase"
            >
              EXPLORE_VAULT
            </button>
          </div>
        </motion.div>

        {/* Status Ticker */}
        <div className="absolute bottom-0 left-0 right-0 py-4 bg-primary/5 border-t border-primary/10 backdrop-blur-md z-30">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[8px] font-black tracking-[0.5em] text-primary/60 uppercase">
                <div className="flex items-center gap-4">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    SYSTEM_STABLE // ARCHIVE_READY
                </div>
                <div className="hidden md:flex gap-12">
                    <span>UPLINK: ACTIVE</span>
                    <span>VAULT: SECURE</span>
                    <span>LAST_SYNC: {new Date().toLocaleTimeString()}</span>
                </div>
                <div>EST_VER: 1.2.4-BETA</div>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-64 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-[1px] bg-gradient-to-b from-primary/40 to-transparent" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          <FeatureSection 
            icon={<LayoutDashboard className="w-8 h-8" />}
            title="WAR_COUNCIL"
            desc="A cinematic overview of thy entire digital empire. Track total playtime and live status across all realms."
            link="/dashboard"
          />
          <FeatureSection 
            icon={<Sword className="w-8 h-8" />}
            title="VALIANT_COMPARISON"
            desc="Pit thy records against any seeker. Measure Steam levels and library depth side-by-side."
            link="/compare"
          />
          <FeatureSection 
            icon={<Trophy className="w-8 h-8" />}
            title="LEADERBORD_ASCENSION"
            desc="See where thou standest among the legends. Real-time ranking based on verified record archives."
            link="/leaderboard"
          />
          <FeatureSection 
            icon={<User className="w-8 h-8" />}
            title="SEEKER_VAULT"
            desc="Thy identity, forged in data. A unified archive of thy achievements across the gaming multiverse."
            link="/profile"
          />
        </div>
      </section>

      <ConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConnect={handleConnect}
      />

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black tracking-[0.8em] text-zinc-600 uppercase">Thy Legacy is Eternal</p>
      </footer>
    </main>
  );
}

function FeatureSection({ icon, title, desc, link }: { icon: React.ReactNode, title: string, desc: string, link: string }) {
  const router = useRouter();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group p-16 bg-[#0d0e12] hover:bg-primary/5 border-l border-white/5 hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden"
      onClick={() => router.push(link)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Zap className="w-4 h-4 text-primary/40" />
      </div>
      <div className="mb-12 text-primary group-hover:scale-110 transition-transform origin-left">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-6 tracking-widest text-white transition-colors uppercase">{title}</h3>
      <p className="text-zinc-500 text-xs mb-12 leading-relaxed tracking-wider group-hover:text-zinc-300 transition-colors uppercase font-bold">
        {desc}
      </p>
      <div className="flex items-center gap-3 font-black text-[10px] tracking-[0.4em] text-primary transition-all uppercase">
        ACCESS_ARCHIVE <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
      </div>
    </motion.div>
  );
}
