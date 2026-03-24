"use client";

import { Montserrat } from "next/font/google";
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

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "700", "900"],
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
    <main className={`${montserrat.variable} min-h-screen text-foreground font-body overflow-x-hidden bg-transparent`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <div className="flex items-center justify-center gap-3 mb-8 opacity-40">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black tracking-[1em] uppercase text-primary">Realm of Legends</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] text-white">
            UNIFY <br /> 
            <span className="text-primary italic opacity-90">THE NINE REALMS</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
            The Fimbulwinter of fragmented data is over. Connect thy Steam and Riot archives 
            into a single high-fidelity HUD. Command thy legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group px-12 py-6 bg-white text-black font-black rounded-sm hover:bg-primary transition-all active:scale-95 text-sm tracking-widest flex items-center gap-3"
            >
              ESTABLISH_UPLINK <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-sm hover:bg-white/10 transition-all active:scale-95 text-sm tracking-widest"
            >
              EXPLORE_FEATURES
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Walkthrough */}
      <section id="features" className="py-48 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Left: Sticky Feature List */}
          <div className="space-y-24">
            <FeatureSection 
              icon={<LayoutDashboard className="w-10 h-10" />}
              title="COUNCIL_DASHBOARD"
              desc="A cinematic overview of thy entire digital empire. Track total playtime, power scores, and live status across all connected realms."
              link="/dashboard"
            />
            <FeatureSection 
              icon={<Sword className="w-10 h-10" />}
              title="COMBAT_COMPARISON"
              desc="Pit thy records against any seeker in the realms. Measure Steam levels, library depth, and competitive rankings side-by-side."
              link="/compare"
            />
          </div>

          {/* Right: Feature Cards */}
          <div className="space-y-24 lg:pt-32">
            <FeatureSection 
              icon={<Trophy className="w-10 h-10" />}
              title="VALIANT_LEADERBOARDS"
              desc="See where thou standest among the legends. Real-time ranking based on verified API records. No false glory."
              link="/leaderboard"
            />
            <FeatureSection 
              icon={<User className="w-10 h-10" />}
              title="SEEKER_PROFILES"
              desc="thy identity, forged in data. A unified archive of thy achievements and artifacts from across the gaming multiverse."
              link="/profile"
            />
          </div>
        </div>
      </section>

      {/* Stats Divider */}
      <section className="py-32 border-y border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <StatItem val="100%" label="DATA_ACCURACY" />
            <StatItem val="24/7" label="REAL_TIME_UPLINK" />
            <StatItem val="SECURE" label="IDENTITIES" />
            <StatItem val="FREE" label="ASCENSION" />
        </div>
      </section>

      {/* Footer / Connect */}
      <section className="py-48 text-center px-6">
        <h2 className="text-4xl md:text-6xl font-black mb-12 text-white">READY FOR THE JOURNEY?</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-16 py-8 bg-primary text-black font-black rounded-sm hover:bg-white transition-all text-xl tracking-[0.2em]"
        >
          BIND_ACCOUNTS_NOW
        </button>
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
      <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-2xl w-fit group-hover:bg-primary group-hover:text-black transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl md:text-4xl font-black mb-6 tracking-tighter group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-zinc-500 text-lg mb-10 leading-relaxed font-medium">
        {desc}
      </p>
      <button 
        onClick={() => router.push(link)}
        className="flex items-center gap-3 font-black text-xs tracking-widest text-primary border-b border-primary/20 pb-2 hover:border-primary transition-all"
      >
        ACCESS_ARCHIVE <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function StatItem({ val, label }: { val: string, label: string }) {
  return (
    <div>
        <p className="text-4xl md:text-6xl font-black text-white mb-2">{val}</p>
        <p className="text-[10px] font-black text-primary tracking-[0.4em]">{label}</p>
    </div>
  );
}
