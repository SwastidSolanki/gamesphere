"use client";

import { Cormorant_Garamond } from "next/font/google";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/Navbar";
import ConnectModal from "@/components/ConnectModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Globe } from "lucide-react";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "600", "700"],
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
    <main className={`${cormorant.variable} min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-white font-body`}>
      <Navbar />
      
      {/* Cinematic Background Layer */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.35] grayscale-[0.3]" 
          style={{ backgroundImage: `url('/tlou2_hero_bg.png')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <section className="relative z-10 pt-48 pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-8 opacity-50">
              <span className="w-8 h-[1px] bg-primary"></span>
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase font-mono">Endure and Survive</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-8 leading-[1.1]">
              Refine Your Edge. <br /> 
              <span className="text-primary italic opacity-90 underline decoration-primary/20 decoration-1 underline-offset-8">Master Your Games.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 font-body leading-relaxed opacity-80">
              Unify your combat records. Connect Steam and Riot accounts for 
              high-fidelity cinematic performance analytics. No noise. Just facts.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative px-10 py-5 bg-primary text-background font-bold rounded-xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(167,180,158,0.2)] active:scale-95 text-sm tracking-widest"
              >
                <span className="relative z-10 flex items-center gap-2">
                  ESTABLISH_CONNECTION <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button 
                onClick={() => router.push('/leaderboard')}
                className="px-8 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all active:scale-95 text-sm tracking-widest backdrop-blur-md"
              >
                BROWSE_ARCHIVES
              </button>
            </div>
          </motion.div>

          <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-5 h-5" />} 
              label="Real-Time Uplink" 
              value="STABLE" 
              desc="Live synchronization with global game servers."
            />
            <FeatureCard 
              icon={<Target className="w-5 h-5" />} 
              label="Combat Proficiency" 
              value="VERIFIED" 
              desc="Deep analysis of your tactical performance."
            />
            <FeatureCard 
              icon={<Globe className="w-5 h-5" />} 
              label="Unified Archives" 
              value="SECURE" 
              desc="A single cinematic vault for all your titles."
            />
          </div>
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

function FeatureCard({ icon, label, value, desc }: { icon: React.ReactNode, label: string, value: string, desc: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 bg-zinc-950/20 backdrop-blur-xl border border-white/5 rounded-2xl hover:border-primary/20 transition-all group"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20 group-hover:bg-primary group-hover:text-background transition-colors duration-500">
          {icon}
        </div>
        <span className="text-[9px] font-bold text-primary font-mono bg-primary/5 px-2 py-1 rounded border border-primary/10 tracking-widest">
          {value}
        </span>
      </div>
      <h3 className="text-[10px] font-bold font-mono tracking-[0.2em] uppercase mb-4 opacity-40">{label}</h3>
      <p className="text-xl font-serif font-bold mb-2 leading-tight">{desc}</p>
    </motion.div>
  );
}
