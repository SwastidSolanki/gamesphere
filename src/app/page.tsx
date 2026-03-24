"use client";

import { Bebas_Neue } from "next/font/google";
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
  Zap,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

const bebas = Bebas_Neue({ 
  subsets: ["latin"], 
  weight: ["400"],
  variable: "--font-heading"
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
    <main className={`${bebas.variable} min-h-screen text-foreground font-body overflow-x-hidden bg-transparent`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="max-w-5xl"
        >
          <div className="flex items-center justify-center gap-3 mb-8 opacity-40">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black tracking-[1em] uppercase text-primary">Realm of Legends</span>
          </div>

          <h1 className="text-7xl md:text-[10rem] font-heading mb-8 leading-[0.85] text-white">
            UNIFY <br /> 
            <span className="text-primary italic opacity-90">THE REALMS</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            The Fimbulwinter of fragmented data is over. Connect thy Steam and Riot archives 
            into a single high-fidelity HUD. Command thy legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group px-12 py-6 bg-white text-black font-heading rounded-sm hover:bg-primary transition-all active:scale-95 text-xl tracking-widest flex items-center gap-3"
            >
              BIND_ACCOUNTS <ArrowRight className="w-6 h-6" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-6 bg-white/5 border border-white/10 text-white font-heading rounded-sm hover:bg-white/10 transition-all active:scale-95 text-xl tracking-widest"
            >
              EXPLORE_FEATURES
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Walkthrough */}
      <section id="features" className="py-48 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          <FeatureSection 
            icon={<LayoutDashboard className="w-10 h-10" />}
            title="COUNCIL_DASHBOARD"
            desc="A cinematic overview of thy entire digital empire. Track total playtime and live status across all realms."
            link="/dashboard"
          />
          <FeatureSection 
            icon={<Sword className="w-10 h-10" />}
            title="COMBAT_COMPARISON"
            desc="Pit thy records against any seeker. Measure Steam levels and library depth side-by-side."
            link="/compare"
          />
          <FeatureSection 
            icon={<Trophy className="w-10 h-10" />}
            title="VALIANT_LEADERBOARDS"
            desc="See where thou standest among the legends. Real-time ranking based on verified record archives."
            link="/leaderboard"
          />
          <FeatureSection 
            icon={<User className="w-10 h-10" />}
            title="SEEKER_PROFILES"
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
    </main>
  );
}

function FeatureSection({ icon, title, desc, link }: { icon: React.ReactNode, title: string, desc: string, link: string }) {
  const router = useRouter();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-lg w-fit group-hover:bg-primary group-hover:text-black transition-all">
        {icon}
      </div>
      <h3 className="text-4xl font-heading mb-6 tracking-wide group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
        {desc}
      </p>
      <button 
        onClick={() => router.push(link)}
        className="flex items-center gap-3 font-heading text-lg tracking-widest text-primary border-b border-primary/20 pb-2 hover:border-primary transition-all"
      >
        ACCESS_ARCHIVE <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
